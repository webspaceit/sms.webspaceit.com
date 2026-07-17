<?php

namespace App\Http\Controllers;

use App\Models\AcademicReport;
use App\Models\Attendance;
use App\Models\FeeCollection;
use App\Models\Notice;
use App\Models\SchoolClass;
use App\Models\SchoolSetting;
use App\Models\Student;
use App\Models\StudyMaterial;
use App\Models\Teacher;
use App\Models\TeacherAttendance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SchoolController extends Controller
{
    public function dashboard(): Response
    {
        $user = Auth::user();

        if ($user->role === 'student') {
            return $this->studentDashboard($user);
        }

        if ($user->role === 'teacher') {
            return $this->teacherDashboard($user);
        }

        if ($user->role === 'parent' || $user->role === 'guardian') {
            return $this->parentDashboard($user);
        }

        return $this->adminDashboard();
    }

    private function adminDashboard(): Response
    {
        $settings = SchoolSetting::all()->pluck('value', 'key');

        $students = DB::table('students')->count();
        $teachers = DB::table('teachers')->count();
        $attendanceRate = DB::table('attendances')->count()
            ? round((DB::table('attendances')->where('status', 'present')->count() / DB::table('attendances')->count()) * 100)
            : 0;
        $feesCollected = DB::table('fee_collections')->where('status', 'paid')->sum('amount');

        return Inertia::render('dashboard', [
            'role' => 'admin',
            'school' => [
                'name' => $settings->get('school_name', 'WSIT School Management System'),
                'address' => $settings->get('school_address', 'Holding No. 00-0865, Gulshan Para, Chuadanga'),
                'footer' => $settings->get('school_footer', 'Powered by: Web Space IT'),
                'footer_url' => $settings->get('school_footer_url', ''),
            ],
            'stats' => [
                ['label' => 'Students', 'value' => number_format($students), 'note' => (fn($c) => $c->first()?->name.' to '.$c->last()?->name)(SchoolClass::orderBy('name')->get())],
                ['label' => 'Teachers', 'value' => number_format($teachers), 'note' => 'Bangla, English, ICT and science'],
                ['label' => 'Attendance', 'value' => $attendanceRate.'%', 'note' => 'Today across sections'],
                ['label' => 'Fees Collected', 'value' => 'BDT '.number_format($feesCollected), 'note' => 'Current month'],
            ],
            'recentStudents' => DB::table('students')->latest()->limit(5)->get(),
            'feeSummary' => DB::table('fee_collections')
                ->select('status', DB::raw('count(*) as total'), DB::raw('sum(amount) as amount'))
                ->groupBy('status')
                ->get(),
        ]);
    }

    private function studentDashboard($user): Response
    {
        $student = Student::where('email', $user->email)->first();
        $settings = SchoolSetting::all()->pluck('value', 'key');

        $reports = $student ? AcademicReport::with('marks')
            ->where('student_id', $student->id)
            ->latest()
            ->get() : collect();

        $studyMaterials = $student
            ? StudyMaterial::with(['subject', 'teacher'])
                ->where(function ($q) use ($student) {
                    $q->where('class_id', $student->class_id)->orWhereNull('class_id');
                })
                ->latest()
                ->get()
            : collect();

        $attendance = $student
            ? Attendance::where('student_id', $student->id)->latest()->limit(30)->get()
            : collect();

        $notices = Notice::latest()->limit(10)->get();

        $fees = $student
            ? FeeCollection::with('feeHead')
                ->where('student_id', $student->id)
                ->latest()
                ->get()
                ->map(fn ($f) => [
                    'id' => $f->id,
                    'invoice_no' => $f->invoice_no,
                    'amount' => $f->amount,
                    'status' => $f->status,
                    'fee_head' => $f->feeHead?->name,
                    'month' => $f->month,
                    'paid_on' => $f->paid_on?->format('Y-m-d'),
                    'due_date' => $f->due_date?->format('Y-m-d'),
                ])
            : collect();

        return Inertia::render('dashboard/student', [
            'role' => 'student',
            'schoolName' => $settings->get('school_name', 'School Name'),
            'student' => $student,
            'reports' => $reports,
            'studyMaterials' => $studyMaterials,
            'attendance' => $attendance,
            'notices' => $notices,
            'fees' => $fees,
        ]);
    }

    private function teacherDashboard($user): Response
    {
        $teacher = Teacher::where('user_id', $user->id)->first();
        $settings = SchoolSetting::all()->pluck('value', 'key');

        $classIds = $teacher ? $teacher->teacherSubjects()->pluck('class_id')->unique()->toArray() : [];

        $totalStudents = $classIds ? Student::whereIn('class_id', $classIds)->count() : 0;

        $todayAttendance = $teacher
            ? TeacherAttendance::where('teacher_id', $teacher->id)
                ->whereDate('date', now()->toDateString())
                ->first()
            : null;

        $myMaterials = $teacher
            ? StudyMaterial::where('teacher_id', $teacher->id)->latest()->limit(5)->get()
            : collect();

        $recentReports = $teacher
            ? AcademicReport::with('student')
                ->whereHas('student', fn ($q) => $q->whereIn('class_id', $classIds))
                ->latest()
                ->limit(10)
                ->get()
            : collect();

        return Inertia::render('dashboard/teacher', [
            'role' => 'teacher',
            'schoolName' => $settings->get('school_name', 'School Name'),
            'teacher' => $teacher,
            'totalStudents' => $totalStudents,
            'todayAttendance' => $todayAttendance,
            'myMaterials' => $myMaterials,
            'recentReports' => $recentReports,
        ]);
    }

    private function parentDashboard($user): Response
    {
        $guardian = DB::table('guardians')->where('email', $user->email)->first();
        $settings = SchoolSetting::all()->pluck('value', 'key');

        $children = $guardian
            ? Student::whereIn('id', function ($q) use ($guardian) {
                $q->select('student_id')->from('student_guardian')->where('guardian_id', $guardian->id);
            })->get()
            : collect();

        $childIds = $children->pluck('id');

        $feesByChild = $childIds->isNotEmpty()
            ? FeeCollection::with('feeHead')
                ->whereIn('student_id', $childIds)
                ->latest()
                ->get()
                ->groupBy('student_id')
                ->map(fn ($group) => $group->map(fn ($f) => [
                    'id' => $f->id,
                    'invoice_no' => $f->invoice_no,
                    'amount' => $f->amount,
                    'status' => $f->status,
                    'fee_head' => $f->feeHead?->name,
                    'month' => $f->month,
                    'paid_on' => $f->paid_on?->format('Y-m-d'),
                    'due_date' => $f->due_date?->format('Y-m-d'),
                ]))
            : collect();

        $notices = Notice::latest()->limit(10)->get();

        return Inertia::render('dashboard/parent', [
            'role' => 'parent',
            'schoolName' => $settings->get('school_name', 'School Name'),
            'children' => $children,
            'feesByChild' => $feesByChild,
            'notices' => $notices,
        ]);
    }
}
