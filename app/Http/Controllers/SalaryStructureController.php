<?php

namespace App\Http\Controllers;

use App\Models\SalaryStructure;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalaryStructureController extends Controller
{
    public function index(Request $request): Response
    {
        $teacherId = $request->input('teacher_id');

        $query = SalaryStructure::with('teacher');

        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        $salaryStructures = $query->orderBy('created_at', 'desc')->get();

        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/salary-structures/index', [
            'salaryStructures' => $salaryStructures,
            'teachers' => $teachers,
            'filters' => ['teacher_id' => $teacherId],
        ]);
    }

    public function create(): Response
    {
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/salary-structures/form', [
            'teachers' => $teachers,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'basic_salary' => 'required|numeric|min:0',
            'house_rent' => 'nullable|numeric|min:0',
            'medical' => 'nullable|numeric|min:0',
            'transport_allowance' => 'nullable|numeric|min:0',
            'other_allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'effective_from' => 'required|date',
        ]);

        SalaryStructure::create($validated);

        return redirect()->route('salary-structures.index')->with('success', 'Salary structure created successfully.');
    }

    public function show($id): Response
    {
        $salaryStructure = SalaryStructure::with('teacher')->findOrFail($id);

        return Inertia::render('school/salary-structures/show', [
            'salaryStructure' => $salaryStructure,
        ]);
    }

    public function edit($id): Response
    {
        $salaryStructure = SalaryStructure::findOrFail($id);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/salary-structures/form', [
            'salaryStructure' => $salaryStructure,
            'teachers' => $teachers,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $salaryStructure = SalaryStructure::findOrFail($id);

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'basic_salary' => 'required|numeric|min:0',
            'house_rent' => 'nullable|numeric|min:0',
            'medical' => 'nullable|numeric|min:0',
            'transport_allowance' => 'nullable|numeric|min:0',
            'other_allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'effective_from' => 'required|date',
        ]);

        $salaryStructure->update($validated);

        return redirect()->route('salary-structures.index')->with('success', 'Salary structure updated successfully.');
    }

    public function destroy($id)
    {
        $salaryStructure = SalaryStructure::findOrFail($id);
        $salaryStructure->delete();

        return redirect()->route('salary-structures.index')->with('success', 'Salary structure deleted successfully.');
    }
}
