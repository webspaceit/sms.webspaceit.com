<?php

namespace App\Http\Controllers;

use App\Models\LessonPlan;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LessonPlanController extends Controller
{
    public function index(Request $request): Response
    {
        $query = LessonPlan::with(['class', 'subject', 'teacher']);

        if ($request->input('class_id')) {
            $query->where('class_id', $request->input('class_id'));
        }
        if ($request->input('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        $lessonPlans = $query->latest()->get();
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/lesson-plans/index', [
            'lessonPlans' => $lessonPlans,
            'classes' => $classes,
            'subjects' => $subjects,
            'filters' => $request->only(['class_id', 'subject_id']),
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);
        $teachers = Teacher::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/lesson-plans/form', [
            'classes' => $classes,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'topic' => 'required|string|max:255',
            'topic_overview' => 'nullable|string',
            'lesson_breakdown' => 'nullable|string',
            'lesson_date' => 'nullable|date',
        ]);

        LessonPlan::create($validated);

        return redirect()->route('lesson-plans.index')
            ->with('success', 'Lesson plan created successfully.');
    }

    public function edit(LessonPlan $lessonPlan): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);
        $teachers = Teacher::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/lesson-plans/form', [
            'lessonPlan' => $lessonPlan->load(['class', 'subject', 'teacher']),
            'classes' => $classes,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, LessonPlan $lessonPlan)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'topic' => 'required|string|max:255',
            'topic_overview' => 'nullable|string',
            'lesson_breakdown' => 'nullable|string',
            'lesson_date' => 'nullable|date',
        ]);

        $lessonPlan->update($validated);

        return redirect()->route('lesson-plans.index')
            ->with('success', 'Lesson plan updated successfully.');
    }

    public function destroy(LessonPlan $lessonPlan)
    {
        $lessonPlan->delete();

        return redirect()->route('lesson-plans.index')
            ->with('success', 'Lesson plan deleted successfully.');
    }
}
