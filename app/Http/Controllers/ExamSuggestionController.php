<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamSuggestion;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExamSuggestionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ExamSuggestion::with(['exam', 'subject', 'teacher']);

        if ($request->input('exam_id')) {
            $query->where('exam_id', $request->input('exam_id'));
        }

        $suggestions = $query->latest()->get();
        $exams = Exam::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/exam-suggestions/index', [
            'suggestions' => $suggestions,
            'exams' => $exams,
            'filters' => $request->only(['exam_id']),
        ]);
    }

    public function create(): Response
    {
        $exams = Exam::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);
        $teachers = Teacher::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/exam-suggestions/form', [
            'exams' => $exams,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'suggestion' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,png,jpeg,pdf,doc,docx|max:51200',
            'teacher_id' => 'required|exists:teachers,id',
        ]);

        $data = [
            'exam_id' => $validated['exam_id'],
            'subject_id' => $validated['subject_id'],
            'title' => $validated['title'],
            'suggestion' => $validated['suggestion'],
            'teacher_id' => $validated['teacher_id'],
        ];

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('exam-suggestions', 'public');
        }

        ExamSuggestion::create($data);

        return redirect()->route('exam-suggestions.index')
            ->with('success', 'Exam suggestion uploaded successfully.');
    }

    public function destroy(ExamSuggestion $examSuggestion)
    {
        if ($examSuggestion->file_path) {
            Storage::disk('public')->delete($examSuggestion->file_path);
        }
        $examSuggestion->delete();

        return redirect()->route('exam-suggestions.index')
            ->with('success', 'Exam suggestion deleted successfully.');
    }
}
