<?php

namespace App\Http\Controllers;

use App\Models\AcademicReport;
use App\Models\AcademicReportMark;
use App\Models\SchoolClass;
use App\Models\SchoolSetting;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $reportsQuery = AcademicReport::with(['student', 'marks']);

        if ($search) {
            $reportsQuery->whereHas('student', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%")
                    ->orWhere('class_name', 'like', "%{$search}%");
            })->orWhere('exam_name', 'like', "%{$search}%")
              ->orWhere('academic_year', 'like', "%{$search}%");
        }

        $reports = $reportsQuery->latest()->get()->map(function ($report) {
            // Calculate overall stats
            $totalMarks = $report->marks->sum('total_marks');
            
            $hasFail = $report->marks->contains(fn ($m) => $m->letter_grade === 'F');
            $failedCount = $report->marks->filter(fn ($m) => $m->letter_grade === 'F')->count();

            if ($report->marks->count() > 0) {
                $averageGpa = $hasFail ? 0.0 : round($report->marks->avg('grade_point'), 2);
            } else {
                $averageGpa = 0.0;
            }

            // Convert GPA back to Letter Grade
            if ($hasFail || $averageGpa < 1.0) $overallGrade = 'F';
            elseif ($averageGpa >= 5.0) $overallGrade = 'A+';
            elseif ($averageGpa >= 4.0) $overallGrade = 'A';
            elseif ($averageGpa >= 3.5) $overallGrade = 'A-';
            elseif ($averageGpa >= 3.0) $overallGrade = 'B';
            elseif ($averageGpa >= 2.0) $overallGrade = 'C';
            else $overallGrade = 'D';

            return [
                'id' => $report->id,
                'student_name' => $report->student->name,
                'student_id' => $report->student->student_id,
                'class_name' => $report->student->class_name,
                'section' => $report->student->section,
                'roll_no' => $report->student->roll_no,
                'exam_name' => $report->exam_name,
                'academic_year' => $report->academic_year,
                'total_marks' => $totalMarks,
                'gpa' => $averageGpa,
                'grade' => $overallGrade,
                'status' => $hasFail ? 'Failed' : 'Passed',
                'failed_subjects_count' => $failedCount,
            ];
        });

        return Inertia::render('school/reports/index', [
            'reports' => $reports,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $students = Student::all();
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);
        
        $defaultSubjects = [
            ['subject_name' => 'BD & Glob.Studies', 'full_marks' => 100, 'highest_marks' => 86, 'written_marks' => 55, 'mcq_marks' => 21, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Agriculture', 'full_marks' => 100, 'highest_marks' => 93, 'written_marks' => 55, 'mcq_marks' => 12, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Physical and Mental Health Education', 'full_marks' => 100, 'highest_marks' => 79, 'written_marks' => 45, 'mcq_marks' => 11, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Life and Livelihood', 'full_marks' => 100, 'highest_marks' => 91, 'written_marks' => 60, 'mcq_marks' => 12, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Arts and Crafts', 'full_marks' => 100, 'highest_marks' => 89, 'written_marks' => 65, 'mcq_marks' => 2, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Social Science', 'full_marks' => 100, 'highest_marks' => 88, 'written_marks' => 65, 'mcq_marks' => 21, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Arabic-II', 'full_marks' => 100, 'highest_marks' => 78, 'written_marks' => 43, 'mcq_marks' => 24, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Bangla 1st.', 'full_marks' => 100, 'highest_marks' => 79, 'written_marks' => 56, 'mcq_marks' => 21, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'English 1st.', 'full_marks' => 100, 'highest_marks' => 95, 'written_marks' => 67, 'mcq_marks' => 23, 'practical_marks' => null, 'ca_marks' => null],
            ['subject_name' => 'Mathematics', 'full_marks' => 100, 'highest_marks' => 99, 'written_marks' => 55, 'mcq_marks' => 30, 'practical_marks' => null, 'ca_marks' => null],
        ];

        return Inertia::render('school/reports/form', [
            'students' => $students,
            'classes' => $classes,
            'sections' => $sections,
            'defaultSubjects' => $defaultSubjects,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_name' => 'required|string|max:100',
            'academic_year' => 'required|string|max:20',
            'class_position' => 'nullable|integer',
            'working_days' => 'required|integer|min:0',
            'present_days' => 'required|integer|min:0',
            'absent_days' => 'required|integer|min:0',
            'moral_evaluation' => 'nullable|string|max:50',
            'co_curricular' => 'nullable|array',
            'comments' => 'nullable|string',
            'marks' => 'required|array|min:1',
            'marks.*.subject_name' => 'required|string|max:100',
            'marks.*.full_marks' => 'required|integer|min:1',
            'marks.*.highest_marks' => 'required|integer|min:0',
            'marks.*.written_marks' => 'nullable|integer|min:0',
            'marks.*.mcq_marks' => 'nullable|integer|min:0',
            'marks.*.practical_marks' => 'nullable|integer|min:0',
            'marks.*.ca_marks' => 'nullable|integer|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $report = AcademicReport::create([
                'student_id' => $validated['student_id'],
                'exam_name' => $validated['exam_name'],
                'academic_year' => $validated['academic_year'],
                'class_position' => $validated['class_position'],
                'working_days' => $validated['working_days'],
                'present_days' => $validated['present_days'],
                'absent_days' => $validated['absent_days'],
                'moral_evaluation' => $validated['moral_evaluation'],
                'co_curricular' => $validated['co_curricular'],
                'comments' => $validated['comments'],
            ]);

            foreach ($validated['marks'] as $markData) {
                $report->marks()->create($markData);
            }
        });

        return redirect()->route('reports.index')->with('success', 'Academic report created successfully.');
    }

    public function edit($id): Response
    {
        $report = AcademicReport::with('marks')->findOrFail($id);
        $students = Student::all();
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/reports/form', [
            'report' => $report,
            'students' => $students,
            'classes' => $classes,
            'sections' => $sections,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $report = AcademicReport::findOrFail($id);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_name' => 'required|string|max:100',
            'academic_year' => 'required|string|max:20',
            'class_position' => 'nullable|integer',
            'working_days' => 'required|integer|min:0',
            'present_days' => 'required|integer|min:0',
            'absent_days' => 'required|integer|min:0',
            'moral_evaluation' => 'nullable|string|max:50',
            'co_curricular' => 'nullable|array',
            'comments' => 'nullable|string',
            'marks' => 'required|array|min:1',
            'marks.*.subject_name' => 'required|string|max:100',
            'marks.*.full_marks' => 'required|integer|min:1',
            'marks.*.highest_marks' => 'required|integer|min:0',
            'marks.*.written_marks' => 'nullable|integer|min:0',
            'marks.*.mcq_marks' => 'nullable|integer|min:0',
            'marks.*.practical_marks' => 'nullable|integer|min:0',
            'marks.*.ca_marks' => 'nullable|integer|min:0',
        ]);

        DB::transaction(function () use ($report, $validated) {
            $report->update([
                'student_id' => $validated['student_id'],
                'exam_name' => $validated['exam_name'],
                'academic_year' => $validated['academic_year'],
                'class_position' => $validated['class_position'],
                'working_days' => $validated['working_days'],
                'present_days' => $validated['present_days'],
                'absent_days' => $validated['absent_days'],
                'moral_evaluation' => $validated['moral_evaluation'],
                'co_curricular' => $validated['co_curricular'],
                'comments' => $validated['comments'],
            ]);

            // Sync marks: delete old and recreate
            $report->marks()->delete();
            foreach ($validated['marks'] as $markData) {
                $report->marks()->create($markData);
            }
        });

        return redirect()->route('reports.index')->with('success', 'Academic report updated successfully.');
    }

    public function destroy($id)
    {
        $report = AcademicReport::findOrFail($id);
        $report->delete();

        return redirect()->route('reports.index')->with('success', 'Academic report deleted successfully.');
    }

    public function calculatePosition(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_name' => 'required|string|max:100',
            'academic_year' => 'required|string|max:20',
            'total_marks' => 'required|integer|min:0',
            'exclude_report_id' => 'nullable|integer|exists:academic_reports,id',
        ]);

        $student = Student::findOrFail($validated['student_id']);

        $reports = AcademicReport::with('marks')
            ->where('exam_name', $validated['exam_name'])
            ->where('academic_year', $validated['academic_year'])
            ->whereHas('student', fn ($q) => $q->where('class_name', $student->class_name))
            ->when($validated['exclude_report_id'] ?? null, fn ($q, $id) => $q->where('id', '!=', $id))
            ->get()
            ->map(fn ($r) => $r->marks->sum(fn ($m) => ($m->written_marks ?? 0) + ($m->mcq_marks ?? 0) + ($m->practical_marks ?? 0) + ($m->ca_marks ?? 0)))
            ->push($validated['total_marks'])
            ->sortDesc()
            ->values();

        $position = $reports->search(fn ($total) => $total === (int) $validated['total_marks']) + 1;

        return response()->json(['position' => $position]);
    }

    public function show($id): Response
    {
        $report = AcademicReport::with(['student', 'marks'])->findOrFail($id);

        // Calculate overall stats for show page
        $totalFullMarks = $report->marks->sum('full_marks');
        $totalObtainedMarks = $report->marks->sum('total_marks');
        
        $hasFail = $report->marks->contains(fn ($m) => $m->letter_grade === 'F');
        $failedCount = $report->marks->filter(fn ($m) => $m->letter_grade === 'F')->count();

        if ($report->marks->count() > 0) {
            $averageGpa = $hasFail ? 0.0 : round($report->marks->avg('grade_point'), 2);
        } else {
            $averageGpa = 0.0;
        }

        // Convert GPA back to Letter Grade
        if ($hasFail || $averageGpa < 1.0) $overallGrade = 'F';
        elseif ($averageGpa >= 5.0) $overallGrade = 'A+';
        elseif ($averageGpa >= 4.0) $overallGrade = 'A';
        elseif ($averageGpa >= 3.5) $overallGrade = 'A-';
        elseif ($averageGpa >= 3.0) $overallGrade = 'B';
        elseif ($averageGpa >= 2.0) $overallGrade = 'C';
        else $overallGrade = 'D';

        // Cache school settings (changes rarely, hit by every result view)
        $school = Cache::remember('school_settings_front', 3600, function () {
            $settings = SchoolSetting::all()->pluck('value', 'key');
            return [
                'name' => $settings->get('school_name', 'WSIT School Management System'),
                'address' => $settings->get('school_address', 'Holding No. 00-0865, Gulshan Para, Chuadanga'),
                'footer' => $settings->get('school_footer', 'Powered by: Web Space IT'),
            ];
        });

        return Inertia::render('school/reports/show', [
            'report' => $report,
            'calculated' => [
                'total_full_marks' => $totalFullMarks,
                'total_obtained_marks' => $totalObtainedMarks,
                'gpa' => $averageGpa,
                'grade' => $overallGrade,
                'status' => $hasFail ? 'Failed' : 'Passed',
                'failed_count' => $failedCount,
            ],
            'school' => $school,
        ]);
    }
}
