<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Student;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BatchAttendanceController extends Controller
{
    public function create(Request $request): Response
    {
        $classId = $request->input('class_id');
        $date = $request->input('date', now()->format('Y-m-d'));

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        $students = collect();

        if ($classId) {
            $students = Student::where('class_id', $classId)
                ->orderBy('roll_no')
                ->get(['id', 'name', 'student_id', 'roll_no']);

            // Load existing attendance for the date
            $existingAttendances = Attendance::whereIn('student_id', $students->pluck('id'))
                ->whereDate('date', $date)
                ->get()
                ->keyBy('student_id');

            $students = $students->map(function ($student) use ($existingAttendances) {
                $existing = $existingAttendances->get($student->id);

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'student_id' => $student->student_id,
                    'roll_no' => $student->roll_no,
                    'status' => $existing ? $existing->status : null,
                    'attendance_id' => $existing ? $existing->id : null,
                ];
            });
        }

        return Inertia::render('school/batch-attendance/create', [
            'classes' => $classes,
            'students' => $students,
            'filters' => [
                'class_id' => $classId,
                'date' => $date,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array|min:1',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|string|max:20',
        ]);

        foreach ($validated['attendances'] as $attendanceData) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $attendanceData['student_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $attendanceData['status'],
                    'marked_by' => Auth::id(),
                ]
            );
        }

        return redirect()->route('batch-attendance.create', [
            'class_id' => $request->input('class_id'),
            'date' => $validated['date'],
        ])->with('success', 'Bulk attendance saved successfully.');
    }
}
