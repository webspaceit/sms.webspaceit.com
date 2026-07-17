<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentTransport;
use App\Models\TransportRoute;
use App\Models\TransportStop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentTransportController extends Controller
{
    public function index(Request $request): Response
    {
        $routeId = $request->input('transport_route_id');
        $isActive = $request->input('is_active');

        $query = StudentTransport::with(['student', 'transportRoute', 'transportStop']);

        if ($routeId) {
            $query->where('transport_route_id', $routeId);
        }

        if ($isActive !== null) {
            $query->where('is_active', $isActive === '1' || $isActive === 'true');
        }

        $assignments = $query->orderBy('created_at', 'desc')->get();

        $routes = TransportRoute::orderBy('name')->get(['id', 'name']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        return Inertia::render('school/student-transport/index', [
            'assignments' => $assignments,
            'routes' => $routes,
            'students' => $students,
            'filters' => [
                'transport_route_id' => $routeId,
                'is_active' => $isActive,
            ],
        ]);
    }

    public function create(): Response
    {
        $routes = TransportRoute::orderBy('name')->get(['id', 'name']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        return Inertia::render('school/student-transport/form', [
            'routes' => $routes,
            'students' => $students,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'transport_route_id' => 'required|exists:transport_routes,id',
            'transport_stop_id' => 'nullable|exists:transport_stops,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        StudentTransport::create($validated);

        return redirect()->route('student-transport.index')->with('success', 'Student transport assignment created successfully.');
    }

    public function show($id): Response
    {
        $assignment = StudentTransport::with(['student', 'transportRoute', 'transportStop'])->findOrFail($id);

        return Inertia::render('school/student-transport/show', [
            'assignment' => $assignment,
        ]);
    }

    public function edit($id): Response
    {
        $assignment = StudentTransport::findOrFail($id);
        $routes = TransportRoute::orderBy('name')->get(['id', 'name']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);
        $stops = TransportStop::where('transport_route_id', $assignment->transport_route_id)->orderBy('sort_order')->get(['id', 'name']);

        return Inertia::render('school/student-transport/form', [
            'assignment' => $assignment,
            'routes' => $routes,
            'students' => $students,
            'stops' => $stops,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $assignment = StudentTransport::findOrFail($id);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'transport_route_id' => 'required|exists:transport_routes,id',
            'transport_stop_id' => 'nullable|exists:transport_stops,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        $assignment->update($validated);

        return redirect()->route('student-transport.index')->with('success', 'Student transport assignment updated successfully.');
    }

    public function destroy($id)
    {
        $assignment = StudentTransport::findOrFail($id);
        $assignment->delete();

        return redirect()->route('student-transport.index')->with('success', 'Student transport assignment deleted successfully.');
    }
}
