<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassTeacherController extends Controller
{
    public function index(Request $request): Response
    {
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');
        $subjectId = $request->input('subject_id');
        $teacherId = $request->input('teacher_id');
        $search = $request->input('search');
        $perPage = (int) ($request->input('per_page', 10));

        $query = Section::with(['schoolClass', 'classTeacher'])
            ->orderBy('class_id')
            ->orderBy('name');

        if ($classId) {
            $query->where('class_id', $classId);
        }

        if ($sectionId) {
            $query->where('id', $sectionId);
        }

        if ($subjectId) {
            $query->whereHas('schoolClass.subjects', fn($sq) => $sq->where('subject_id', $subjectId));
        }

        if ($teacherId) {
            $query->where('class_teacher_id', $teacherId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('schoolClass', fn($sq) => $sq->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('classTeacher', fn($sq) => $sq->where('name', 'like', "%{$search}%"));
            });
        }

        $perPage = max(1, min($perPage, 100));
        $sections = $query->paginate($perPage)->withQueryString();

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $allSections = Section::orderBy('name')->get(['id', 'name', 'class_id']);
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);

        $subjectTeachers = TeacherSubject::select('subject_id', 'teacher_id')
            ->distinct()
            ->get()
            ->groupBy('subject_id')
            ->map(fn($items) => $items->pluck('teacher_id'));

        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id', 'department']);

        return Inertia::render('school/class-teachers/index', [
            'sections' => $sections,
            'classes' => $classes,
            'allSections' => $allSections,
            'subjects' => $subjects,
            'subjectTeachers' => $subjectTeachers,
            'teachers' => $teachers,
            'filters' => [
                'class_id' => $classId,
                'section_id' => $sectionId,
                'subject_id' => $subjectId,
                'teacher_id' => $teacherId,
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);

        $validated = $request->validate([
            'class_teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $section->update($validated);

        return redirect()->route('class-teachers.index')
            ->with('success', 'Class teacher assigned successfully.');
    }
}
