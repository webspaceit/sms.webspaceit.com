<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = Exam::with('academicYear');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $exams = $query->orderBy('start_date', 'desc')->get();

        return Inertia::render('school/exams/index', [
            'exams' => $exams,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get(['id', 'name']);

        return Inertia::render('school/exams/form', [
            'academicYears' => $academicYears,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'academic_year_id' => 'required|exists:academic_years,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        Exam::create($validated);

        return redirect()->route('exams.index')->with('success', 'Exam created successfully.');
    }

    public function show($id): Response
    {
        $exam = Exam::with(['academicYear', 'examSchedules'])->findOrFail($id);

        return Inertia::render('school/exams/show', [
            'exam' => $exam,
        ]);
    }

    public function edit($id): Response
    {
        $exam = Exam::findOrFail($id);
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get(['id', 'name']);

        return Inertia::render('school/exams/form', [
            'exam' => $exam,
            'academicYears' => $academicYears,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $exam = Exam::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'academic_year_id' => 'required|exists:academic_years,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        $exam->update($validated);

        return redirect()->route('exams.index')->with('success', 'Exam updated successfully.');
    }

    public function destroy($id)
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();

        return redirect()->route('exams.index')->with('success', 'Exam deleted successfully.');
    }
}
