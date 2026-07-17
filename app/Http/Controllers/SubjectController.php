<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $classId = $request->input('class_id');

        $query = Subject::with('classes');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('name_bn', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        if ($classId) {
            $query->whereHas('classes', fn($q) => $q->where('classes.id', $classId));
        }

        $subjects = $query->orderBy('name')->get();

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/subjects/index', [
            'subjects' => $subjects,
            'classes' => $classes,
            'filters' => ['search' => $search, 'class_id' => $classId],
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/subjects/form', [
            'classes' => $classes,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
            'marks' => 'nullable|array',
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:50|unique:subjects',
            'type' => 'required|string|max:50',
        ]);

        $classIds = $validated['class_ids'] ?? [];
        $marks = $validated['marks'] ?? [];
        unset($validated['class_ids'], $validated['marks']);

        $subject = Subject::create($validated);

        $syncData = [];
        foreach ($classIds as $classId) {
            $m = $marks[$classId] ?? [];
            $syncData[$classId] = [
                'full_marks' => (int) ($m['full_marks'] ?? 100),
                'written_marks' => $m['written_marks'] !== '' ? (int) $m['written_marks'] : null,
                'mcq_marks' => $m['mcq_marks'] !== '' ? (int) $m['mcq_marks'] : null,
                'practical_marks' => $m['practical_marks'] !== '' ? (int) $m['practical_marks'] : null,
                'ca_marks' => $m['ca_marks'] !== '' ? (int) $m['ca_marks'] : null,
                'pass_marks' => (int) ($m['pass_marks'] ?? 33),
                'sort_order' => (int) ($m['sort_order'] ?? 0),
            ];
        }

        if (!empty($syncData)) {
            $subject->classes()->sync($syncData);
        }

        return redirect()->route('subjects.index')->with('success', 'Subject created successfully.');
    }

    public function show($id): Response
    {
        $subject = Subject::with('classes')->findOrFail($id);

        return Inertia::render('school/subjects/show', [
            'subject' => $subject,
        ]);
    }

    public function edit($id): Response
    {
        $subject = Subject::with('classes')->findOrFail($id);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/subjects/form', [
            'subject' => $subject,
            'classes' => $classes,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
            'marks' => 'nullable|array',
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'code' => ['nullable', 'string', 'max:50', \Illuminate\Validation\Rule::unique('subjects')->ignore($id)],
            'type' => 'required|string|max:50',
        ]);

        $classIds = $validated['class_ids'] ?? [];
        $marks = $validated['marks'] ?? [];
        unset($validated['class_ids'], $validated['marks']);

        $subject->update($validated);

        $syncData = [];
        foreach ($classIds as $classId) {
            $m = $marks[$classId] ?? [];
            $syncData[$classId] = [
                'full_marks' => (int) ($m['full_marks'] ?? 100),
                'written_marks' => $m['written_marks'] !== '' ? (int) $m['written_marks'] : null,
                'mcq_marks' => $m['mcq_marks'] !== '' ? (int) $m['mcq_marks'] : null,
                'practical_marks' => $m['practical_marks'] !== '' ? (int) $m['practical_marks'] : null,
                'ca_marks' => $m['ca_marks'] !== '' ? (int) $m['ca_marks'] : null,
                'pass_marks' => (int) ($m['pass_marks'] ?? 33),
                'sort_order' => (int) ($m['sort_order'] ?? 0),
            ];
        }

        $subject->classes()->sync($syncData);

        return redirect()->route('subjects.index')->with('success', 'Subject updated successfully.');
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->route('subjects.index')->with('success', 'Subject deleted successfully.');
    }
}
