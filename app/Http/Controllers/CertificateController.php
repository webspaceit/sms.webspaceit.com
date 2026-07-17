<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $studentId = $request->input('student_id');
        $type = $request->input('type');

        $query = Certificate::with('student');

        if ($studentId) {
            $query->where('student_id', $studentId);
        }

        if ($type) {
            $query->where('type', $type);
        }

        $certificates = $query->orderBy('issue_date', 'desc')->get();

        $students = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        return Inertia::render('school/certificates/index', [
            'certificates' => $certificates,
            'students' => $students,
            'filters' => [
                'student_id' => $studentId,
                'type' => $type,
            ],
        ]);
    }

    public function create(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id', 'class_id']);

        return Inertia::render('school/certificates/form', [
            'classes' => $classes,
            'students' => $students,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'type' => 'required|string|max:50',
            'certificate_no' => 'required|string|max:100|unique:certificates',
            'issue_date' => 'required|date',
            'content' => 'required|string',
            'remarks' => 'nullable|string',
        ]);

        Certificate::create($validated);

        return redirect()->route('certificates.index')->with('success', 'Certificate created successfully.');
    }

    public function show($id): Response
    {
        $certificate = Certificate::with('student')->findOrFail($id);

        return Inertia::render('school/certificates/show', [
            'certificate' => $certificate,
        ]);
    }

    public function edit($id): Response
    {
        $certificate = Certificate::with('student')->findOrFail($id);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $students = Student::orderBy('name')->get(['id', 'name', 'student_id', 'class_id']);

        return Inertia::render('school/certificates/form', [
            'certificate' => $certificate,
            'classes' => $classes,
            'students' => $students,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $certificate = Certificate::findOrFail($id);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'type' => 'required|string|max:50',
            'certificate_no' => ['required', 'string', 'max:100', \Illuminate\Validation\Rule::unique('certificates')->ignore($id)],
            'issue_date' => 'required|date',
            'content' => 'required|string',
            'remarks' => 'nullable|string',
        ]);

        $certificate->update($validated);

        return redirect()->route('certificates.index')->with('success', 'Certificate updated successfully.');
    }

    public function destroy($id)
    {
        $certificate = Certificate::findOrFail($id);
        $certificate->delete();

        return redirect()->route('certificates.index')->with('success', 'Certificate deleted successfully.');
    }
}
