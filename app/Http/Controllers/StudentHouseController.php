<?php

namespace App\Http\Controllers;

use App\Models\StudentHouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentHouseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = StudentHouse::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('name_bn', 'like', "%{$search}%");
            });
        }

        $studentHouses = $query->orderBy('name')->get();

        return Inertia::render('school/student-houses/index', [
            'studentHouses' => $studentHouses,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/student-houses/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        StudentHouse::create($validated);

        return redirect()->route('student-houses.index')->with('success', 'Student house created successfully.');
    }

    public function show($id): Response
    {
        $studentHouse = StudentHouse::findOrFail($id);

        return Inertia::render('school/student-houses/show', [
            'studentHouse' => $studentHouse,
        ]);
    }

    public function edit($id): Response
    {
        $studentHouse = StudentHouse::findOrFail($id);

        return Inertia::render('school/student-houses/form', [
            'studentHouse' => $studentHouse,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $studentHouse = StudentHouse::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $studentHouse->update($validated);

        return redirect()->route('student-houses.index')->with('success', 'Student house updated successfully.');
    }

    public function destroy($id)
    {
        $studentHouse = StudentHouse::findOrFail($id);
        $studentHouse->delete();

        return redirect()->route('student-houses.index')->with('success', 'Student house deleted successfully.');
    }
}
