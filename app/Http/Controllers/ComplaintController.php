<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintController extends Controller
{
    public function index(): Response
    {
        $complaints = Complaint::with('resolver')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('school/complaints/index', [
            'complaints' => $complaints,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/complaints/form', ['isEdit' => false]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'complainant_name' => 'required|string|max:255',
            'complainant_phone' => 'nullable|string|max:20',
            'description' => 'required|string',
            'type' => 'required|in:student,staff,other',
        ]);

        Complaint::create($validated);

        return redirect()->route('complaints.index')
            ->with('success', 'Complaint submitted successfully.');
    }

    public function edit(Complaint $complaint): Response
    {
        return Inertia::render('school/complaints/form', [
            'complaint' => $complaint->load('resolver'),
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, Complaint $complaint)
    {
        $rules = [
            'complainant_name' => 'required|string|max:255',
            'complainant_phone' => 'nullable|string|max:20',
            'description' => 'required|string',
            'type' => 'required|in:student,staff,other',
            'status' => 'required|in:pending,investigating,resolved,dismissed',
            'resolution_notes' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        if (in_array($validated['status'], ['resolved', 'dismissed'])) {
            $validated['resolved_by'] = Auth::id();
        }

        $complaint->update($validated);

        return redirect()->route('complaints.index')
            ->with('success', 'Complaint updated successfully.');
    }

    public function destroy(Complaint $complaint)
    {
        $complaint->delete();

        return redirect()->route('complaints.index')
            ->with('success', 'Complaint deleted successfully.');
    }
}
