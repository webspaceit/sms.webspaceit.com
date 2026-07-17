<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\StudyMaterial;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudyMaterialController extends Controller
{
    public function index(Request $request): Response
    {
        $query = StudyMaterial::with(['class', 'subject', 'teacher', 'user']);

        if ($request->input('class_id')) {
            $query->where('class_id', $request->input('class_id'));
        }
        if ($request->input('subject_id')) {
            $query->where('subject_id', $request->input('subject_id'));
        }

        $studyMaterials = $query->latest()->get();
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/study-materials/index', [
            'studyMaterials' => $studyMaterials,
            'classes' => $classes,
            'subjects' => $subjects,
            'filters' => $request->only(['class_id', 'subject_id']),
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name']);

        $teacher = null;
        $user = Auth::user();
        if ($user) {
            $teacher = Teacher::where('user_id', $user->id)->first();
        }

        return Inertia::render('school/study-materials/form', [
            'classes' => $classes,
            'subjects' => $subjects,
            'teacher' => $teacher ? ['id' => $teacher->id, 'name' => $teacher->name] : null,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:jpg,png,jpeg,pdf,doc,docx,mp4,mp3|max:51200',
            'class_id' => 'nullable|exists:classes,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $path = $request->file('file')->store('study-materials', 'public');
        $fileType = $request->file('file')->getClientOriginalExtension();

        StudyMaterial::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'file_path' => $path,
            'file_type' => $fileType,
            'class_id' => $validated['class_id'],
            'subject_id' => $validated['subject_id'],
            'teacher_id' => $validated['teacher_id'],
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('study-materials.index')
            ->with('success', 'Study material uploaded successfully.');
    }

    public function destroy(StudyMaterial $studyMaterial)
    {
        Storage::disk('public')->delete($studyMaterial->file_path);
        $studyMaterial->delete();

        return redirect()->route('study-materials.index')
            ->with('success', 'Study material deleted successfully.');
    }
}
