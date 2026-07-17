<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\FeeStructure;
use App\Models\Guardian;
use App\Models\HostelRoom;
use App\Models\SchoolClass;
use App\Models\SchoolSetting;
use App\Models\Section;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Models\StudentHouse;
use App\Models\TransportRoute;
use App\Models\TransportStop;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $classId = $request->input('class_id');
        $sectionId = $request->input('section_id');
        $searchText = $request->input('search_text');
        $perPage = min(100, max(10, (int) ($request->input('per_page', 20))));

        $query = Student::query()->with(['schoolClass', 'section']);

        if ($classId) {
            $query->where('class_id', $classId);
        }

        if ($sectionId) {
            $query->where('section_id', $sectionId);
        }

        if ($searchText) {
            $query->where(function ($q) use ($searchText) {
                $q->where('name', 'like', "%{$searchText}%")
                    ->orWhere('student_id', 'like', "%{$searchText}%")
                    ->orWhere('guardian_name', 'like', "%{$searchText}%")
                    ->orWhere('guardian_phone', 'like', "%{$searchText}%")
                    ->orWhere('roll_no', 'like', "%{$searchText}%");
            });
        }

        $students = $query->orderBy('class_id')->orderBy('roll_no')->paginate($perPage);

        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/students', [
            'students' => $students,
            'classes' => $classes,
            'sections' => $sections,
            'filters' => [
                'class_id' => $classId,
                'section_id' => $sectionId,
                'search_text' => $searchText,
                'per_page' => $perPage,
            ],
        ]);
    }

    protected function generateAdmissionNo(): string
    {
        $prefix = SchoolSetting::where('key', 'admission_prefix')->value('value') ?? 'STU';

        $academicYearName = SchoolSetting::where('key', 'academic_year_id')->value('value');
        $academicYear = $academicYearName
            ? AcademicYear::where('name', $academicYearName)->first()
            : AcademicYear::where('is_current', true)->first();
        $year = $academicYear?->name ?? now()->format('Y');

        $like = "{$prefix}-{$year}-%";
        $last = Student::where('student_id', 'like', $like)
            ->orderByRaw('CAST(SUBSTRING_INDEX(student_id, \'-\', -1) AS UNSIGNED) DESC')
            ->value('student_id');

        if ($last) {
            $parts = explode('-', $last);
            $num = ((int) end($parts)) + 1;
        } else {
            $num = 1;
        }

        return "{$prefix}-{$year}-" . str_pad($num, 3, '0', STR_PAD_LEFT);
    }

    public function create(): Response
    {
        $classes        = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections       = Section::orderBy('name')->get(['id', 'name', 'class_id']);
        $routes         = TransportRoute::orderBy('name')->get(['id', 'name']);
        $stops          = TransportStop::orderBy('name')->get(['id', 'name', 'transport_route_id']);
        $hostelRooms    = HostelRoom::orderBy('room_no')->get(['id', 'room_no', 'type']);
        $feeStructures  = FeeStructure::with('feeHead')->get();
        $studentHouses  = StudentHouse::orderBy('name')->get(['id', 'name']);
        $allStudents    = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        return Inertia::render('school/students-form', [
            'isEdit'        => false,
            'admissionNo'   => $this->generateAdmissionNo(),
            'classes'       => $classes,
            'sections'      => $sections,
            'routes'        => $routes,
            'stops'         => $stops,
            'hostelRooms'   => $hostelRooms,
            'feeStructures' => $feeStructures,
            'studentHouses' => $studentHouses,
            'allStudents'   => $allStudents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'         => 'nullable|string|max:50|unique:students',
            'name'               => 'required|string|max:255',
            'name_bn'            => 'nullable|string|max:255',
            'class_id'           => 'required|integer|exists:classes,id',
            'section_id'         => 'required|integer|exists:sections,id',
            'roll_no'            => [
                'required', 'integer', 'min:1',
                Rule::unique('students', 'roll_no')->where(fn ($q) => $q
                    ->where('class_id', request('class_id'))
                    ->where('section_id', request('section_id'))
                ),
            ],
            'date_of_birth'      => 'required|date',
            'gender'             => 'required|string|max:20',
            'caste'              => 'nullable|string|max:100',
            'mobile_number'      => 'nullable|string|max:20',
            'religion'           => 'nullable|string|max:50',
            'nationality'        => 'nullable|string|max:50',
            'guardian_name'      => 'required|string|max:255',
            'guardian_phone'     => 'required|string|max:20',
            'mother_name'        => 'nullable|string|max:255',
            'mother_phone'       => 'nullable|string|max:20',
            'email'              => 'nullable|email|max:255',
            'birth_certificate_no' => 'nullable|string|max:50',
            'previous_school'    => 'nullable|string|max:255',
            'admission_date'     => 'nullable|date',
            'district'           => 'nullable|string|max:255',
            'address'            => 'nullable|string',
            'blood_group'        => 'nullable|string|max:5',
            'house'              => 'nullable|string|max:50',
            'height'             => 'nullable|numeric',
            'weight'             => 'nullable|numeric',
            'measurement_date'   => 'nullable|date',
            'medical_history'    => 'nullable|string',
            'national_id'        => 'nullable|string|max:50',
            'local_id'           => 'nullable|string|max:50',
            'note'               => 'nullable|string|max:500',
            'transport_route_id' => 'nullable|integer|exists:transport_routes,id',
            'transport_stop_id'  => 'nullable|integer|exists:transport_stops,id',
            'fees_month'         => 'nullable|string|max:20',
            'hostel_room_id'     => 'nullable|integer|exists:hostel_rooms,id',
            'status'             => 'required|string|max:20',
            'photo'              => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'father_photo'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'mother_photo'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'guardian_photo'     => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'doc_titles'         => 'nullable|array|max:4',
            'doc_titles.*'       => 'nullable|string|max:255',
            'doc_files'          => 'nullable|array|max:4',
            'doc_files.*'        => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'sibling_ids'        => 'nullable|array',
            'sibling_ids.*'      => 'integer|exists:students,id',
        ]);

        if (empty($validated['student_id'])) {
            $validated['student_id'] = $this->generateAdmissionNo();
        }

        // Fill legacy string columns that are still NOT NULL in DB
        $class = SchoolClass::find($validated['class_id']);
        $sec = Section::find($validated['section_id']);
        $validated['class_name'] = $class?->name ?? '';
        $validated['section'] = $sec?->name ?? '';

        // Auto-assign academic year from setting
        if (empty($validated['academic_year_id'])) {
            $academicYearName = SchoolSetting::where('key', 'academic_year_id')->value('value');
            $academicYear = $academicYearName ? AcademicYear::where('name', $academicYearName)->first() : AcademicYear::where('is_current', true)->first();
            $validated['academic_year_id'] = $academicYear?->id;
        }

        unset($validated['student_house_id']);

        foreach (['photo', 'father_photo', 'mother_photo', 'guardian_photo'] as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store('students/photos', 'public');
            }
        }

        $student = Student::create($validated);

        if ($request->hasFile('doc_files')) {
            foreach ($request->file('doc_files') as $i => $file) {
                $title = $request->input("doc_titles.{$i}", 'Document');
                $path = $file->store('students/documents', 'public');
                $student->documents()->create([
                    'type'          => 'upload',
                    'original_name' => $title,
                    'path'          => $path,
                    'size'          => $file->getSize(),
                    'mime_type'     => $file->getMimeType(),
                ]);
            }
        }

        $guardianId = $request->input('guardian_id');
        if ($guardianId) {
            $guardian = Guardian::find($guardianId);
            if ($guardian) {
                $student->guardians()->syncWithoutDetaching([$guardian->id]);
            }
        } else {
            $guardian = Guardian::create([
                'name' => $validated['guardian_name'],
                'phone' => $validated['guardian_phone'],
                'relation' => 'Father',
            ]);
            $student->guardians()->syncWithoutDetaching([$guardian->id]);
        }

        // Link siblings to the same guardian
        if (isset($guardian) && $request->filled('sibling_ids')) {
            $guardian->students()->syncWithoutDetaching($request->input('sibling_ids'));
        }

        return redirect()->route('students.index')->with('success', 'Student created successfully.');
    }

    public function show($id): Response
    {
        $student = Student::with([
            'schoolClass', 'section', 'academicYear', 'guardians',
            'documents', 'feeCollections.feeHead', 'attendances',
            'hostelAllocation.hostelRoom',
            'reports.marks', 'studentHouse',
        ])->findOrFail($id);

        $guardianIds = $student->guardians->pluck('id');
        $siblings = $guardianIds->isNotEmpty()
            ? Student::whereHas('guardians', fn ($q) => $q->whereIn('guardians.id', $guardianIds))
                ->where('id', '!=', $student->id)
                ->with(['schoolClass', 'section'])
                ->get()
            : collect();

        $currency = SchoolSetting::where('key', 'currency')->value('value') ?? 'BDT';

        $timeline = collect();

        if ($student->created_at) {
            $timeline->push([
                'date'        => $student->created_at->toDateString(),
                'datetime'    => $student->created_at->toDateTimeString(),
                'type'        => 'admission',
                'title'       => 'Student Admitted',
                'description' => "{$student->name} was admitted to the school.",
            ]);
        }

        foreach ($student->feeCollections as $fc) {
            $paidOn = $fc->paid_on ?? $fc->due_date;
            $timeline->push([
                'date'        => $paidOn,
                'datetime'    => $paidOn,
                'type'        => 'fee',
                'title'       => 'Fee Payment — ' . ($fc->feeHead?->name ?? 'N/A'),
                'description' => "Amount: {$currency} {$fc->amount} | Status: {$fc->status}" . ($fc->paid_on ? " | Paid on: {$fc->paid_on}" : ''),
            ]);
        }

        foreach ($student->reports as $report) {
            $date = $report->created_at?->toDateString() ?? $student->created_at?->toDateString() ?? now()->toDateString();
            $desc = "Exam: {$report->exam_name} | Year: {$report->academic_year}";
            if ($report->class_position !== null) {
                $desc .= " | Position: {$report->class_position}";
            }
            $timeline->push([
                'date'        => $date,
                'datetime'    => $date,
                'type'        => 'exam',
                'title'       => 'Exam Report — ' . ($report->exam_name ?? 'N/A'),
                'description' => $desc,
            ]);
        }

        foreach ($student->documents as $doc) {
            $date = $doc->created_at?->toDateString() ?? $student->created_at?->toDateString() ?? now()->toDateString();
            $timeline->push([
                'date'        => $date,
                'datetime'    => $date,
                'type'        => 'document',
                'title'       => 'Document Uploaded',
                'description' => "{$doc->original_name} ({$doc->type})",
            ]);
        }

        $timeline = $timeline->sortByDesc('date')->values();

        return Inertia::render('school/students-show', [
            'student' => $student,
            'siblings' => $siblings,
            'timeline' => $timeline,
            'currency' => $currency,
        ]);
    }

    public function edit($id): Response
    {
        $student        = Student::with(['schoolClass', 'section', 'studentHouse', 'guardians'])->findOrFail($id);
        $classes        = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections       = Section::orderBy('name')->get(['id', 'name', 'class_id']);
        $routes         = TransportRoute::orderBy('name')->get(['id', 'name']);
        $stops          = TransportStop::orderBy('name')->get(['id', 'name', 'transport_route_id']);
        $hostelRooms    = HostelRoom::orderBy('room_no')->get(['id', 'room_no', 'type']);
        $feeStructures  = FeeStructure::with('feeHead')->get();
        $studentHouses  = StudentHouse::orderBy('name')->get(['id', 'name']);
        $allStudents    = Student::orderBy('name')->get(['id', 'name', 'student_id']);

        // Compute sibling IDs from shared guardians
        $guardianIds = $student->guardians->pluck('id');
        $siblingIds = $guardianIds->isNotEmpty()
            ? Student::whereHas('guardians', fn ($q) => $q->whereIn('guardians.id', $guardianIds))
                ->where('id', '!=', $student->id)
                ->pluck('id')
            : collect();

        return Inertia::render('school/students-form', [
            'student'       => $student,
            'isEdit'        => true,
            'classes'       => $classes,
            'sections'      => $sections,
            'routes'        => $routes,
            'stops'         => $stops,
            'hostelRooms'   => $hostelRooms,
            'feeStructures' => $feeStructures,
            'studentHouses' => $studentHouses,
            'allStudents'   => $allStudents,
            'siblingIds'    => $siblingIds->toArray(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'student_id'         => ['required', 'string', 'max:50', Rule::unique('students')->ignore($id)],
            'name'               => 'required|string|max:255',
            'name_bn'            => 'nullable|string|max:255',
            'class_id'           => 'required|integer|exists:classes,id',
            'section_id'         => 'required|integer|exists:sections,id',
            'roll_no'            => [
                'required', 'integer', 'min:1',
                Rule::unique('students', 'roll_no')->ignore($id)->where(fn ($q) => $q
                    ->where('class_id', request('class_id'))
                    ->where('section_id', request('section_id'))
                ),
            ],
            'date_of_birth'      => 'required|date',
            'gender'             => 'required|string|max:20',
            'caste'              => 'nullable|string|max:100',
            'mobile_number'      => 'nullable|string|max:20',
            'religion'           => 'nullable|string|max:50',
            'nationality'        => 'nullable|string|max:50',
            'guardian_name'      => 'required|string|max:255',
            'guardian_phone'     => 'required|string|max:20',
            'mother_name'        => 'nullable|string|max:255',
            'mother_phone'       => 'nullable|string|max:20',
            'email'              => 'nullable|email|max:255',
            'birth_certificate_no' => 'nullable|string|max:50',
            'previous_school'    => 'nullable|string|max:255',
            'admission_date'     => 'nullable|date',
            'district'           => 'nullable|string|max:255',
            'address'            => 'nullable|string',
            'blood_group'        => 'nullable|string|max:5',
            'house'              => 'nullable|string|max:50',
            'height'             => 'nullable|numeric',
            'weight'             => 'nullable|numeric',
            'measurement_date'   => 'nullable|date',
            'medical_history'    => 'nullable|string',
            'national_id'        => 'nullable|string|max:50',
            'local_id'           => 'nullable|string|max:50',
            'note'               => 'nullable|string|max:500',
            'transport_route_id' => 'nullable|integer|exists:transport_routes,id',
            'transport_stop_id'  => 'nullable|integer|exists:transport_stops,id',
            'fees_month'         => 'nullable|string|max:20',
            'hostel_room_id'     => 'nullable|integer|exists:hostel_rooms,id',
            'status'             => 'required|string|max:20',
            'photo'              => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'father_photo'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'mother_photo'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'guardian_photo'     => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'doc_titles'         => 'nullable|array|max:4',
            'doc_titles.*'       => 'nullable|string|max:255',
            'doc_files'          => 'nullable|array|max:4',
            'doc_files.*'        => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'sibling_ids'        => 'nullable|array',
            'sibling_ids.*'      => 'integer|exists:students,id',
        ]);

        unset($validated['student_house_id']);

        foreach (['photo', 'father_photo', 'mother_photo', 'guardian_photo'] as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store('students/photos', 'public');
            }
        }

        // Fill legacy string columns
        $class = SchoolClass::find($validated['class_id']);
        $sec = Section::find($validated['section_id']);
        $validated['class_name'] = $class?->name ?? '';
        $validated['section'] = $sec?->name ?? '';

        // Auto-assign academic year from setting
        if (empty($validated['academic_year_id'])) {
            $academicYearName = SchoolSetting::where('key', 'academic_year_id')->value('value');
            $academicYear = $academicYearName ? AcademicYear::where('name', $academicYearName)->first() : AcademicYear::where('is_current', true)->first();
            $validated['academic_year_id'] = $academicYear?->id;
        }

        $student->update($validated);

        if ($request->hasFile('doc_files')) {
            foreach ($request->file('doc_files') as $i => $file) {
                $title = $request->input("doc_titles.{$i}", 'Document');
                $path = $file->store('students/documents', 'public');
                $student->documents()->create([
                    'type'          => 'upload',
                    'original_name' => $title,
                    'path'          => $path,
                    'size'          => $file->getSize(),
                    'mime_type'     => $file->getMimeType(),
                ]);
            }
        }

        $guardianId = $request->input('guardian_id');
        if ($guardianId) {
            $guardian = Guardian::find($guardianId);
            if ($guardian) {
                $student->guardians()->sync([$guardian->id]);
            }
        } else {
            $guardian = Guardian::create([
                'name' => $validated['guardian_name'],
                'phone' => $validated['guardian_phone'],
                'relation' => 'Father',
            ]);
            $student->guardians()->sync([$guardian->id]);
        }

        // Link siblings to the same guardian
        if (isset($guardian) && $request->filled('sibling_ids')) {
            $guardian->students()->syncWithoutDetaching($request->input('sibling_ids'));
        }

        return redirect()->route('students.index')->with('success', 'Student updated successfully.');
    }

    public function showImportForm(): Response
    {
        $classes  = SchoolClass::orderBy('name')->get(['id', 'name']);
        $sections = Section::orderBy('name')->get(['id', 'name', 'class_id']);

        return Inertia::render('school/students-import', [
            'classes'  => $classes,
            'sections' => $sections,
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $file    = $request->file('file');
        $handle  = fopen($file->getRealPath(), 'r');
        if (!$handle) {
            return redirect()->route('students.import')->with('error', 'Could not read file.');
        }

        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            return redirect()->route('students.import')->with('error', 'Empty or invalid CSV file.');
        }
        $headers = array_map('trim', $headers);

        $headerMap = [
            'name' => 'name', 'class' => 'class_name', 'class name' => 'class_name',
            'class_name' => 'class_name', 'section' => 'section_name', 'section name' => 'section_name',
            'section_name' => 'section_name', 'roll' => 'roll_no', 'roll no' => 'roll_no',
            'roll_no' => 'roll_no', 'gender' => 'gender', 'dob' => 'date_of_birth',
            'date of birth' => 'date_of_birth', 'date_of_birth' => 'date_of_birth',
            'guardian name' => 'guardian_name', 'guardian_name' => 'guardian_name',
            'guardian phone' => 'guardian_phone', 'guardian_phone' => 'guardian_phone',
            'mother name' => 'mother_name', 'mother_name' => 'mother_name',
            'mother phone' => 'mother_phone', 'mother_phone' => 'mother_phone',
            'religion' => 'religion', 'blood group' => 'blood_group',
            'blood_group' => 'blood_group', 'address' => 'address',
            'mobile' => 'mobile_number', 'mobile number' => 'mobile_number',
            'mobile_number' => 'mobile_number', 'nationality' => 'nationality',
            'caste' => 'caste', 'previous school' => 'previous_school',
            'previous_school' => 'previous_school', 'email' => 'email',
            'district' => 'district', 'name bn' => 'name_bn', 'name_bn' => 'name_bn',
            'status' => 'status', 'birth certificate no' => 'birth_certificate_no',
            'birth_certificate_no' => 'birth_certificate_no',
            'admission date' => 'admission_date', 'admission_date' => 'admission_date',
            'national id' => 'national_id', 'national_id' => 'national_id',
            'local id' => 'local_id', 'local_id' => 'local_id',
            'note' => 'note',
        ];

        $fieldMap = [];
        foreach ($headers as $i => $h) {
            $lower = strtolower(trim($h));
            if (isset($headerMap[$lower])) {
                $fieldMap[$i] = $headerMap[$lower];
            }
        }

        $academicYearName = SchoolSetting::where('key', 'academic_year_id')->value('value');
        $academicYear     = $academicYearName
            ? AcademicYear::where('name', $academicYearName)->first()
            : AcademicYear::where('is_current', true)->first();

        $results = ['success' => 0, 'skipped' => 0, 'errors' => []];
        $line    = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $line++;
            $data = [];
            foreach ($fieldMap as $ci => $fld) {
                $data[$fld] = trim($row[$ci] ?? '');
            }

            $required = ['name', 'class_name', 'section_name', 'roll_no', 'gender', 'date_of_birth', 'guardian_name', 'guardian_phone'];
            $missing  = [];
            foreach ($required as $r) {
                if (empty($data[$r])) {
                    $missing[] = $r;
                }
            }
            if ($missing) {
                $results['errors'][] = "Row {$line}: Missing required fields: " . implode(', ', $missing);
                $results['skipped']++;
                continue;
            }

            $class = SchoolClass::where('name', $data['class_name'])->first();
            if (!$class) {
                $results['errors'][] = "Row {$line}: Class '{$data['class_name']}' not found.";
                $results['skipped']++;
                continue;
            }

            $section = Section::where('class_id', $class->id)->where('name', $data['section_name'])->first();
            if (!$section) {
                $results['errors'][] = "Row {$line}: Section '{$data['section_name']}' not found in class '{$class->name}'.";
                $results['skipped']++;
                continue;
            }

            $exists = Student::where('class_id', $class->id)
                ->where('section_id', $section->id)
                ->where('roll_no', $data['roll_no'])
                ->exists();
            if ($exists) {
                $results['errors'][] = "Row {$line}: Roll no {$data['roll_no']} already exists in {$class->name} - {$section->name}.";
                $results['skipped']++;
                continue;
            }

            try {
                $student = Student::create([
                    'student_id'         => $this->generateAdmissionNo(),
                    'name'               => $data['name'],
                    'name_bn'            => $data['name_bn'] ?? null,
                    'class_id'           => $class->id,
                    'section_id'         => $section->id,
                    'class_name'         => $class->name,
                    'section'            => $section->name,
                    'roll_no'            => $data['roll_no'],
                    'gender'             => $data['gender'],
                    'date_of_birth'      => $data['date_of_birth'],
                    'guardian_name'      => $data['guardian_name'],
                    'guardian_phone'     => $data['guardian_phone'],
                    'mother_name'        => $data['mother_name'] ?? null,
                    'mother_phone'       => $data['mother_phone'] ?? null,
                    'religion'           => $data['religion'] ?? null,
                    'blood_group'        => $data['blood_group'] ?? null,
                    'address'            => $data['address'] ?? null,
                    'mobile_number'      => $data['mobile_number'] ?? null,
                    'nationality'        => $data['nationality'] ?? 'Bangladeshi',
                    'caste'              => $data['caste'] ?? null,
                    'previous_school'    => $data['previous_school'] ?? null,
                    'birth_certificate_no' => $data['birth_certificate_no'] ?? null,
                    'email'              => $data['email'] ?? null,
                    'district'           => $data['district'] ?? null,
                    'admission_date'     => $data['admission_date'] ?? now()->toDateString(),
                    'national_id'        => $data['national_id'] ?? null,
                    'local_id'           => $data['local_id'] ?? null,
                    'note'               => $data['note'] ?? null,
                    'academic_year_id'   => $academicYear?->id,
                    'status'             => $data['status'] ?? 'active',
                ]);

                $guardian = Guardian::firstOrCreate(
                    ['phone' => $data['guardian_phone']],
                    ['name' => $data['guardian_name'], 'relation' => 'Father']
                );
                $student->guardians()->syncWithoutDetaching([$guardian->id]);

                $results['success']++;
            } catch (\Exception $e) {
                $results['errors'][] = "Row {$line}: " . $e->getMessage();
                $results['skipped']++;
            }
        }

        fclose($handle);

        return redirect()->route('students.import')->with([
            'importResults' => $results,
            'success'       => "Imported {$results['success']} student(s)." . ($results['skipped'] > 0 ? " Skipped {$results['skipped']} row(s)." : ''),
        ]);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return redirect()->route('students.index')->with('success', 'Student deleted successfully.');
    }

    public function print($id): Response
    {
        $student = Student::with([
            'schoolClass', 'section', 'academicYear', 'guardians',
            'hostelAllocation.hostelRoom',
        ])->findOrFail($id);

        // Load transport info
        $route = $student->transport_route_id
            ? \App\Models\TransportRoute::find($student->transport_route_id)
            : null;
        $stop = $student->transport_stop_id
            ? \App\Models\TransportStop::find($student->transport_stop_id)
            : null;
        $hostelRoom = $student->hostel_room_id
            ? \App\Models\HostelRoom::find($student->hostel_room_id)
            : null;

        $settings = SchoolSetting::all()->pluck('value', 'key');

        return Inertia::render('school/students-print', [
            'student'    => $student,
            'route'      => $route,
            'stop'       => $stop,
            'hostelRoom' => $hostelRoom,
            'settings'   => $settings,
        ]);
    }

    public function toggleStatus($id)
    {
        $student = Student::findOrFail($id);
        $student->status = $student->status === 'active' ? 'inactive' : 'active';
        $student->save();

        return redirect()->back()->with('success', 'Student status updated successfully.');
    }
}
