<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    protected array $districts = [
        'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogra', 'Brahmanbaria',
        'Chandpur', 'Chapainawabganj', 'Chattogram', 'Chuadanga', 'Comilla', 'Cox\'s Bazar',
        'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj',
        'Habiganj', 'Jamalpur', 'Jashore', 'Jhalokathi', 'Jhenaidah', 'Joypurhat',
        'Khagrachhari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur',
        'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar',
        'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi',
        'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh',
        'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur',
        'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet',
        'Tangail', 'Thakurgaon',
    ];

    public function generateEmployeeId(): string
    {
        $prefix = 'TCH';

        $last = Teacher::where('employee_id', 'like', "{$prefix}-%")
            ->orderByRaw('CAST(SUBSTRING_INDEX(employee_id, \'-\', -1) AS UNSIGNED) DESC')
            ->value('employee_id');

        if ($last) {
            $parts = explode('-', $last);
            $num = ((int) end($parts)) + 1;
        } else {
            $num = 1;
        }

        return "{$prefix}-" . str_pad($num, 3, '0', STR_PAD_LEFT);
    }

    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = Teacher::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('district', 'like', "%{$search}%");
            });
        }

        $teachers = $query->orderBy('department')->orderBy('name')->get();

        return Inertia::render('school/teachers', [
            'teachers' => $teachers,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/teachers-form', [
            'isEdit' => false,
            'nextEmployeeId' => $this->generateEmployeeId(),
            'subjects' => Subject::orderBy('name')->pluck('name'),
            'allSubjects' => Subject::orderBy('name')->get(['id', 'name']),
            'designations' => Designation::where('is_active', true)->orderBy('name')->pluck('name'),
            'districts' => $this->districts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'nullable|string|max:50|unique:teachers',
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'district' => 'required|string|max:255',
            'joining_date' => 'required|date',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        if (empty($validated['employee_id'])) {
            $validated['employee_id'] = $this->generateEmployeeId();
        }

        $subjectIds = $validated['subject_ids'] ?? [];
        unset($validated['subject_ids']);

        $teacher = Teacher::create($validated);

        if (!empty($subjectIds)) {
            $teacher->subjects()->sync($subjectIds);
        }

        return redirect()->route('teachers.index')->with('success', 'Teacher created successfully.');
    }

    public function show($id): Response
    {
        $teacher = Teacher::findOrFail($id);

        return Inertia::render('school/teachers-show', [
            'teacher' => $teacher,
        ]);
    }

    public function edit($id): Response
    {
        $teacher = Teacher::with('subjects')->findOrFail($id);

        return Inertia::render('school/teachers-form', [
            'teacher' => $teacher,
            'isEdit' => true,
            'subjects' => Subject::orderBy('name')->pluck('name'),
            'allSubjects' => Subject::orderBy('name')->get(['id', 'name']),
            'designations' => Designation::where('is_active', true)->orderBy('name')->pluck('name'),
            'districts' => $this->districts,
        ]);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'employee_id' => ['required', 'string', 'max:50', Rule::unique('teachers')->ignore($id)],
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'district' => 'required|string|max:255',
            'joining_date' => 'required|date',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $subjectIds = $validated['subject_ids'] ?? [];
        unset($validated['subject_ids']);

        $teacher->update($validated);
        $teacher->subjects()->sync($subjectIds);

        return redirect()->route('teachers.index')->with('success', 'Teacher updated successfully.');
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return redirect()->route('teachers.index')->with('success', 'Teacher deleted successfully.');
    }
}
