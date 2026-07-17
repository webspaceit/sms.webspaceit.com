<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\SchoolSetting;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IdCardController extends Controller
{
    public function index(): Response
    {
        $classes = SchoolClass::orderBy('name')->get(['id', 'name']);
        $teachers = Teacher::orderBy('name')->get(['id', 'name', 'employee_id', 'designation']);
        $students = Student::orderBy('class_id')->orderBy('roll_no')->get();

        $school = SchoolSetting::all()->pluck('value', 'key');

        return Inertia::render('school/id-cards/index', [
            'classes' => $classes,
            'teachers' => $teachers,
            'students' => $students,
            'school' => [
                'name' => $school->get('school_name', 'School Name'),
                'address' => $school->get('school_address', 'School Address'),
            ],
        ]);
    }
}
