<?php

namespace App\Http\Controllers;

use App\Models\OnlineExam;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Student;
use App\Models\ExamQuestion;
use App\Models\ExamSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OnlineExamController extends Controller
{
    public function index(Request $request): Response
    {
        $query = OnlineExam::with(['class', 'subject', 'questions']);

        if ($request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        $exams = $query->latest()->get();
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/online-exams/index', [
            'exams' => $exams,
            'classes' => $classes,
            'subjects' => $subjects,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/online-exams/form', [
            'classes' => $classes,
            'subjects' => $subjects,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'class_id' => 'nullable|exists:classes,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'duration_minutes' => 'required|integer|min:1|max:480',
            'total_marks' => 'required|integer|min:0',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
            'status' => 'required|in:draft,active,completed',
            'instructions' => 'nullable|string',
        ]);

        OnlineExam::create($validated);

        return redirect()->route('online-exams.index')
            ->with('success', 'Online exam created.');
    }

    public function edit(OnlineExam $onlineExam): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/online-exams/form', [
            'onlineExam' => $onlineExam->load(['class', 'subject']),
            'classes' => $classes,
            'subjects' => $subjects,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, OnlineExam $onlineExam)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'class_id' => 'nullable|exists:classes,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'duration_minutes' => 'required|integer|min:1|max:480',
            'total_marks' => 'required|integer|min:0',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
            'status' => 'required|in:draft,active,completed',
            'instructions' => 'nullable|string',
        ]);

        $onlineExam->update($validated);

        return redirect()->route('online-exams.index')
            ->with('success', 'Online exam updated.');
    }

    public function destroy(OnlineExam $onlineExam)
    {
        $onlineExam->delete();
        return redirect()->route('online-exams.index')
            ->with('success', 'Online exam deleted.');
    }

    public function questions(OnlineExam $onlineExam): Response
    {
        $onlineExam->load('questions');
        return Inertia::render('school/online-exams/questions', [
            'onlineExam' => $onlineExam,
        ]);
    }

    public function storeQuestion(Request $request, OnlineExam $onlineExam)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'type' => 'required|in:mcq,written',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable|string|max:255',
            'marks' => 'required|integer|min:1',
        ]);

        $onlineExam->questions()->create($validated);

        $onlineExam->increment('total_marks', $validated['marks']);

        return redirect()->route('online-exams.questions', $onlineExam)
            ->with('success', 'Question added.');
    }

    public function deleteQuestion(OnlineExam $onlineExam, ExamQuestion $question)
    {
        $onlineExam->decrement('total_marks', $question->marks);
        $question->delete();
        return redirect()->route('online-exams.questions', $onlineExam)
            ->with('success', 'Question deleted.');
    }

    public function results(OnlineExam $onlineExam): Response
    {
        $onlineExam->load(['class', 'subject', 'submissions.student']);
        return Inertia::render('school/online-exams/results', [
            'onlineExam' => $onlineExam,
        ]);
    }
}
