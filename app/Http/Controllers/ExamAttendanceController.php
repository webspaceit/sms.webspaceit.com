<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAttendance;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamAttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $exams = Exam::orderBy('name')->get(['id', 'name']);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        $attendances = collect();
        $selectedExam = null;
        $selectedClass = null;
        $selectedSubject = null;

        if ($request->input('exam_id') && $request->input('class_id') && $request->input('subject_id')) {
            $selectedExam = Exam::find($request->input('exam_id'));
            $selectedClass = SchoolClass::find($request->input('class_id'));
            $selectedSubject = Subject::find($request->input('subject_id'));

            $students = Student::where('class_name', $selectedClass?->name)
                ->orderBy('roll_no')
                ->get();

            $existingAttendances = ExamAttendance::where('exam_id', $request->input('exam_id'))
                ->where('subject_id', $request->input('subject_id'))
                ->get()
                ->keyBy('student_id');

            $attendances = $students->map(function ($student) use ($existingAttendances) {
                $att = $existingAttendances->get($student->id);
                return [
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'roll_no' => $student->roll_no,
                    'student_id_display' => $student->student_id,
                    'present' => $att ? $att->present : false,
                    'attendance_id' => $att?->id,
                ];
            });
        }

        $subjects = Subject::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/exam-attendances/index', [
            'exams' => $exams,
            'classes' => $classes,
            'subjects' => $subjects,
            'attendances' => $attendances,
            'filters' => $request->only(['exam_id', 'class_id', 'subject_id']),
            'selectedExam' => $selectedExam,
            'selectedClass' => $selectedClass,
            'selectedSubject' => $selectedSubject,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.present' => 'required|boolean',
        ]);

        foreach ($validated['attendances'] as $att) {
            ExamAttendance::updateOrCreate(
                [
                    'exam_id' => $validated['exam_id'],
                    'student_id' => $att['student_id'],
                    'subject_id' => $validated['subject_id'],
                ],
                ['present' => $att['present']]
            );
        }

        return redirect()->route('exam-attendances.index', [
            'exam_id' => $validated['exam_id'],
            'class_id' => $request->input('class_id'),
            'subject_id' => $validated['subject_id'],
        ])->with('success', 'Exam attendance saved successfully.');
    }
}
