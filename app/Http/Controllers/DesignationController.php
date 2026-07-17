<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignationController extends Controller
{
    public function index()
    {
        return Inertia::render('school/designations/index', [
            'designations' => Designation::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:designations',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Designation::create($validated);

        return redirect()->route('designations.index')->with('success', 'Designation created.');
    }

    public function update(Request $request, Designation $designation)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', \Illuminate\Validation\Rule::unique('designations')->ignore($designation->id)],
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $designation->update($validated);

        return redirect()->route('designations.index')->with('success', 'Designation updated.');
    }

    public function destroy(Designation $designation)
    {
        $designation->delete();

        return redirect()->route('designations.index')->with('success', 'Designation deleted.');
    }
}
