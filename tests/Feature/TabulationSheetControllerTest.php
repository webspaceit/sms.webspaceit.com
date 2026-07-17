<?php

namespace Tests\Feature;

use App\Models\AcademicReport;
use App\Models\TabulationSheet;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TabulationSheetControllerTest extends TestCase
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
        $response = $this->get(route('tabulation-sheets.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_tabulation_sheets_index()
    {
        $this->actingAs($this->user);

        TabulationSheet::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('tabulation-sheets.index'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/tabulation-sheets/index')
            ->has('tabulationSheets', 1)
            ->where('tabulationSheets.0.class_name', 'Class 6')
            ->where('tabulationSheets.0.section', 'A')
        );
    }

    public function test_authenticated_users_can_search_tabulation_sheets()
    {
        $this->actingAs($this->user);

        TabulationSheet::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        TabulationSheet::create([
            'class_name' => 'Class 7',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('tabulation-sheets.index', ['search' => 'Class 7']));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/tabulation-sheets/index')
            ->has('tabulationSheets', 1)
            ->where('tabulationSheets.0.class_name', 'Class 7')
        );
    }

    public function test_authenticated_users_can_view_create_page()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('tabulation-sheets.create'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/tabulation-sheets/form')
            ->has('classes')
            ->has('sections')
            ->has('exams')
            ->has('years')
            ->where('isEdit', false)
        );
    }

    public function test_authenticated_users_can_store_tabulation_sheets_config()
    {
        $this->actingAs($this->user);

        $data = [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ];

        $response = $this->post(route('tabulation-sheets.store'), $data);
        $response->assertRedirect(route('tabulation-sheets.index'));

        $this->assertDatabaseHas('tabulation_sheets', $data);
    }

    public function test_store_validation_prevents_duplicate_configs()
    {
        $this->actingAs($this->user);

        TabulationSheet::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->post(route('tabulation-sheets.store'), [
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

        $sheet = TabulationSheet::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('tabulation-sheets.edit', $sheet->id));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/tabulation-sheets/form')
            ->has('tabulationSheet')
            ->where('isEdit', true)
        );
    }

    public function test_authenticated_users_can_update_config()
    {
        $this->actingAs($this->user);

        $sheet = TabulationSheet::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->put(route('tabulation-sheets.update', $sheet->id), [
            'class_name' => 'Class 6',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);

        $response->assertRedirect(route('tabulation-sheets.index'));
        $this->assertDatabaseHas('tabulation_sheets', [
            'id' => $sheet->id,
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
        ]);
    }

    public function test_authenticated_users_can_delete_config()
    {
        $this->actingAs($this->user);

        $sheet = TabulationSheet::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->delete(route('tabulation-sheets.destroy', $sheet->id));
        $response->assertRedirect(route('tabulation-sheets.index'));

        $this->assertDatabaseMissing('tabulation_sheets', [
            'id' => $sheet->id,
        ]);
    }

    public function test_authenticated_users_can_view_printable_tabulation_sheet()
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
            'grade_point' => 0.0,
            'letter_grade' => 'F',
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
            'grade_point' => 5.0,
            'letter_grade' => 'A+',
        ]);

        // 3. Create TabulationSheet configuration
        $sheet = TabulationSheet::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
        ]);

        $response = $this->get(route('tabulation-sheets.show', $sheet->id));
        $response->assertOk();

        // 4. Assert calculated values for both students in the tabulation sheet
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/tabulation-sheets/show')
            ->has('tabulationSheet')
            ->has('students', 2)
            ->has('subjects', 1)
            ->where('subjects.0', 'Mathematics')
            // Check student 1 (Failed, merit position '-')
            ->where('students.0.student_id', 'STU-001')
            ->where('students.0.status', 'Failed')
            ->where('students.0.merit', '-')
            // Check student 2 (Passed, merit position 1)
            ->where('students.1.student_id', 'STU-002')
            ->where('students.1.status', 'Passed')
            ->where('students.1.merit', 1)
            // Check summary statistics
            ->where('summary.total_students', 2)
            ->where('summary.exam_participants', 2)
            ->where('summary.total_pass', 1)
            ->where('summary.total_fail', 1)
            ->where('summary.pass_rate', 50)
        );
    }
}
