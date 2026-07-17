<?php

namespace Tests\Feature;

use App\Models\AcademicReport;
use App\Models\FailList;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FailListControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Student $student1;
    private Student $student2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->student1 = Student::create([
            'student_id' => 'STU-001',
            'name' => 'Failed Student',
            'class_name' => 'Class 6',
            'section' => 'A',
            'roll_no' => 10,
            'date_of_birth' => '2014-01-01',
            'gender' => 'Male',
            'guardian_name' => 'Guardian 1',
            'guardian_phone' => '01711000001',
            'district' => 'Dhaka',
        ]);

        $this->student2 = Student::create([
            'student_id' => 'STU-002',
            'name' => 'Passed Student',
            'class_name' => 'Class 6',
            'section' => 'A',
            'roll_no' => 11,
            'date_of_birth' => '2014-02-02',
            'gender' => 'Female',
            'guardian_name' => 'Guardian 2',
            'guardian_phone' => '01711000002',
            'district' => 'Dhaka',
        ]);
    }

    public function test_guests_are_redirected_to_login()
    {
        $response = $this->get(route('fail-lists.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_fail_lists_index()
    {
        $this->actingAs($this->user);

        FailList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('fail-lists.index'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/fail-lists/index')
            ->has('failLists', 1)
            ->where('failLists.0.class_name', 'Class 6')
            ->where('failLists.0.section', 'A')
        );
    }

    public function test_authenticated_users_can_search_fail_lists()
    {
        $this->actingAs($this->user);

        FailList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        FailList::create([
            'class_name' => 'Class 7',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('fail-lists.index', ['search' => 'Class 7']));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/fail-lists/index')
            ->has('failLists', 1)
            ->where('failLists.0.class_name', 'Class 7')
        );
    }

    public function test_authenticated_users_can_view_create_page()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('fail-lists.create'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/fail-lists/form')
            ->has('classes')
            ->has('sections')
            ->has('exams')
            ->has('years')
            ->where('isEdit', false)
        );
    }

    public function test_authenticated_users_can_store_fail_list_config()
    {
        $this->actingAs($this->user);

        $data = [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ];

        $response = $this->post(route('fail-lists.store'), $data);
        $response->assertRedirect(route('fail-lists.index'));

        $this->assertDatabaseHas('fail_lists', $data);
    }

    public function test_store_validation_prevents_duplicate_configs()
    {
        $this->actingAs($this->user);

        FailList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->post(route('fail-lists.store'), [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response->assertSessionHasErrors(['class_name']);
    }

    public function test_authenticated_users_can_view_edit_page()
    {
        $this->actingAs($this->user);

        $failList = FailList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('fail-lists.edit', $failList->id));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/fail-lists/form')
            ->has('failList')
            ->where('isEdit', true)
        );
    }

    public function test_authenticated_users_can_update_config()
    {
        $this->actingAs($this->user);

        $failList = FailList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->put(route('fail-lists.update', $failList->id), [
            'class_name' => 'Class 6',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);

        $response->assertRedirect(route('fail-lists.index'));
        $this->assertDatabaseHas('fail_lists', [
            'id' => $failList->id,
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);
    }

    public function test_authenticated_users_can_delete_config()
    {
        $this->actingAs($this->user);

        $failList = FailList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->delete(route('fail-lists.destroy', $failList->id));
        $response->assertRedirect(route('fail-lists.index'));

        $this->assertDatabaseMissing('fail_lists', [
            'id' => $failList->id,
        ]);
    }

    public function test_authenticated_users_can_view_printable_fail_list()
    {
        $this->actingAs($this->user);

        // 1. Create Academic Report for student1 (failed in Mathematics)
        $report1 = AcademicReport::create([
            'student_id' => $this->student1->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 95,
            'absent_days' => 5,
        ]);
        $report1->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 90,
            'written_marks' => 15, // total 15 < 33 (FAIL)
        ]);

        // 2. Create Academic Report for student2 (passed in all subjects)
        $report2 = AcademicReport::create([
            'student_id' => $this->student2->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'working_days' => 100,
            'present_days' => 98,
            'absent_days' => 2,
        ]);
        $report2->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 90,
            'written_marks' => 60, // total 60 >= 33 (PASS)
        ]);

        // 3. Create FailList configuration
        $failList = FailList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('fail-lists.show', $failList->id));
        $response->assertOk();

        // 4. Assert that only student1 is included in the failed students list
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/fail-lists/show')
            ->has('failList')
            ->has('failedStudents', 1) // Only 1 failed student
            ->where('failedStudents.0.student_id', 'STU-001')
            ->where('failedStudents.0.name', 'Failed Student')
            ->where('failedStudents.0.failed_subjects_count', 1)
            ->where('failedStudents.0.failed_subjects_list', 'Mathematics (15.0)')
        );
    }
}
