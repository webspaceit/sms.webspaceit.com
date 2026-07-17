<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\TeacherAttendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherAttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $teacherId = $request->input('teacher_id');
        $date = $request->input('date');
        $status = $request->input('status');

        $query = TeacherAttendance::with('teacher');

        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($date) {
            $query->whereDate('date', $date);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $attendances = $query->orderBy('date', 'desc')->orderBy('teacher_id')->get();

        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/teacher-attendances/index', [
            'attendances' => $attendances,
            'teachers' => $teachers,
            'filters' => [
                'teacher_id' => $teacherId,
                'date' => $date,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/teacher-attendances/form', [
            'teachers' => $teachers,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'date' => 'required|date',
            'status' => 'required|string|max:20',
            'remarks' => 'nullable|string|max:255',
        ]);

        TeacherAttendance::create($validated);

        return redirect()->route('teacher-attendance.index')->with('success', 'Teacher attendance recorded successfully.');
    }

    public function show($id): Response
    {
        $attendance = TeacherAttendance::with('teacher')->findOrFail($id);

        return Inertia::render('school/teacher-attendances/show', [
            'attendance' => $attendance,
        ]);
    }

    public function edit($id): Response
    {
        $attendance = TeacherAttendance::findOrFail($id);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/teacher-attendances/form', [
            'attendance' => $attendance,
            'teachers' => $teachers,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $attendance = TeacherAttendance::findOrFail($id);

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'date' => 'required|date',
            'status' => 'required|string|max:20',
            'remarks' => 'nullable|string|max:255',
        ]);

        $attendance->update($validated);

        return redirect()->route('teacher-attendance.index')->with('success', 'Teacher attendance updated successfully.');
    }

    public function destroy($id)
    {
        $attendance = TeacherAttendance::findOrFail($id);
        $attendance->delete();

        return redirect()->route('teacher-attendance.index')->with('success', 'Teacher attendance deleted successfully.');
    }
}
