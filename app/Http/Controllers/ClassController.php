<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = SchoolClass::with('sections');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $classes = $query->orderByRaw('CAST(SUBSTRING(name, 7) AS UNSIGNED)')->get();

        $sectionOptions = Section::distinct()->pluck('name')->sort()->values();
        if ($sectionOptions->isEmpty()) {
            $sectionOptions = collect(['A', 'B', 'C', 'D', 'E']);
        }

        return Inertia::render('school/classes/index', [
            'classes' => $classes,
            'sectionOptions' => $sectionOptions,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/classes/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'shift' => 'nullable|in:Morning,Day,Both',
            'sections' => 'nullable|array',
            'sections.*' => 'string|max:255',
        ]);

        $class = SchoolClass::create([
            'name' => $validated['name'],
            'shift' => $validated['shift'] ?? 'Morning',
        ]);

        if (!empty($validated['sections'])) {
            foreach ($validated['sections'] as $sectionName) {
                $class->sections()->create(['name' => $sectionName]);
            }
        }

        return redirect()->route('classes.index');
    }

    public function show($id): Response
    {
        $class = SchoolClass::with(['sections', 'subjects'])->findOrFail($id);

        return Inertia::render('school/classes/show', [
            'class' => $class,
        ]);
    }

    public function edit($id): Response
    {
        $class = SchoolClass::with('sections')->findOrFail($id);

        $sectionOptions = Section::distinct()->pluck('name')->sort()->values();
        if ($sectionOptions->isEmpty()) {
            $sectionOptions = collect(['A', 'B', 'C', 'D', 'E']);
        }

        return Inertia::render('school/classes/form', [
            'item' => $class,
            'isEdit' => true,
            'sectionOptions' => $sectionOptions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $class = SchoolClass::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'shift' => 'nullable|in:Morning,Day,Both',
        ]);

        $class->update($validated);

        if ($request->has('sections')) {
            $class->sections()->delete();
            foreach ($request->input('sections', []) as $sectionName) {
                $class->sections()->create(['name' => $sectionName]);
            }
        }

        return redirect()->route('classes.index')->with('success', 'Class updated successfully.');
    }

    public function destroy($id)
    {
        $class = SchoolClass::findOrFail($id);
        $class->delete();

        return redirect()->route('classes.index')->with('success', 'Class deleted successfully.');
    }
}
