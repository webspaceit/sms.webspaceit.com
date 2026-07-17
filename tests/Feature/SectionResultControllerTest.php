<?php

namespace Tests\Feature;

use App\Models\AcademicReport;
use App\Models\SectionResult;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SectionResultControllerTest extends TestCase
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
        $response = $this->get(route('section-results.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_section_results_index()
    {
        $this->actingAs($this->user);

        SectionResult::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('section-results.index'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/section-results/index')
            ->has('sectionResults', 1)
            ->where('sectionResults.0.class_name', 'Class 6')
            ->where('sectionResults.0.section', 'A')
        );
    }

    public function test_authenticated_users_can_search_section_results()
    {
        $this->actingAs($this->user);

        SectionResult::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        SectionResult::create([
            'class_name' => 'Class 7',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('section-results.index', ['search' => 'Class 7']));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/section-results/index')
            ->has('sectionResults', 1)
            ->where('sectionResults.0.class_name', 'Class 7')
        );
    }

    public function test_authenticated_users_can_view_create_page()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('section-results.create'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/section-results/form')
            ->has('classes')
            ->has('sections')
            ->has('exams')
            ->has('years')
            ->where('isEdit', false)
        );
    }

    public function test_authenticated_users_can_store_section_results_config()
    {
        $this->actingAs($this->user);

        $data = [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ];

        $response = $this->post(route('section-results.store'), $data);
        $response->assertRedirect(route('section-results.index'));

        $this->assertDatabaseHas('section_results', $data);
    }

    public function test_store_validation_prevents_duplicate_configs()
    {
        $this->actingAs($this->user);

        SectionResult::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->post(route('section-results.store'), [
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

        $sectionResult = SectionResult::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('section-results.edit', $sectionResult->id));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/section-results/form')
            ->has('sectionResult')
            ->where('isEdit', true)
        );
    }

    public function test_authenticated_users_can_update_config()
    {
        $this->actingAs($this->user);

        $sectionResult = SectionResult::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->put(route('section-results.update', $sectionResult->id), [
            'class_name' => 'Class 6',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);

        $response->assertRedirect(route('section-results.index'));
        $this->assertDatabaseHas('section_results', [
            'id' => $sectionResult->id,
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);
    }

    public function test_authenticated_users_can_delete_config()
    {
        $this->actingAs($this->user);

        $sectionResult = SectionResult::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->delete(route('section-results.destroy', $sectionResult->id));
        $response->assertRedirect(route('section-results.index'));

        $this->assertDatabaseMissing('section_results', [
            'id' => $sectionResult->id,
        ]);
    }

    public function test_authenticated_users_can_view_printable_section_results()
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
            'written_marks' => 80, // total 80 >= 33, GP 5.0 (PASS)
        ]);

        // 3. Create SectionResult configuration
        $sectionResult = SectionResult::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('section-results.show', $sectionResult->id));
        $response->assertOk();

        // 4. Assert calculated values for both students
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/section-results/show')
            ->has('sectionResult')
            ->has('students', 2)
            // Verify student1 (failed)
            ->where('students.0.student_id', 'STU-001')
            ->where('students.0.name', 'Failed Student')
            ->where('students.0.total_marks', '-')
            ->where('students.0.grade', 'F')
            ->where('students.0.gpa', '-')
            ->where('students.0.status', 'Failed')
            ->where('students.0.failed_subjects_count', 1)
            // Verify student2 (passed)
            ->where('students.1.student_id', 'STU-002')
            ->where('students.1.name', 'Passed Student')
            ->where('students.1.total_marks', 80)
            ->where('students.1.grade', 'A+')
            ->where('students.1.gpa', '5.00')
            ->where('students.1.status', 'Passed')
            ->where('students.1.failed_subjects_count', '-')
        );
    }
}
