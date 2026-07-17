<?php

namespace Tests\Feature;

use App\Models\AdmitCard;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdmitCardControllerTest extends TestCase
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
            'roll_no' => 1,
            'date_of_birth' => '2014-01-01',
            'gender' => 'Male',
            'guardian_name' => 'Guardian',
            'guardian_phone' => '01711000000',
            'district' => 'Dhaka',
        ]);
    }

    public function test_guests_are_redirected_to_login()
    {
        $response = $this->get(route('admit-cards.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_admit_cards_index()
    {
        $this->actingAs($this->user);

        AdmitCard::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
            'instructions' => ['Follow exam policies.'],
            'routine' => ['Mathematics' => '01/07/2026 [Wed]'],
        ]);

        $response = $this->get(route('admit-cards.index'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/admit-cards/index')
            ->has('admitCards', 1)
            ->where('admitCards.0.class_name', 'Class 6')
            ->where('admitCards.0.section', 'A')
            ->where('admitCards.0.students_count', 1)
        );
    }

    public function test_authenticated_users_can_search_admit_cards()
    {
        $this->actingAs($this->user);

        AdmitCard::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
        ]);

        AdmitCard::create([
            'class_name' => 'Class 7',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2026',
            'start_time' => '10:00 AM',
        ]);

        $response = $this->get(route('admit-cards.index', ['search' => 'Class 7']));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/admit-cards/index')
            ->has('admitCards', 1)
            ->where('admitCards.0.class_name', 'Class 7')
        );
    }

    public function test_authenticated_users_can_view_create_page()
    {
        $this->actingAs($this->user);

        $response = $this->get(route('admit-cards.create'));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/admit-cards/form')
            ->has('classes')
            ->has('sections')
            ->has('exams')
            ->has('years')
            ->has('subjects')
            ->where('isEdit', false)
        );
    }

    public function test_authenticated_users_can_store_admit_card_config()
    {
        $this->actingAs($this->user);

        $data = [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
            'instructions' => ['Rule 1', 'Rule 2'],
            'routine' => ['Math' => '2026-07-10'],
        ];

        $response = $this->post(route('admit-cards.store'), $data);
        $response->assertRedirect(route('admit-cards.index'));

        $this->assertDatabaseHas('admit_cards', [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
        ]);
    }

    public function test_store_validation_prevents_duplicate_configs()
    {
        $this->actingAs($this->user);

        AdmitCard::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
        ]);

        $response = $this->post(route('admit-cards.store'), [
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
        ]);

        $response->assertSessionHasErrors(['class_name']);
    }

    public function test_authenticated_users_can_view_edit_page()
    {
        $this->actingAs($this->user);

        $card = AdmitCard::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
        ]);

        $response = $this->get(route('admit-cards.edit', $card->id));
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/admit-cards/form')
            ->has('admitCard')
            ->where('isEdit', true)
        );
    }

    public function test_authenticated_users_can_update_config()
    {
        $this->actingAs($this->user);

        $card = AdmitCard::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
        ]);

        $response = $this->put(route('admit-cards.update', $card->id), [
            'class_name' => 'Class 6',
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
            'start_time' => '10:00 AM',
            'instructions' => ['Rule A'],
            'routine' => ['Science' => '2027-06-10'],
        ]);

        $response->assertRedirect(route('admit-cards.index'));
        $this->assertDatabaseHas('admit_cards', [
            'id' => $card->id,
            'section' => 'B',
            'exam_name' => 'Final Exam',
            'academic_year' => '2027',
            'start_time' => '10:00 AM',
        ]);
    }

    public function test_authenticated_users_can_delete_config()
    {
        $this->actingAs($this->user);

        $card = AdmitCard::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
        ]);

        $response = $this->delete(route('admit-cards.destroy', $card->id));
        $response->assertRedirect(route('admit-cards.index'));

        $this->assertDatabaseMissing('admit_cards', [
            'id' => $card->id,
        ]);
    }

    public function test_authenticated_users_can_view_printable_admit_cards()
    {
        $this->actingAs($this->user);

        $card = AdmitCard::create([
            'class_name' => 'Class 6',
            'section' => 'A',
            'exam_name' => 'Half Yearly Exam',
            'academic_year' => '2026',
            'start_time' => '09:00 AM',
            'instructions' => ['No mobile phone allowed.'],
            'routine' => ['Math' => '2026-07-01'],
        ]);

        $response = $this->get(route('admit-cards.show', $card->id));
        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('school/admit-cards/show')
            ->has('admitCard')
            ->has('students', 1)
            ->where('students.0.student_id', 'STU-2026-999')
            ->where('students.0.name', 'John Doe')
        );
    }
}
