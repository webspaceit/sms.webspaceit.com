<?php

namespace App\Http\Controllers;

use App\Models\AcademicReport;
use App\Models\AcademicReportMark;
use App\Models\AdmitCard;
use App\Models\SchoolSetting;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdmitCardController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = AdmitCard::query();

        if ($search) {
            $query->where('class_name', 'like', "%{$search}%")
                ->orWhere('section', 'like', "%{$search}%")
                ->orWhere('exam_name', 'like', "%{$search}%")
                ->orWhere('academic_year', 'like', "%{$search}%");
        }

        $admitCards = $query->latest()->get()->map(function ($admitCard) {
            $studentsCount = Student::where('class_name', $admitCard->class_name)
                ->where('section', $admitCard->section)
                ->count();

            return [
                'id' => $admitCard->id,
                'class_name' => $admitCard->class_name,
                'section' => $admitCard->section,
                'exam_name' => $admitCard->exam_name,
                'academic_year' => $admitCard->academic_year,
                'start_time' => $admitCard->start_time,
                'students_count' => $studentsCount,
                'created_at' => $admitCard->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('school/admit-cards/index', [
            'admitCards' => $admitCards,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');

        // Fetch distinct subjects to populate helper options in the routine form builder
        $subjects = AcademicReportMark::select('subject_name')->distinct()->orderBy('subject_name')->pluck('subject_name');

        return Inertia::render('school/admit-cards/form', [
            'classes' => $classes,
            'sections' => $sections,
            'exams' => $exams,
            'years' => $years,
            'subjects' => $subjects,
            'isEdit' => false,
            'defaultInstructions' => [
                'Examinee must enter into the exam hall at least 15 minutes before the exam starts.',
                'No extra papers will be allowed except the admit and registration card.',
                'Examinee must carry all necessary essentials for the exam (e.g., pen, pencil, eraser, ruler).',
                'Authority reserves all rights to expel the examinee due to unfair-means in the exam.'
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_name' => [
                'required', 'string', 'max:50',
                Rule::unique('admit_cards')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
            'start_time' => 'required|string|max:30',
            'instructions' => 'nullable|array',
            'routine' => 'nullable|array',
        ], [
            'class_name.unique' => 'An admit card configuration for this class, section, exam and academic year already exists.'
        ]);

        AdmitCard::create($validated);

        return redirect()->route('admit-cards.index')->with('success', 'Admit card configuration created successfully.');
    }

    public function show($id): Response
    {
        $admitCard = AdmitCard::findOrFail($id);

        // Fetch students in this class/section
        $students = Student::where('class_name', $admitCard->class_name)
            ->where('section', $admitCard->section)
            ->orderBy('roll_no')
            ->get();

        return Inertia::render('school/admit-cards/show', [
            'admitCard' => $admitCard,
            'students' => $students,
            'school' => [
                'name' => SchoolSetting::where('key', 'school_name')->value('value') ?? 'WSIT School Management System',
                'address' => SchoolSetting::where('key', 'school_address')->value('value') ?? 'Holding No. 00-0865, Gulshan Para, Chuadanga',
                'footer' => SchoolSetting::where('key', 'school_footer')->value('value') ?? 'Powered by: Web Space IT',
            ],
            'generatedDate' => now()->format('jS F, Y'),
        ]);
    }

    public function edit($id): Response
    {
        $admitCard = AdmitCard::findOrFail($id);

        $classes = Student::select('class_name')->distinct()->orderBy('class_name')->pluck('class_name');
        $sections = Student::select('section')->distinct()->orderBy('section')->pluck('section');
        $exams = AcademicReport::select('exam_name')->distinct()->orderBy('exam_name')->pluck('exam_name');
        $years = AcademicReport::select('academic_year')->distinct()->orderBy('academic_year')->pluck('academic_year');
        $subjects = AcademicReportMark::select('subject_name')->distinct()->orderBy('subject_name')->pluck('subject_name');

        return Inertia::render('school/admit-cards/form', [
            'admitCard' => $admitCard,
            'classes' => $classes,
            'sections' => $sections,
            'exams' => $exams,
            'years' => $years,
            'subjects' => $subjects,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $admitCard = AdmitCard::findOrFail($id);

        $validated = $request->validate([
            'class_name' => [
                'required', 'string', 'max:50',
                Rule::unique('admit_cards')->where(fn ($q) => $q
                    ->where('section', $request->section)
                    ->where('exam_name', $request->exam_name)
                    ->where('academic_year', $request->academic_year)
                )->ignore($id)
            ],
            'section' => 'required|string|max:30',
            'exam_name' => 'required|string|max:50',
            'academic_year' => 'required|string|max:15',
            'start_time' => 'required|string|max:30',
            'instructions' => 'nullable|array',
            'routine' => 'nullable|array',
        ], [
            'class_name.unique' => 'An admit card configuration for this class, section, exam and academic year already exists.'
        ]);

        $admitCard->update($validated);

        return redirect()->route('admit-cards.index')->with('success', 'Admit card configuration updated successfully.');
    }

    public function destroy($id)
    {
        $admitCard = AdmitCard::findOrFail($id);
        $admitCard->delete();

        return redirect()->route('admit-cards.index')->with('success', 'Admit card configuration deleted successfully.');
    }
}
