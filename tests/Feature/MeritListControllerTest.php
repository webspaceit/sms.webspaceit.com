<?php

namespace Tests\Feature;

use App\Models\AcademicReport;
use App\Models\MeritList;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MeritListControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Student $student1;
    private Student $student2;
    private Student $student3;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        // Student 1 will fail (math < 33) -> excluded from merit list
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

        // Student 2 will pass (math 80) -> ranked 2nd
        $this->student2 = Student::create([
            'student_id' => 'STU-002',
            'name' => 'Passed Student B',
            'class_name' => 'Class 6',
            'section' => 'A',
            'roll_no' => 11,
            'date_of_birth' => '2014-02-02',
            'gender' => 'Female',
            'guardian_name' => 'Guardian 2',
            'guardian_phone' => '01711000002',
            'district' => 'Dhaka',
        ]);

        // Student 3 will pass with higher marks (math 95) -> ranked 1st
        $this->student3 = Student::create([
            'student_id' => 'STU-003',
            'name' => 'Passed Student A',
            'class_name' => 'Class 6',
            'section' => 'A',
            'roll_no' => 12,
            'date_of_birth' => '2014-03-03',
            'gender' => 'Male',
            'guardian_name' => 'Guardian 3',
            'guardian_phone' => '01711000003',
            'district' => 'Dhaka',
        ]);
    }

    public function test_guests_are_redirected_to_login()
    {
        $response = $this->get(route('merit-lists.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_merit_lists_index()
    {
        $this->actingAs($this->user);

        MeritList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('merit-lists.index'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/merit-lists/index')
            ->has('meritLists', 1)
            ->where('meritLists.0.class_name', 'Class 6')
            ->where('meritLists.0.section', 'A')
        );
    }

    public function test_authenticated_users_can_search_merit_lists()
    {
        $this->actingAs($this->user);

        MeritList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        MeritList::create([
            'class_name' => 'Class 7',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('merit-lists.index', ['search' => 'Class 7']));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/merit-lists/index')
            ->has('meritLists', 1)
            ->where('meritLists.0.class_name', 'Class 7')
        );
    }

    public function test_authenticated_users_can_view_create_page()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('merit-lists.create'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/merit-lists/form')
            ->has('classes')
            ->has('sections')
            ->has('exams')
            ->has('years')
            ->where('isEdit', false)
        );
    }

    public function test_authenticated_users_can_store_merit_lists_config()
    {
        $this->actingAs($this->user);

        $data = [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ];

        $response = $this->post(route('merit-lists.store'), $data);
        $response->assertRedirect(route('merit-lists.index'));

        $this->assertDatabaseHas('merit_lists', $data);
    }

    public function test_store_validation_prevents_duplicate_configs()
    {
        $this->actingAs($this->user);

        MeritList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->post(route('merit-lists.store'), [
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

        $list = MeritList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('merit-lists.edit', $list->id));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/merit-lists/form')
            ->has('meritList')
            ->where('isEdit', true)
        );
    }

    public function test_authenticated_users_can_update_config()
    {
        $this->actingAs($this->user);

        $list = MeritList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->put(route('merit-lists.update', $list->id), [
            'class_name' => 'Class 6',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);

        $response->assertRedirect(route('merit-lists.index'));
        $this->assertDatabaseHas('merit_lists', [
            'id' => $list->id,
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);
    }

    public function test_authenticated_users_can_delete_config()
    {
        $this->actingAs($this->user);

        $list = MeritList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->delete(route('merit-lists.destroy', $list->id));
        $response->assertRedirect(route('merit-lists.index'));

        $this->assertDatabaseMissing('merit_lists', [
            'id' => $list->id,
        ]);
    }

    public function test_authenticated_users_can_view_printable_merit_list()
    {
        $this->actingAs($this->user);

        // 1. Create Academic Report for student1 (failed in Mathematics)
        $report1 = AcademicReport::create([
            'student_id' => $this->student1->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);
        $report1->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 90,
            'written_marks' => 15, // total 15 < 33 (FAIL)
            'grade_point' => 0.0,
            'letter_grade' => 'F',
        ]);

        // 2. Create Academic Report for student2 (passed in all subjects, total 80)
        $report2 = AcademicReport::create([
            'student_id' => $this->student2->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);
        $report2->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 90,
            'written_marks' => 80, // total 80 >= 33, GP 5.0 (PASS)
            'grade_point' => 5.0,
            'letter_grade' => 'A+',
        ]);

        // 3. Create Academic Report for student3 (passed in all subjects, total 95)
        $report3 = AcademicReport::create([
            'student_id' => $this->student3->id,
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);
        $report3->marks()->create([
            'subject_name' => 'Mathematics',
            'full_marks' => 100,
            'highest_marks' => 95,
            'written_marks' => 95, // total 95 >= 33, GP 5.0 (PASS)
            'grade_point' => 5.0,
            'letter_grade' => 'A+',
        ]);

        // 4. Create MeritList configuration
        $list = MeritList::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('merit-lists.show', $list->id));
        $response->assertOk();

        // 5. Assert merit calculations
        // student1 (Failed) must be EXCLUDED from the merit list
        // student3 (95 marks) must be rank 1
        // student2 (80 marks) must be rank 2
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/merit-lists/show')
            ->has('meritList')
            ->has('students', 2) // only the 2 passed students
            // Rank 1: student3
            ->where('students.0.student_id', 'STU-003')
            ->where('students.0.name', 'Passed Student A')
            ->where('students.0.total_marks', 95)
            ->where('students.0.merit', 1)
            // Rank 2: student2
            ->where('students.1.student_id', 'STU-002')
            ->where('students.1.name', 'Passed Student B')
            ->where('students.1.total_marks', 80)
            ->where('students.1.merit', 2)
        );
    }
}
