<?php

namespace App\Http\Controllers;

use App\Models\AcademicReport;
use App\Models\SchoolSetting;
use App\Models\SectionResult;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SectionResultController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = SectionResult::query();

        if ($search) {
            $query->where('class_name', 'like', "%{$search}%")
                ->orWhere('section', 'like', "%{$search}%")
                ->orWhere('exam_name', 'like', "%{$search}%")
                ->orWhere('academic_year', 'like', "%{$search}%");
        }

        $sectionResults = $query->latest()->get()->map(function ($result) {
            // Find reports count
            $studentIds = Student::where('class_name', $result->class_name)
                ->where('section', $result->section)
                ->pluck('id');

            $reportsCount = AcademicReport::whereIn('student_id', $studentIds)
                ->where('exam_name', $result->exam_name)
                ->where('academic_year', $result->academic_year)
                ->count();

            return [
                'id' => $result->id,
                'class_name' => $result->class_name,
                'section' => $result->section,
                'exam_name' => $result->exam_name,
                'academic_year' => $result->academic_year,
                'reports_count' => $reportsCount,
                'created_at' => $result->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('school/section-results/index', [
            'sectionResults' => $sectionResults,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');

        return Inertia::render('school/section-results/form', [
            'classes' => $classes,
            'sections' => $sections,
            'exams' => $exams,
            'years' => $years,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_name' => [
                'required', 'string', 'max:50',
                Rule::unique('section_results')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A section results summary for this class, section, exam and academic year already exists.'
        ]);

        SectionResult::create($validated);

        return redirect()->route('section-results.index')->with('success', 'Section results configuration created successfully.');
    }

    public function show($id): Response
    {
        $sectionResult = SectionResult::findOrFail($id);

        // Fetch reports in this section, exam, year
        $reports = AcademicReport::with(['student', 'marks'])
            ->where('exam_name', $sectionResult->exam_name)
            ->where('academic_year', $sectionResult->academic_year)
            ->whereHas('student', function ($q) use ($sectionResult) {
                $q->where('class_name', $sectionResult->class_name)
                  ->where('section', $sectionResult->section);
            })
            ->get();

        $studentsList = [];
        foreach ($reports as $report) {
            $totalMarks = $report->marks->sum('total_marks');
            $hasFail = $report->marks->contains(fn ($m) => $m->total_marks < 33);
            $failedCount = $report->marks->filter(fn ($m) => $m->total_marks < 33)->count();

            if ($report->marks->count() > 0) {
                $gpa = $hasFail ? 0.0 : round($report->marks->avg('grade_point'), 2);
            } else {
                $gpa = 0.0;
            }

            // Convert GPA back to Letter Grade
            if ($hasFail || $gpa < 1.0) $overallGrade = 'F';
            elseif ($gpa >= 5.0) $overallGrade = 'A+';
            elseif ($gpa >= 4.0) $overallGrade = 'A';
            elseif ($gpa >= 3.5) $overallGrade = 'A-';
            elseif ($gpa >= 3.0) $overallGrade = 'B';
            elseif ($gpa >= 2.0) $overallGrade = 'C';
            else $overallGrade = 'D';

            $studentsList[] = [
                'student_id' => $report->student->student_id,
                'roll_no' => $report->student->roll_no,
                'name' => $report->student->name,
                'total_marks' => $hasFail ? '-' : $totalMarks,
                'grade' => $overallGrade,
                'gpa' => $hasFail ? '-' : number_format($gpa, 2),
                'status' => $hasFail ? 'Failed' : 'Passed',
                'failed_subjects_count' => $hasFail ? $failedCount : '-',
            ];
        }

        // Sort by roll no
        usort($studentsList, fn ($a, $b) => $a['roll_no'] <=> $b['roll_no']);

        return Inertia::render('school/section-results/show', [
            'sectionResult' => $sectionResult,
            'students' => $studentsList,
            'school' => [
                'name' => SchoolSetting::where('key', 'school_name')->value('value') ?? 'WSIT School Management System',
                'address' => SchoolSetting::where('key', 'school_address')->value('value') ?? 'House: 55, Road: 16, Sector: 14, Uttara, Dhaka-1230',
                'footer' => SchoolSetting::where('key', 'school_footer')->value('value') ?? 'Powered by: Web Space IT',
            ],
            'generatedDate' => now()->format('jS F,y'), // e.g. 29th June,26
        ]);
    }

    public function edit($id): Response
    {
        $sectionResult = SectionResult::findOrFail($id);

        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');

        return Inertia::render('school/section-results/form', [
            'sectionResult' => $sectionResult,
            'classes' => $classes,
            'sections' => $sections,
            'exams' => $exams,
            'years' => $years,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $sectionResult = SectionResult::findOrFail($id);

        $validated = $request->validate([
            'class_name' => [
                'required', 'string', 'max:50',
                Rule::unique('section_results')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )->ignore($id)
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A section results summary for this class, section, exam and academic year already exists.'
        ]);

        $sectionResult->update($validated);

        return redirect()->route('section-results.index')->with('success', 'Section results configuration updated successfully.');
    }

    public function destroy($id)
    {
        $sectionResult = SectionResult::findOrFail($id);
        $sectionResult->delete();

        return redirect()->route('section-results.index')->with('success', 'Section results configuration deleted successfully.');
    }
}
