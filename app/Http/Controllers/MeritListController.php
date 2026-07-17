<?php

namespace App\Http\Controllers;

use App\Models\AcademicReport;
use App\Models\MeritList;
use App\Models\SchoolSetting;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MeritListController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = MeritList::query();

        if ($search) {
            $query->where('class_name', 'like', "%{$search}%")
                ->orWhere('section', 'like', "%{$search}%")
                ->orWhere('exam_name', 'like', "%{$search}%")
                ->orWhere('academic_year', 'like', "%{$search}%");
        }

        $meritLists = $query->latest()->get()->map(function ($list) {
            // Count students in class & section
            $studentsCount = Student::where('class_name', $list->class_name)
                ->where('section', $list->section)
                ->count();

            return [
                'id' => $list->id,
                'class_name' => $list->class_name,
                'section' => $list->section,
                'exam_name' => $list->exam_name,
                'academic_year' => $list->academic_year,
                'students_count' => $studentsCount,
                'created_at' => $list->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('school/merit-lists/index', [
            'meritLists' => $meritLists,
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

        return Inertia::render('school/merit-lists/form', [
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
                Rule::unique('merit_lists')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A merit list configuration for this class, section, exam and academic year already exists.'
        ]);

        MeritList::create($validated);

        return redirect()->route('merit-lists.index')->with('success', 'Merit list configuration created successfully.');
    }

    public function show($id): Response
    {
        $meritList = MeritList::findOrFail($id);

        // Fetch students in this class/section
        $students = Student::where('class_name', $meritList->class_name)
            ->where('section', $meritList->section)
            ->get();

        $studentIds = $students->pluck('id');

        // Fetch reports for these students in this exam/year
        $reports = AcademicReport::with(['student', 'marks'])
            ->whereIn('student_id', $studentIds)
            ->where('exam_name', $meritList->exam_name)
            ->where('academic_year', $meritList->academic_year)
            ->get();

        $passedStudents = [];

        foreach ($reports as $report) {
            $totalMarks = $report->marks->sum('total_marks');
            $hasFail = $report->marks->contains(fn($m) => $m->total_marks < 33);
            $failedCount = $report->marks->filter(fn($m) => $m->total_marks < 33)->count();

            // Skip failed students on the merit list (matching image 1)
            if ($hasFail) {
                continue;
            }

            $gpa = $report->marks->count() > 0 ? round($report->marks->avg('grade_point'), 2) : 0.0;

            if ($gpa >= 5.0) $overallGrade = 'A+';
            elseif ($gpa >= 4.0) $overallGrade = 'A';
            elseif ($gpa >= 3.5) $overallGrade = 'A-';
            elseif ($gpa >= 3.0) $overallGrade = 'B';
            elseif ($gpa >= 2.0) $overallGrade = 'C';
            elseif ($gpa >= 1.0) $overallGrade = 'D';
            else $overallGrade = 'F';

            $passedStudents[] = [
                'id' => $report->student->id,
                'student_id' => $report->student->student_id,
                'name' => $report->student->name,
                'roll_no' => $report->student->roll_no,
                'total_marks' => $totalMarks,
                'gpa' => number_format($gpa, 2),
                'grade' => $overallGrade,
            ];
        }

        // Sort by Total Marks DESC (and secondary sort by Roll No ASC if totals are equal)
        usort($passedStudents, function($a, $b) {
            if ($b['total_marks'] === $a['total_marks']) {
                return $a['roll_no'] <=> $b['roll_no'];
            }
            return $b['total_marks'] <=> $a['total_marks'];
        });

        // Assign Rank Merit Position
        foreach ($passedStudents as $index => &$pStudent) {
            $pStudent['merit'] = $index + 1;
        }
        unset($pStudent);

        return Inertia::render('school/merit-lists/show', [
            'meritList' => $meritList,
            'students' => $passedStudents,
            'school' => [
                'name' => SchoolSetting::where('key', 'school_name')->value('value') ?? 'WSIT School Management System',
                'address' => SchoolSetting::where('key', 'school_address')->value('value') ?? 'House: 55, Road: 16, Sector: 14, Uttara, Dhaka-1230',
                'footer' => SchoolSetting::where('key', 'school_footer')->value('value') ?? 'Powered by: Web Space IT',
            ],
            'generatedDate' => now()->format('jS F, y'),
        ]);
    }

    public function edit($id): Response
    {
        $meritList = MeritList::findOrFail($id);

        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');

        return Inertia::render('school/merit-lists/form', [
            'meritList' => $meritList,
            'classes' => $classes,
            'sections' => $sections,
            'exams' => $exams,
            'years' => $years,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $meritList = MeritList::findOrFail($id);

        $validated = $request->validate([
            'class_name' => [
                'required', 'string', 'max:50',
                Rule::unique('merit_lists')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )->ignore($id)
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A merit list configuration for this class, section, exam and academic year already exists.'
        ]);

        $meritList->update($validated);

        return redirect()->route('merit-lists.index')->with('success', 'Merit list configuration updated successfully.');
    }

    public function destroy($id)
    {
        $meritList = MeritList::findOrFail($id);
        $meritList->delete();

        return redirect()->route('merit-lists.index')->with('success', 'Merit list configuration deleted successfully.');
    }
}
