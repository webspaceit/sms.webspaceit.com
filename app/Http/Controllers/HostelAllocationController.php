<?php

namespace App\Http\Controllers;

use App\Models\HostelAllocation;
use App\Models\HostelRoom;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HostelAllocationController extends Controller
{
    public function index(Request $request): Response
    {
        $roomId = $request->input('hostel_room_id');
        $isActive = $request->input('is_active');

        $query = HostelAllocation::with(['student', 'hostelRoom']);

        if ($roomId) {
            $query->where('hostel_room_id', $roomId);
        }

        if ($isActive !== null) {
            $query->where('is_active', $isActive === '1' || $isActive === 'true');
        }

        $allocations = $query->orderBy('created_at', 'desc')->get();

        $rooms = HostelRoom::orderBy('room_no')->get(['id', 'room_no', 'type']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        return Inertia::render('school/hostel-allocations/index', [
            'allocations' => $allocations,
            'rooms' => $rooms,
            'students' => $students,
            'filters' => [
                'hostel_room_id' => $roomId,
                'is_active' => $isActive,
            ],
        ]);
    }

    public function create(): Response
    {
        $rooms = HostelRoom::orderBy('room_no')->get(['id', 'room_no', 'type', 'capacity']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        return Inertia::render('school/hostel-allocations/form', [
            'rooms' => $rooms,
            'students' => $students,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'hostel_room_id' => 'required|exists:hostel_rooms,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        HostelAllocation::create($validated);

        return redirect()->route('hostel-allocations.index')->with('success', 'Hostel allocation created successfully.');
    }

    public function show($id): Response
    {
        $allocation = HostelAllocation::with(['student', 'hostelRoom'])->findOrFail($id);

        return Inertia::render('school/hostel-allocations/show', [
            'allocation' => $allocation,
        ]);
    }

    public function edit($id): Response
    {
        $allocation = HostelAllocation::findOrFail($id);
        $rooms = HostelRoom::orderBy('room_no')->get(['id', 'room_no', 'type', 'capacity']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        return Inertia::render('school/hostel-allocations/form', [
            'allocation' => $allocation,
            'rooms' => $rooms,
            'students' => $students,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $allocation = HostelAllocation::findOrFail($id);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'hostel_room_id' => 'required|exists:hostel_rooms,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $allocation->update($validated);

        return redirect()->route('hostel-allocations.index')->with('success', 'Hostel allocation updated successfully.');
    }

    public function destroy($id)
    {
        $allocation = HostelAllocation::findOrFail($id);
        $allocation->delete();

        return redirect()->route('hostel-allocations.index')->with('success', 'Hostel allocation deleted successfully.');
    }
}
