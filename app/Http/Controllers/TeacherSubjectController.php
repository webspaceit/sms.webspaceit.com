<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherSubjectController extends Controller
{
    public function index(Request $request): Response
    {
        $teacherId = $request->input('teacher_id');
        $classId = $request->input('class_id');

        $query = TeacherSubject::with(['teacher', 'schoolClass', 'subject']);

        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($classId) {
            $query->where('class_id', $classId);
        }

        $assignments = $query->orderBy('teacher_id')->orderBy('class_id')->get();

        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/teacher-subjects/index', [
            'assignments' => $assignments,
            'teachers' => $teachers,
            'classes' => $classes,
            'filters' => [
                'teacher_id' => $teacherId,
                'class_id' => $classId,
            ],
        ]);
    }

    public function create(): Response
    {
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('school/teacher-subjects/form', [
            'teachers' => $teachers,
            'classes' => $classes,
            'subjects' => $subjects,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'is_class_teacher' => 'boolean',
        ]);

        TeacherSubject::create($validated);

        return redirect()->route('teacher-subjects.index')->with('success', 'Teacher subject assignment created successfully.');
    }

    public function show($id): Response
    {
        $assignment = TeacherSubject::with(['teacher', 'schoolClass', 'subject'])->findOrFail($id);

        return Inertia::render('school/teacher-subjects/show', [
            'assignment' => $assignment,
        ]);
    }

    public function edit($id): Response
    {
        $assignment = TeacherSubject::findOrFail($id);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('school/teacher-subjects/form', [
            'assignment' => $assignment,
            'teachers' => $teachers,
            'classes' => $classes,
            'subjects' => $subjects,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $assignment = TeacherSubject::findOrFail($id);

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'is_class_teacher' => 'boolean',
        ]);

        $assignment->update($validated);

        return redirect()->route('teacher-subjects.index')->with('success', 'Teacher subject assignment updated successfully.');
    }

    public function destroy($id)
    {
        $assignment = TeacherSubject::findOrFail($id);
        $assignment->delete();

        return redirect()->route('teacher-subjects.index')->with('success', 'Teacher subject assignment deleted successfully.');
    }
}
