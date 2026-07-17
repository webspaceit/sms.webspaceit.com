<?php

namespace App\Http\Controllers;

use App\Models\FeeHead;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeHeadController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = FeeHead::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('name_bn', 'like', "%{$search}%")
                    ->orWhere('frequency', 'like', "%{$search}%");
            });
        }

        $feeHeads = $query->orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('school/fee-heads/index', [
            'feeHeads' => $feeHeads,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/fee-heads/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'frequency' => 'required|string|max:50',
            'is_optional' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        FeeHead::create($validated);

        return redirect()->route('fee-heads.index')->with('success', 'Fee head created successfully.');
    }

    public function show($id): Response
    {
        $feeHead = FeeHead::with('feeStructures')->findOrFail($id);

        return Inertia::render('school/fee-heads/show', [
            'feeHead' => $feeHead,
        ]);
    }

    public function edit($id): Response
    {
        $feeHead = FeeHead::findOrFail($id);

        return Inertia::render('school/fee-heads/form', [
            'feeHead' => $feeHead,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $feeHead = FeeHead::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'frequency' => 'required|string|max:50',
            'is_optional' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $feeHead->update($validated);

        return redirect()->route('fee-heads.index')->with('success', 'Fee head updated successfully.');
    }

    public function destroy($id)
    {
        $feeHead = FeeHead::findOrFail($id);
        $feeHead->delete();

        return redirect()->route('fee-heads.index')->with('success', 'Fee head deleted successfully.');
    }
}
