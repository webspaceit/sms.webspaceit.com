<?php

namespace App\Http\Controllers;

use App\Models\SalaryPayment;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalaryPaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $teacherId = $request->input('teacher_id');
        $month = $request->input('month');
        $year = $request->input('year');

        $query = SalaryPayment::with('teacher');

        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($month) {
            $query->where('month', $month);
        }

        if ($year) {
            $query->where('year', $year);
        }

        $payments = $query->orderBy('year', 'desc')->orderBy('month', 'desc')->get();

        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/salary-payments/index', [
            'payments' => $payments,
            'teachers' => $teachers,
            'filters' => [
                'teacher_id' => $teacherId,
                'month' => $month,
                'year' => $year,
            ],
        ]);
    }

    public function create(): Response
    {
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/salary-payments/form', [
            'teachers' => $teachers,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2100',
            'gross_salary' => 'required|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'net_pay' => 'required|numeric|min:0',
            'paid_date' => 'required|date',
            'payment_method' => 'required|string|max:50',
            'reference_no' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        SalaryPayment::create($validated);

        return redirect()->route('salary-payments.index')->with('success', 'Salary payment created successfully.');
    }

    public function show($id): Response
    {
        $payment = SalaryPayment::with('teacher')->findOrFail($id);

        return Inertia::render('school/salary-payments/show', [
            'payment' => $payment,
        ]);
    }

    public function edit($id): Response
    {
        $payment = SalaryPayment::findOrFail($id);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id']);

        return Inertia::render('school/salary-payments/form', [
            'payment' => $payment,
            'teachers' => $teachers,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $payment = SalaryPayment::findOrFail($id);

        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2100',
            'gross_salary' => 'required|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'net_pay' => 'required|numeric|min:0',
            'paid_date' => 'required|date',
            'payment_method' => 'required|string|max:50',
            'reference_no' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $payment->update($validated);

        return redirect()->route('salary-payments.index')->with('success', 'Salary payment updated successfully.');
    }

    public function destroy($id)
    {
        $payment = SalaryPayment::findOrFail($id);
        $payment->delete();

        return redirect()->route('salary-payments.index')->with('success', 'Salary payment deleted successfully.');
    }
}
