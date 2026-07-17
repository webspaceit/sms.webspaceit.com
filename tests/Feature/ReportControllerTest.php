<?php

namespace Tests\Feature;

use App\Models\AcademicReport;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Student $student;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->student = Student::create([
            'student_id' => 'STU-2026-999',
            'name' => 'John Doe',
            'class_name' => 'Class 6',
            'section' => 'A',
            'roll_no' => 12,
            'date_of_birth' => '2014-01-01',
            'gender' => 'Male',
            'guardian_name' => 'Jane Doe',
            'guardian_phone' => '01711000000',
            'district' => 'Dhaka',
            'address' => 'Test Address',
            'blood_group' => 'O+',
        ]);
    }

    public function test_guests_are_redirected_to_login()
    {
        $response = $this->get(route('reports.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_reports_list()
    {
        $this->actingAs($this->user);

        $report = AcademicReport::create([
            'student_id' => $this->student->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 95,
            'absent_days' => 5,
        ]);

        $report->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 95,
            'written_marks' => 70,
            'mcq_marks' => 20,
        ]);

        $response = $this->get(route('reports.index'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/reports/index')
            ->has('reports', 1)
            ->where('reports.0.student_name', 'John Doe')
            ->where('reports.0.exam_name', 'Half Yearly Exam')
        );
    }

    public function test_authenticated_users_can_search_reports()
    {
        $this->actingAs($this->user);

        $student2 = Student::create([
            'student_id' => 'STU-2026-888',
            'name' => 'Alice Smith',
            'class_name' => 'Class 7',
            'section' => 'B',
            'roll_no' => 15,
            'date_of_birth' => '2013-05-05',
            'gender' => 'Female',
            'guardian_name' => 'Bob Smith',
            'guardian_phone' => '01722000000',
            'district' => 'Dhaka',
        ]);

        $report1 = AcademicReport::create([
            'student_id' => $this->student->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 95,
            'absent_days' => 5,
        ]);

        $report2 = AcademicReport::create([
            'student_id' => $student2->id,
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 90,
            'absent_days' => 10,
        ]);

        // Search by student name
        $response = $this->get(route('reports.index', ['search' => 'Alice']));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/reports/index')
            ->has('reports', 1)
            ->where('reports.0.student_name', 'Alice Smith')
        );

        // Search by exam name
        $response2 = $this->get(route('reports.index', ['search' => 'Half']));
        $response2->assertOk();
        $response2->assertInertia(fn (Assert $page) => $page
            ->component('school/reports/index')
            ->has('reports', 1)
            ->where('reports.0.student_name', 'John Doe')
        );
    }

    public function test_authenticated_users_can_view_create_page()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('reports.create'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/reports/form')
            ->has('students')
            ->has('defaultSubjects')
            ->where('isEdit', false)
        );
    }

    public function test_authenticated_users_can_store_academic_report()
    {
        $this->actingAs($this->user);

        $data = [
            'student_id' => $this->student->id,
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
            'class_position' => 1,
            'working_days' => 100,
            'present_days' => 98,
            'absent_days' => 2,
            'moral_evaluation' => 'Excellent',
            'co_curricular' => ['Sports', 'Music'],
            'comments' => 'Keep it up!',
            'marks' => [
                [
                    'subject_name' => 'Bangla',
                    'full_marks' => 100,
                    'highest_marks' => 90,
                    'written_marks' => 60,
                    'mcq_marks' => 25,
                    'practical_marks' => null,
                    'ca_marks' => null,
                ],
                [
                    'subject_name' => 'Mathematics',
                    'full_marks' => 100,
                    'highest_marks' => 100,
                    'written_marks' => 70,
                    'mcq_marks' => 30,
                    'practical_marks' => null,
                    'ca_marks' => null,
                ]
            ],
        ];

        $response = $this->post(route('reports.store'), $data);
        $response->assertRedirect(route('reports.index'));

        $this->assertDatabaseHas('academic_reports', [
            'student_id' => $this->student->id,
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
        ]);

        $report = AcademicReport::first();
        $this->assertCount(2, $report->marks);
        $this->assertDatabaseHas('academic_report_marks', [
            'academic_report_id' => $report->id,
            'subject_name' => 'Bangla',
            'written_marks' => 60,
            'mcq_marks' => 25,
        ]);
    }

    public function test_store_validation_requires_all_fields()
    {
        $this->actingAs($this->user);

        $response = $this->post(route('reports.store'), []);
        $response->assertSessionHasErrors([
            'student_id', 'exam_name', 'academic_year', 'working_days', 'present_days', 'absent_days', 'marks'
        ]);
    }

    public function test_authenticated_users_can_view_edit_page()
    {
        $this->actingAs($this->user);

        $report = AcademicReport::create([
            'student_id' => $this->student->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 95,
            'absent_days' => 5,
        ]);

        $response = $this->get(route('reports.edit', $report->id));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/reports/form')
            ->has('students')
            ->has('report')
            ->where('isEdit', true)
        );
    }

    public function test_authenticated_users_can_update_report()
    {
        $this->actingAs($this->user);

        $report = AcademicReport::create([
            'student_id' => $this->student->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 95,
            'absent_days' => 5,
        ]);

        $report->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 95,
            'written_marks' => 70,
            'mcq_marks' => 20,
        ]);

        $updateData = [
            'student_id' => $this->student->id,
            'exam_name' => 'Updated Exam Name',
            'academic_year' => '2026',
            'class_position' => 2,
            'working_days' => 110,
            'present_days' => 105,
            'absent_days' => 5,
            'moral_evaluation' => 'Good',
            'co_curricular' => ['Art'],
            'comments' => 'Improved performance.',
            'marks' => [
                [
                    'subject_name' => 'Mathematics',
                    'full_marks' => 100,
                    'highest_marks' => 98,
                    'written_marks' => 80,
                    'mcq_marks' => 18,
                    'practical_marks' => null,
                    'ca_marks' => null,
                ]
            ],
        ];

        $response = $this->put(route('reports.update', $report->id), $updateData);
        $response->assertRedirect(route('reports.index'));

        $this->assertDatabaseHas('academic_reports', [
            'id' => $report->id,
            'exam_name' => 'Updated Exam Name',
            'class_position' => 2,
        ]);

        $this->assertDatabaseHas('academic_report_marks', [
            'academic_report_id' => $report->id,
            'subject_name' => 'Mathematics',
            'written_marks' => 80,
            'mcq_marks' => 18,
        ]);
    }

    public function test_authenticated_users_can_delete_report()
    {
        $this->actingAs($this->user);

        $report = AcademicReport::create([
            'student_id' => $this->student->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 95,
            'absent_days' => 5,
        ]);

        $mark = $report->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 95,
            'written_marks' => 70,
            'mcq_marks' => 20,
        ]);

        $response = $this->delete(route('reports.destroy', $report->id));
        $response->assertRedirect(route('reports.index'));

        $this->assertDatabaseMissing('academic_reports', [
            'id' => $report->id,
        ]);

        // Cascade delete check
        $this->assertDatabaseMissing('academic_report_marks', [
            'id' => $mark->id,
        ]);
    }

    public function test_authenticated_users_can_view_show_page()
    {
        $this->actingAs($this->user);

        $report = AcademicReport::create([
            'student_id' => $this->student->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 95,
            'absent_days' => 5,
        ]);

        $report->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 95,
            'written_marks' => 70,
            'mcq_marks' => 20,
        ]);

        $response = $this->get(route('reports.show', $report->id));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/reports/show')
            ->has('report')
            ->has('calculated')
            ->has('school')
        );
    }
}
