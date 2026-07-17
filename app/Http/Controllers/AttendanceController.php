<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $classId    = $request->input('class_id');
        $sectionId  = $request->input('section_id');
        $date       = $request->input('date');
        $dateFrom   = $request->input('date_from');
        $dateTo     = $request->input('date_to');
        $status     = $request->input('status');
        $search     = $request->input('search');
        $perPage    = min(100, max(10, (int) ($request->input('per_page', 20))));

        $query = Attendance::with(['student.schoolClass', 'student.section'])
            ->latest('date')
            ->orderBy('id', 'desc');

        if ($classId) {
            $query->whereHas('student', fn ($q) => $q->where('class_id', $classId));
        }
        if ($sectionId) {
            $query->whereHas('student', fn ($q) => $q->where('section_id', $sectionId));
        }
        if ($date) {
            $query->whereDate('date', $date);
        } elseif ($dateFrom && $dateTo) {
            $query->whereBetween('date', [$dateFrom, $dateTo]);
        } elseif ($dateFrom) {
            $query->whereDate('date', '>=', $dateFrom);
        } elseif ($dateTo) {
            $query->whereDate('date', '<=', $dateTo);
        }
        if ($status) {
            $query->where('status', $status);
        }
        if ($search) {
            $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('student_id', 'like', "%{$search}%"));
        }

        $attendance = $query->paginate($perPage)->through(fn ($row) => [
            'id'         => $row->id,
            'student_id' => $row->student_id,
            'name'       => $row->student?->name ?? '—',
            'class_name' => $row->student?->schoolClass?->name ?? $row->student?->class_name ?? '—',
            'section'    => $row->student?->section?->name ?? $row->student?->section ?? '—',
            'roll_no'    => $row->student?->roll_no ?? '—',
            'date'       => $row->date,
            'status'     => $row->status,
            'marked_by'  => $row->marked_by,
        ]);

        $classes  = \App\Models\SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = \App\Models\Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/attendance', [
            'attendance' => $attendance,
            'classes'    => $classes,
            'sections'   => $sections,
            'filters'    => [
                'class_id'  => $classId,
                'section_id'=> $sectionId,
                'date'      => $date,
                'date_from' => $dateFrom,
                'date_to'   => $dateTo,
                'status'    => $status,
                'search'    => $search,
                'per_page'  => $perPage,
            ],
        ]);
    }

    public function create(): Response
    {
        $students = Student::orderBy('class_name')->orderBy('roll_no')->get();

        return Inertia::render('school/attendance-form', [
            'students' => $students,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'status' => 'required|string|max:20',
            'marked_by' => 'nullable|string|max:255',
        ]);

        Attendance::updateOrCreate(
            ['student_id' => $validated['student_id'], 'date' => $validated['date']],
            [
                'status' => $validated['status'],
                'marked_by' => $validated['marked_by'] ?? 'Class Teacher',
            ]
        );

        return redirect()->route('attendance.index')->with('success', 'Attendance marked successfully.');
    }

    public function edit($id): Response
    {
        $attendance = Attendance::with('student')->findOrFail($id);
        $students = Student::orderBy('class_name')->orderBy('roll_no')->get();

        return Inertia::render('school/attendance-form', [
            'attendance' => [
                'id' => $attendance->id,
                'student_id' => $attendance->student_id,
                'date' => $attendance->date,
                'status' => $attendance->status,
                'marked_by' => $attendance->marked_by,
            ],
            'students' => $students,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'status' => 'required|string|max:20',
            'marked_by' => 'nullable|string|max:255',
        ]);

        $attendance->update($validated);

        return redirect()->route('attendance.index')->with('success', 'Attendance updated successfully.');
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return redirect()->route('attendance.index')->with('success', 'Attendance record deleted successfully.');
    }
}
