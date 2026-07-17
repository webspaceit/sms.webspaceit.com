<?php

namespace App\Http\Controllers;

use App\Models\ClassRoutine;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassRoutineController extends Controller
{
    public function index(Request $request): Response
    {
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');
        $dayOfWeek = $request->input('day_of_week');

        $query = ClassRoutine::with(['schoolClass', 'subject', 'teacher']);

        if ($classId) {
            $query->where('class_id', $classId);
        }

        if ($sectionId) {
            $query->where('section_id', $sectionId);
        }

        if ($dayOfWeek) {
            $query->where('day_of_week', $dayOfWeek);
        }

        $routines = $query->orderBy('day_of_week')->orderBy('start_time')->get();

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/class-routines/index', [
            'routines' => $routines,
            'classes' => $classes,
            'sections' => $sections,
            'filters' => [
                'class_id' => $classId,
                'section_id' => $sectionId,
                'day_of_week' => $dayOfWeek,
            ],
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/class-routines/form', [
            'classes' => $classes,
            'sections' => $sections,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'day_of_week' => 'required|integer|min:1|max:7',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'room' => 'nullable|string|max:50',
        ]);

        ClassRoutine::create($validated);

        return redirect()->route('class-routines.index')->with('success', 'Class routine created successfully.');
    }

    public function show($id): Response
    {
        $routine = ClassRoutine::with(['schoolClass', 'subject', 'teacher'])->findOrFail($id);

        return Inertia::render('school/class-routines/show', [
            'routine' => $routine,
        ]);
    }

    public function edit($id): Response
    {
        $routine = ClassRoutine::findOrFail($id);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/class-routines/form', [
            'routine' => $routine,
            'classes' => $classes,
            'sections' => $sections,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $routine = ClassRoutine::findOrFail($id);

        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'required|exists:sections,id',
            'day_of_week' => 'required|integer|min:1|max:7',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'room' => 'nullable|string|max:50',
        ]);

        $routine->update($validated);

        return redirect()->route('class-routines.index')->with('success', 'Class routine updated successfully.');
    }

    public function destroy($id)
    {
        $routine = ClassRoutine::findOrFail($id);
        $routine->delete();

        return redirect()->route('class-routines.index')->with('success', 'Class routine deleted successfully.');
    }
}
