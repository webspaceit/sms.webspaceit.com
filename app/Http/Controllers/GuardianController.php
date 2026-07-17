<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GuardianController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');

        $query = Guardian::with('students.schoolClass');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('occupation', 'like', "%{$search}%")
                    ->orWhere('district', 'like', "%{$search}%")
                    ->orWhere('nid', 'like', "%{$search}%");
            });
        }

        if ($classId) {
            $query->whereHas('students', fn($q) => $q->where('class_id', $classId));
        }

        if ($sectionId) {
            $query->whereHas('students', fn($q) => $q->where('section_id', $sectionId));
        }

        $guardians = $query->orderBy('name')->get();

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/guardians/index', [
            'guardians' => $guardians,
            'classes' => $classes,
            'sections' => $sections,
            'filters' => [
                'search' => $search,
                'class_id' => $classId,
                'section_id' => $sectionId,
            ],
        ]);
    }

    public function create(): Response
    {
        $students = Student::with('schoolClass')->orderBy('name')->get(['id', 'student_id', 'name', 'roll_no', 'class_id', 'section_id', 'class_name', 'section']);

        return Inertia::render('school/guardians/form', [
            'isEdit' => false,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'occupation' => 'nullable|string|max:255',
            'relation' => 'required|string|max:50',
            'address' => 'nullable|string',
            'district' => 'required|string|max:255',
            'nid' => 'nullable|string|max:50|unique:guardians',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'integer|exists:students,id',
        ]);

        $guardian = Guardian::create($validated);

        if (!empty($validated['student_ids'])) {
            $guardian->students()->attach($validated['student_ids']);
        }

        return redirect()->route('guardians.index')->with('success', 'Guardian created successfully.');
    }

    public function show($id): Response
    {
        $guardian = Guardian::with('students.schoolClass')->findOrFail($id);

        return Inertia::render('school/guardians/show', [
            'guardian' => $guardian,
        ]);
    }

    public function edit($id): Response
    {
        $guardian = Guardian::with('students')->findOrFail($id);
        $students = Student::with('schoolClass')->orderBy('name')->get(['id', 'student_id', 'name', 'roll_no', 'class_id', 'section_id', 'class_name', 'section']);

        return Inertia::render('school/guardians/form', [
            'guardian' => $guardian,
            'isEdit' => true,
            'students' => $students,
        ]);
    }

    public function update(Request $request, $id)
    {
        $guardian = Guardian::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'occupation' => 'nullable|string|max:255',
            'relation' => 'required|string|max:50',
            'address' => 'nullable|string',
            'district' => 'required|string|max:255',
            'nid' => ['nullable', 'string', 'max:50', Rule::unique('guardians')->ignore($id)],
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'integer|exists:students,id',
        ]);

        $guardian->update($validated);

        if (array_key_exists('student_ids', $validated)) {
            $guardian->students()->sync($validated['student_ids'] ?? []);
        }

        return redirect()->route('guardians.index')->with('success', 'Guardian updated successfully.');
    }

    public function destroy($id)
    {
        $guardian = Guardian::findOrFail($id);
        $guardian->students()->detach();
        $guardian->delete();

        return redirect()->route('guardians.index')->with('success', 'Guardian deleted successfully.');
    }
}
