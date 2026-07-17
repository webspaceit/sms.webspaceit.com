<?php

namespace App\Http\Controllers;

use App\Models\StaffAttendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffAttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $date = $request->input('date', now()->toDateString());

        $staff = User::whereIn('role', ['teacher', 'accountant', 'receptionist', 'librarian', 'admin', 'superadmin'])
            ->orderBy('name')
            ->get(['id', 'name', 'role', 'email']);

        $existingAttendances = StaffAttendance::where('date', $date)
            ->get()
            ->keyBy('user_id');

        $attendances = $staff->map(function ($user) use ($existingAttendances) {
            $att = $existingAttendances->get($user->id);
            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'email' => $user->email,
                'status' => $att ? $att->status : 'present',
                'attendance_id' => $att?->id,
                'remarks' => $att?->remarks,
            ];
        });

        return Inertia::render('school/staff-attendances/index', [
            'attendances' => $attendances,
            'date' => $date,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.user_id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:present,absent,late,half_day',
            'attendances.*.remarks' => 'nullable|string|max:255',
        ]);

        foreach ($validated['attendances'] as $att) {
            StaffAttendance::updateOrCreate(
                [
                    'user_id' => $att['user_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $att['status'],
                    'remarks' => $att['remarks'] ?? null,
                ]
            );
        }

        return redirect()->route('staff-attendances.index', ['date' => $validated['date']])
            ->with('success', 'Staff attendance saved successfully.');
    }
}
