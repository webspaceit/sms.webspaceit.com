<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('school/branches/index', [
            'branches' => Branch::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_main' => 'boolean',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validated['is_main'] ?? false) {
            Branch::where('is_main', true)->update(['is_main' => false]);
        }

        Branch::create($validated);

        return redirect()->route('branches.index')
            ->with('success', 'Branch created.');
    }

    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'is_main' => 'boolean',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validated['is_main'] ?? false) {
            Branch::where('is_main', true)->where('id', '!=', $branch->id)->update(['is_main' => false]);
        }

        $branch->update($validated);

        return redirect()->route('branches.index')
            ->with('success', 'Branch updated.');
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();
        return redirect()->route('branches.index')
            ->with('success', 'Branch deleted.');
    }
}
