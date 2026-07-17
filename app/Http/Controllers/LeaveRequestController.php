<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\Teacher;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $teacherId = $request->input('teacher_id');
        $status = $request->input('status');
        $type = $request->input('type');

        $query = LeaveRequest::with('teacher');

        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($type) {
            $query->where('type', $type);
        }

        $leaveRequests = $query->orderBy('created_at', 'desc')->get();

        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/leave-requests/index', [
            'leaveRequests' => $leaveRequests,
            'teachers' => $teachers,
            'filters' => [
                'teacher_id' => $teacherId,
                'status' => $status,
                'type' => $type,
            ],
        ]);
    }

    public function create(): Response
    {
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/leave-requests/form', [
            'teachers' => $teachers,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'type' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'status' => 'nullable|string|max:20',
            'admin_remarks' => 'nullable|string',
        ]);

        LeaveRequest::create($validated);

        return redirect()->route('leave-requests.index')->with('success', 'Leave request created successfully.');
    }

    public function show($id): Response
    {
        $leaveRequest = LeaveRequest::with('teacher')->findOrFail($id);

        return Inertia::render('school/leave-requests/show', [
            'leaveRequest' => $leaveRequest,
        ]);
    }

    public function edit($id): Response
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/leave-requests/form', [
            'leaveRequest' => $leaveRequest,
            'teachers' => $teachers,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'type' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'status' => 'nullable|string|max:20',
            'admin_remarks' => 'nullable|string',
            'approved_by' => 'nullable|integer|exists:users,id',
        ]);

        $leaveRequest->update($validated);

        return redirect()->route('leave-requests.index')->with('success', 'Leave request updated successfully.');
    }

    public function destroy($id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->delete();

        return redirect()->route('leave-requests.index')->with('success', 'Leave request deleted successfully.');
    }
}
