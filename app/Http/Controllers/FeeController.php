<?php

namespace App\Http\Controllers;

use App\Models\FeeCollection;
use App\Models\FeeHead;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FeeController extends Controller
{
    public function index(Request $request): Response
    {
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');
        $search = $request->input('search_text');
        $perPage = (int) ($request->input('per_page', 20));

        $studentsQuery = Student::with('schoolClass');

        if ($classId) {
            $studentsQuery->where('class_id', $classId);
        }

        if ($sectionId) {
            $studentsQuery->where('section_id', $sectionId);
        }

        if ($search) {
            $studentsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('roll_no', 'like', "%{$search}%")
                  ->orWhere('guardian_name', 'like', "%{$search}%")
                  ->orWhere('mobile_number', 'like', "%{$search}%");
            });
        }

        $students = $studentsQuery->orderBy('class_name')->orderBy('roll_no')->paginate($perPage)->through(function ($s) {
            return [
                'id' => $s->id,
                'admission_no' => $s->student_id,
                'name' => $s->name,
                'class_name' => $s->class_name,
                'section_name' => $s->section,
                'guardian_name' => $s->guardian_name,
                'date_of_birth' => $s->date_of_birth,
                'mobile_number' => $s->mobile_number,
            ];
        });

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $allSections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/fees', [
            'students' => $students,
            'classes' => $classes,
            'allSections' => $allSections,
            'filters' => [
                'class_id' => $classId,
                'section_id' => $sectionId,
                'search_text' => $search,
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $students = Student::orderBy('class_name')->orderBy('roll_no')
            ->get(['id', 'name', 'class_name', 'roll_no', 'class_id', 'section_id']);
        $feeHeads = FeeHead::orderBy('sort_order')->orderBy('name')->get(['id', 'name']);
        $allSections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        $preselectedStudent = null;
        if ($studentId = $request->query('student_id')) {
            $preselectedStudent = Student::with('schoolClass', 'section')
                ->where('id', $studentId)
                ->first();
        }

        $lastInvoice = FeeCollection::latest('id')->value('invoice_no');
        $nextNumber = $lastInvoice ? ((int) substr($lastInvoice, strrpos($lastInvoice, '-') + 1)) + 1 : 1;
        $nextInvoiceNo = 'INV-' . date('Y') . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return Inertia::render('school/fees-form', [
            'classes' => $classes,
            'students' => $students,
            'allSections' => $allSections,
            'feeHeads' => $feeHeads,
            'isEdit' => false,
            'selectedStudentId' => $request->query('student_id'),
            'nextInvoiceNo' => $nextInvoiceNo,
            'preselectedStudent' => $preselectedStudent ? [
                'id' => $preselectedStudent->id,
                'name' => $preselectedStudent->name,
                'admission_no' => $preselectedStudent->student_id,
                'class_name' => $preselectedStudent->class_name,
                'section_name' => $preselectedStudent->section,
                'roll_no' => $preselectedStudent->roll_no,
                'guardian_name' => $preselectedStudent->guardian_name,
                'mobile_number' => $preselectedStudent->mobile_number,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_head_id' => 'nullable|exists:fee_heads,id',
            'invoice_no' => 'required|string|max:50|unique:fee_collections',
            'month' => 'required|string|max:20',
            'amount' => 'required|integer|min:1',
            'status' => 'required|string|max:20',
            'due_date' => 'required|date',
            'paid_on' => 'nullable|date',
            'payment_method' => 'nullable|string|max:50',
            'remarks' => 'nullable|string|max:500',
        ]);

        FeeCollection::create($validated);

        return redirect()->route('fees.index')->with('success', 'Fee record created successfully.');
    }

    public function edit($id): Response
    {
        $fee = FeeCollection::with('student')->findOrFail($id);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $students = Student::orderBy('class_name')->orderBy('roll_no')
            ->get(['id', 'name', 'class_name', 'roll_no', 'class_id', 'section_id']);
        $feeHeads = FeeHead::orderBy('sort_order')->orderBy('name')->get(['id', 'name']);
        $allSections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/fees-form', [
            'fee' => [
                'id' => $fee->id,
                'student_id' => $fee->student_id,
                'fee_head_id' => $fee->fee_head_id,
                'invoice_no' => $fee->invoice_no,
                'month' => $fee->month,
                'amount' => $fee->amount,
                'status' => $fee->status,
                'due_date' => $fee->due_date,
                'paid_on' => $fee->paid_on ? \Carbon\Carbon::parse($fee->paid_on)->format('Y-m-d') : '',
                'payment_method' => $fee->payment_method,
                'remarks' => $fee->remarks,
            ],
            'classes' => $classes,
            'students' => $students,
            'allSections' => $allSections,
            'feeHeads' => $feeHeads,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $fee = FeeCollection::findOrFail($id);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_head_id' => 'nullable|exists:fee_heads,id',
            'invoice_no' => ['required', 'string', 'max:50', Rule::unique('fee_collections')->ignore($id)],
            'month' => 'required|string|max:20',
            'amount' => 'required|integer|min:1',
            'status' => 'required|string|max:20',
            'due_date' => 'required|date',
            'paid_on' => 'nullable|date',
            'payment_method' => 'nullable|string|max:50',
            'remarks' => 'nullable|string|max:500',
        ]);

        $fee->update($validated);

        return redirect()->route('fees.index')->with('success', 'Fee record updated successfully.');
    }

    public function destroy($id)
    {
        $fee = FeeCollection::findOrFail($id);
        $fee->delete();

        return redirect()->route('fees.index')->with('success', 'Fee record deleted successfully.');
    }
}
