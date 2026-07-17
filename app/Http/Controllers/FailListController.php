<?php

namespace App\Http\Controllers;

use App\Models\AcademicReport;
use App\Models\FailList;
use App\Models\SchoolSetting;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FailListController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = FailList::query();

        if ($search) {
            $query->where('class_name', 'like', "%{$search}%")
                ->orWhere('section', 'like', "%{$search}%")
                ->orWhere('exam_name', 'like', "%{$search}%")
                ->orWhere('academic_year', 'like', "%{$search}%");
        }

        $failLists = $query->latest()->get()->map(function ($failList) {
            // Find students in this class and section
            $studentIds = Student::where('class_name', $failList->class_name)
                ->where('section', $failList->section)
                ->pluck('id');

            // Find their reports matching exam and year
            $reports = AcademicReport::with('marks')
                ->whereIn('student_id', $studentIds)
                ->where('exam_name', $failList->exam_name)
                ->where('academic_year', $failList->academic_year)
                ->get();

            // Count failed students (students who have at least one mark < 33)
            $failedCount = $reports->filter(function ($report) {
                return $report->marks->contains(fn ($m) => $m->total_marks < 33);
            })->count();

            return [
                'id' => $failList->id,
                'class_name' => $failList->class_name,
                'section' => $failList->section,
                'exam_name' => $failList->exam_name,
                'academic_year' => $failList->academic_year,
                'failed_students_count' => $failedCount,
                'created_at' => $failList->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('school/fail-lists/index', [
            'failLists' => $failLists,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        // Fetch distinct values to help user select options easily
        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');

        return Inertia::render('school/fail-lists/form', [
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
                Rule::unique('fail_lists')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A fail list summary for this class, section, exam and academic year already exists.'
        ]);

        FailList::create($validated);

        return redirect()->route('fail-lists.index')->with('success', 'Fail list configuration created successfully.');
    }

    public function show($id): Response
    {
        $failList = FailList::findOrFail($id);

        // Find students in this class/section
        $students = Student::where('class_name', $failList->class_name)
            ->where('section', $failList->section)
            ->get();

        $studentIds = $students->pluck('id');

        // Fetch their reports
        $reports = AcademicReport::with(['student', 'marks'])
            ->whereIn('student_id', $studentIds)
            ->where('exam_name', $failList->exam_name)
            ->where('academic_year', $failList->academic_year)
            ->get();

        $failedStudentsData = [];
        foreach ($reports as $report) {
            // A subject is failed if obtained total marks is less than 33
            $failedSubjects = $report->marks->filter(fn ($m) => $m->total_marks < 33);

            if ($failedSubjects->count() > 0) {
                // Formulate subjects string like: Bangla (15.0), English (20.0)
                $subjectsStrList = $failedSubjects->map(function ($m) {
                    $obtained = number_format((float) $m->total_marks, 1);
                    return "{$m->subject_name} ({$obtained})";
                })->implode(', ');

                $failedStudentsData[] = [
                    'student_id' => $report->student->student_id,
                    'roll_no' => $report->student->roll_no,
                    'name' => $report->student->name,
                    'failed_subjects_count' => $failedSubjects->count(),
                    'failed_subjects_list' => $subjectsStrList,
                ];
            }
        }

        // Sort by roll no
        usort($failedStudentsData, fn ($a, $b) => $a['roll_no'] <=> $b['roll_no']);

        return Inertia::render('school/fail-lists/show', [
            'failList' => $failList,
            'failedStudents' => $failedStudentsData,
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
        $failList = FailList::findOrFail($id);
        
        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');

        return Inertia::render('school/fail-lists/form', [
            'failList' => $failList,
            'classes' => $classes,
            'sections' => $sections,
            'exams' => $exams,
            'years' => $years,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $failList = FailList::findOrFail($id);

        $validated = $request->validate([
            'class_name' => [
                'required', 'string', 'max:50',
                Rule::unique('fail_lists')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )->ignore($id)
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A fail list summary for this class, section, exam and academic year already exists.'
        ]);

        $failList->update($validated);

        return redirect()->route('fail-lists.index')->with('success', 'Fail list configuration updated successfully.');
    }

    public function destroy($id)
    {
        $failList = FailList::findOrFail($id);
        $failList->delete();

        return redirect()->route('fail-lists.index')->with('success', 'Fail list configuration deleted successfully.');
    }
}
