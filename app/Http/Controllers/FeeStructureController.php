<?php

namespace App\Http\Controllers;

use App\Models\FeeHead;
use App\Models\FeeStructure;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeStructureController extends Controller
{
    public function index(Request $request): Response
    {
        $classId = $request->input('class_id');

        $query = FeeStructure::with(['schoolClass', 'feeHead']);

        if ($classId) {
            $query->where('class_id', $classId);
        }

        $feeStructures = $query->orderBy('class_id')->orderBy('fee_head_id')->get();

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $feeHeads = FeeHead::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/fee-structures/index', [
            'feeStructures' => $feeStructures,
            'classes' => $classes,
            'feeHeads' => $feeHeads,
            'filters' => ['class_id' => $classId],
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $feeHeads = FeeHead::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/fee-structures/form', [
            'classes' => $classes,
            'feeHeads' => $feeHeads,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'fee_head_id' => 'required|exists:fee_heads,id',
            'amount' => 'required|numeric|min:0',
        ]);

        FeeStructure::create($validated);

        return redirect()->route('fee-structures.index')->with('success', 'Fee structure created successfully.');
    }

    public function show($id): Response
    {
        $feeStructure = FeeStructure::with(['schoolClass', 'feeHead'])->findOrFail($id);

        return Inertia::render('school/fee-structures/show', [
            'feeStructure' => $feeStructure,
        ]);
    }

    public function edit($id): Response
    {
        $feeStructure = FeeStructure::findOrFail($id);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $feeHeads = FeeHead::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/fee-structures/form', [
            'feeStructure' => $feeStructure,
            'classes' => $classes,
            'feeHeads' => $feeHeads,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $feeStructure = FeeStructure::findOrFail($id);

        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'fee_head_id' => 'required|exists:fee_heads,id',
            'amount' => 'required|numeric|min:0',
        ]);

        $feeStructure->update($validated);

        return redirect()->route('fee-structures.index')->with('success', 'Fee structure updated successfully.');
    }

    public function destroy($id)
    {
        $feeStructure = FeeStructure::findOrFail($id);
        $feeStructure->delete();

        return redirect()->route('fee-structures.index')->with('success', 'Fee structure deleted successfully.');
    }
}
