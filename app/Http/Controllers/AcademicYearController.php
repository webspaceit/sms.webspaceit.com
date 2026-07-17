<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = AcademicYear::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $academicYears = $query->orderBy('start_date', 'desc')->get();

        return Inertia::render('school/academic-years/index', [
            'academicYears' => $academicYears,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/academic-years/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_current' => 'boolean',
        ]);

        if ($validated['is_current'] ?? false) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        AcademicYear::create($validated);

        return redirect()->route('academic-years.index')->with('success', 'Academic year created successfully.');
    }

    public function show($id): Response
    {
        $academicYear = AcademicYear::findOrFail($id);

        return Inertia::render('school/academic-years/show', [
            'academicYear' => $academicYear,
        ]);
    }

    public function edit($id): Response
    {
        $academicYear = AcademicYear::findOrFail($id);

        return Inertia::render('school/academic-years/form', [
            'academicYear' => $academicYear,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_current' => 'boolean',
        ]);

        if ($validated['is_current'] ?? false) {
            AcademicYear::where('is_current', true)->where('id', '!=', $id)->update(['is_current' => false]);
        }

        $academicYear->update($validated);

        return redirect()->route('academic-years.index')->with('success', 'Academic year updated successfully.');
    }

    public function destroy($id)
    {
        $academicYear = AcademicYear::findOrFail($id);
        $academicYear->delete();

        return redirect()->route('academic-years.index')->with('success', 'Academic year deleted successfully.');
    }
}
