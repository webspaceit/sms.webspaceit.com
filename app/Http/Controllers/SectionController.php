<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function index(Request $request): Response
    {
        $classId = $request->input('class_id');
        $search = $request->input('search');

        $query = Section::with('schoolClass');

        if ($classId) {
            $query->where('class_id', $classId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('room_no', 'like', "%{$search}%");
            });
        }

        $sections = $query->orderBy('class_id')->orderBy('name')->get();

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/sections/index', [
            'sections' => $sections,
            'classes' => $classes,
            'filters' => [
                'class_id' => $classId,
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/sections/form', [
            'classes' => $classes,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string|max:255',
            'room_no' => 'nullable|string|max:50',
        ]);

        Section::create($validated);

        return redirect()->route('sections.index')->with('success', 'Section created successfully.');
    }

    public function show($id): Response
    {
        $section = Section::with('schoolClass')->findOrFail($id);

        return Inertia::render('school/sections/show', [
            'section' => $section,
        ]);
    }

    public function edit($id): Response
    {
        $section = Section::findOrFail($id);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/sections/form', [
            'section' => $section,
            'classes' => $classes,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);

        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string|max:255',
            'room_no' => 'nullable|string|max:50',
        ]);

        $section->update($validated);

        return redirect()->route('sections.index')->with('success', 'Section updated successfully.');
    }

    public function destroy($id)
    {
        $section = Section::findOrFail($id);
        $section->delete();

        return redirect()->route('sections.index')->with('success', 'Section deleted successfully.');
    }
}
