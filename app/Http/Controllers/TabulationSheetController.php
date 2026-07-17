<?php

namespace App\Http\Controllers;

use App\Models\AcademicReport;
use App\Models\SchoolSetting;
use App\Models\TabulationSheet;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TabulationSheetController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = TabulationSheet::query();

        if ($search) {
            $query->where('class_name', 'like', "%{$search}%")
                ->orWhere('section', 'like', "%{$search}%")
                ->orWhere('exam_name', 'like', "%{$search}%")
                ->orWhere('academic_year', 'like', "%{$search}%");
        }

        $tabulationSheets = $query->latest()->get()->map(function ($sheet) {
            // Count students in class & section
            $studentsCount = Student::where('class_name', $sheet->class_name)
                ->where('section', $sheet->section)
                ->count();

            return [
                'id' => $sheet->id,
                'class_name' => $sheet->class_name,
                'section' => $sheet->section,
                'exam_name' => $sheet->exam_name,
                'academic_year' => $sheet->academic_year,
                'students_count' => $studentsCount,
                'created_at' => $sheet->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('school/tabulation-sheets/index', [
            'tabulationSheets' => $tabulationSheets,
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

        return Inertia::render('school/tabulation-sheets/form', [
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
                Rule::unique('tabulation_sheets')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A tabulation sheet configuration for this class, section, exam and academic year already exists.'
        ]);

        TabulationSheet::create($validated);

        return redirect()->route('tabulation-sheets.index')->with('success', 'Tabulation sheet configuration created successfully.');
    }

    public function show($id): Response
    {
        $tabulationSheet = TabulationSheet::findOrFail($id);

        // Fetch students in this class/section
        $students = Student::where('class_name', $tabulationSheet->class_name)
            ->where('section', $tabulationSheet->section)
            ->get();

        $studentIds = $students->pluck('id');

        // Fetch reports for these students in this exam/year
        $reports = AcademicReport::with(['student', 'marks'])
            ->whereIn('student_id', $studentIds)
            ->where('exam_name', $tabulationSheet->exam_name)
            ->where('academic_year', $tabulationSheet->academic_year)
            ->get();

        // Get unique subjects across all fetched marks to form the horizontal grid headers
        $subjectNames = $reports->flatMap(fn($r) => $r->marks->pluck('subject_name'))->unique()->values()->toArray();

        // Calculate dynamic merits
        // Ranks are based on Total Marks descending for passed students
        $passedStudentsData = [];
        $failedStudentsData = [];
        $participantsCount = $reports->count();

        foreach ($reports as $report) {
            $totalMarks = $report->marks->sum('total_marks');
            $hasFail = $report->marks->contains(fn($m) => $m->total_marks < 33);
            $failedCount = $report->marks->filter(fn($m) => $m->total_marks < 33)->count();

            $gpa = $report->marks->count() > 0 ? round($report->marks->avg('grade_point'), 2) : 0.0;

            if ($hasFail || $gpa < 1.0) $overallGrade = 'F';
            elseif ($gpa >= 5.0) $overallGrade = 'A+';
            elseif ($gpa >= 4.0) $overallGrade = 'A';
            elseif ($gpa >= 3.5) $overallGrade = 'A-';
            elseif ($gpa >= 3.0) $overallGrade = 'B';
            elseif ($gpa >= 2.0) $overallGrade = 'C';
            else $overallGrade = 'D';

            // Gather itemized marks for the subject grid
            $itemizedMarks = [];
            foreach ($subjectNames as $subName) {
                $m = $report->marks->firstWhere('subject_name', $subName);
                $itemizedMarks[$subName] = $m ? [
                    'written' => $m->written_marks,
                    'mcq' => $m->mcq_marks,
                    'practical' => $m->practical_marks,
                    'ca' => $m->ca_marks,
                    'total' => $m->total_marks,
                    'grade' => $m->letter_grade,
                    'gp' => $m->grade_point,
                ] : null;
            }

            $studentData = [
                'id' => $report->student->id,
                'student_id' => $report->student->student_id,
                'name' => $report->student->name,
                'roll_no' => $report->student->roll_no,
                'total_marks' => $totalMarks,
                'gpa' => $hasFail ? 0.0 : $gpa,
                'grade' => $hasFail ? 'F' : $overallGrade,
                'status' => $hasFail ? 'Failed' : 'Passed',
                'failed_count' => $failedCount,
                'marks_list' => $report->marks, // For Vertical details
                'itemized_marks' => $itemizedMarks, // For Horizontal details
            ];

            if ($hasFail) {
                $failedStudentsData[] = $studentData;
            } else {
                $passedStudentsData[] = $studentData;
            }
        }

        // Sort passed students by Total Marks DESC
        usort($passedStudentsData, fn($a, $b) => $b['total_marks'] <=> $a['total_marks']);

        // Assign ranks to passed students
        foreach ($passedStudentsData as $index => &$pData) {
            $pData['merit'] = $index + 1;
        }
        unset($pData);

        // Sort failed students by roll no and set merit as '-'
        usort($failedStudentsData, fn($a, $b) => $a['roll_no'] <=> $b['roll_no']);
        foreach ($failedStudentsData as &$fData) {
            $fData['merit'] = '-';
        }
        unset($fData);

        // Combine for output
        $combinedStudents = array_merge($passedStudentsData, $failedStudentsData);

        // Sort the combined list by roll no (or keep it sorted by merit then failed).
        // Standard Tabulation sheet displays them ordered by roll no for readability.
        // Let's sort by Roll No so it lists Roll 1, 2, 3... but keeps the calculated Merit Position!
        usort($combinedStudents, fn($a, $b) => $a['roll_no'] <=> $b['roll_no']);

        $totalPass = count($passedStudentsData);
        $totalFail = count($failedStudentsData);
        $passRate = $participantsCount > 0 ? round(($totalPass / $participantsCount) * 100, 2) : 0;

        return Inertia::render('school/tabulation-sheets/show', [
            'tabulationSheet' => $tabulationSheet,
            'students' => $combinedStudents,
            'subjects' => $subjectNames,
            'summary' => [
                'total_students' => $students->count(),
                'exam_participants' => $participantsCount,
                'total_pass' => $totalPass,
                'total_fail' => $totalFail,
                'pass_rate' => $passRate,
            ],
            'school' => [
                'name' => SchoolSetting::where('key', 'school_name')->value('value') ?? 'WSIT School Management System',
                'address' => SchoolSetting::where('key', 'school_address')->value('value') ?? 'Holding No. 00-0865, Gulshan Para, Chuadanga',
                'footer' => SchoolSetting::where('key', 'school_footer')->value('value') ?? 'Powered by: Web Space IT',
            ],
            'generatedDate' => now()->format('jS F, y'), // e.g. 29th June, 2026
        ]);
    }

    public function edit($id): Response
    {
        $tabulationSheet = TabulationSheet::findOrFail($id);

        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');

        return Inertia::render('school/tabulation-sheets/form', [
            'tabulationSheet' => $tabulationSheet,
            'classes' => $classes,
            'sections' => $sections,
            'exams' => $exams,
            'years' => $years,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $tabulationSheet = TabulationSheet::findOrFail($id);

        $validated = $request->validate([
            'class_name' => [
                'required', 'string', 'max:50',
                Rule::unique('tabulation_sheets')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )->ignore($id)
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
        ], [
            'class_name.unique' => 'A tabulation sheet configuration for this class, section, exam and academic year already exists.'
        ]);

        $tabulationSheet->update($validated);

        return redirect()->route('tabulation-sheets.index')->with('success', 'Tabulation sheet configuration updated successfully.');
    }

    public function destroy($id)
    {
        $tabulationSheet = TabulationSheet::findOrFail($id);
        $tabulationSheet->delete();

        return redirect()->route('tabulation-sheets.index')->with('success', 'Tabulation sheet configuration deleted successfully.');
    }
}
