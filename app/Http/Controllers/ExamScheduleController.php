<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\ClassSubject;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $examId = $request->input('exam_id');

        $query = ExamSchedule::with(['exam', 'schoolClass', 'subject', 'hall']);

        if ($examId) {
            $query->where('exam_id', $examId);
        }

        $schedules = $query->orderBy('date')->orderBy('start_time')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'exam_name' => $s->exam?->name,
                'class_name' => $s->schoolClass?->name,
                'subject_name' => $s->subject?->name,
                'date' => $s->date?->format('Y-m-d'),
                'start_time' => $s->start_time?->format('H:i'),
                'end_time' => $s->end_time?->format('H:i'),
                'hall_name' => $s->hall?->name . ($s->hall?->room_no ? ' (Room ' . $s->hall->room_no . ')' : ''),
            ];
        });

        $exams = Exam::orderBy('start_date', 'desc')->get(['id', 'name']);

        return Inertia::render('school/exam-schedules/index', [
            'schedules' => $schedules,
            'exams' => $exams,
            'filters' => ['exam_id' => $examId],
        ]);
    }

    public function create(): Response
    {
        $exams = Exam::orderBy('start_date', 'desc')->get(['id', 'name']);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);
        $branches = Branch::orderBy('name')->get(['id', 'name']);
        $sections = Section::with('schoolClass')->orderBy('name')->get(['id', 'class_id', 'name', 'room_no']);
        $classSubjects = ClassSubject::select('class_id', 'subject_id')
            ->get()
            ->groupBy('class_id')
            ->map(fn($items) => $items->pluck('subject_id'));

        return Inertia::render('school/exam-schedules/create', [
            'exams' => $exams,
            'classes' => $classes,
            'subjects' => $subjects,
            'classSubjects' => $classSubjects,
            'branches' => $branches,
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'hall_id' => 'nullable|exists:sections,id',
        ]);

        ExamSchedule::create($validated);

        return redirect()->route('exam-schedules.index')->with('success', 'Exam schedule created successfully.');
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'nullable|exists:sections,id',
            'branch_id' => 'nullable|exists:branches,id',
            'timetable' => 'required|array|min:1',
            'timetable.*.subject_id' => 'required|exists:subjects,id',
            'timetable.*.date' => 'required|date',
            'timetable.*.time_start' => 'required',
            'timetable.*.time_end' => 'required',
            'timetable.*.hall_id' => 'nullable|exists:sections,id',
        ]);

        $created = 0;
        foreach ($validated['timetable'] as $entry) {
            $exists = ExamSchedule::where('exam_id', $validated['exam_id'])
                ->where('class_id', $validated['class_id'])
                ->where('subject_id', $entry['subject_id'])
                ->exists();

            if (!$exists) {
                ExamSchedule::create([
                    'exam_id' => $validated['exam_id'],
                    'class_id' => $validated['class_id'],
                    'subject_id' => $entry['subject_id'],
                    'date' => $entry['date'],
                    'start_time' => $entry['time_start'],
                    'end_time' => $entry['time_end'],
                    'hall_id' => $entry['hall_id'] ?? null,
                ]);
                $created++;
            }
        }

        return redirect()->route('exam-schedules.index')
            ->with('success', "{$created} schedule(s) created successfully.");
    }

    public function show($id): Response
    {
        $schedule = ExamSchedule::with(['exam', 'schoolClass', 'subject', 'hall'])->findOrFail($id);

        return Inertia::render('school/exam-schedules/show', [
            'schedule' => $schedule,
        ]);
    }

    public function edit($id): Response
    {
        $schedule = ExamSchedule::with('schoolClass', 'hall')->findOrFail($id);
        $exams = Exam::orderBy('start_date', 'desc')->get(['id', 'name']);
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);
        $sections = Section::with('schoolClass')->orderBy('name')->get(['id', 'class_id', 'name', 'room_no']);
        $classSubjects = ClassSubject::select('class_id', 'subject_id')
            ->get()
            ->groupBy('class_id')
            ->map(fn($items) => $items->pluck('subject_id'));

        return Inertia::render('school/exam-schedules/form', [
            'schedule' => $schedule,
            'exams' => $exams,
            'classes' => $classes,
            'subjects' => $subjects,
            'classSubjects' => $classSubjects,
            'sections' => $sections,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $schedule = ExamSchedule::findOrFail($id);

        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'hall_id' => 'nullable|exists:sections,id',
        ]);

        $schedule->update($validated);

        return redirect()->route('exam-schedules.index')->with('success', 'Exam schedule updated successfully.');
    }

    public function destroy($id)
    {
        $schedule = ExamSchedule::findOrFail($id);
        $schedule->delete();

        return redirect()->route('exam-schedules.index')->with('success', 'Exam schedule deleted successfully.');
    }

    public function sample()
    {
        $exam = Exam::first();
        if (!$exam) {
            return redirect()->route('exam-schedules.index')->with('error', 'No exams found. Create an exam first.');
        }

        $classSubjects = ClassSubject::all()->groupBy('class_id');
        $date = now()->addDays(7);
        $count = 0;

        foreach ($classSubjects as $classId => $items) {
            foreach ($items as $cs) {
                $existing = ExamSchedule::where('exam_id', $exam->id)
                    ->where('class_id', $classId)
                    ->where('subject_id', $cs->subject_id)
                    ->exists();

                if (!$existing) {
                    ExamSchedule::create([
                        'exam_id' => $exam->id,
                        'class_id' => $classId,
                        'subject_id' => $cs->subject_id,
                        'date' => $date->format('Y-m-d'),
                        'start_time' => '10:00',
                        'end_time' => '12:00',
                    ]);
                    $count++;
                }
                $date->addDay();
            }
        }

        return redirect()->route('exam-schedules.index')
            ->with('success', "{$count} sample schedules created.");
    }
}
