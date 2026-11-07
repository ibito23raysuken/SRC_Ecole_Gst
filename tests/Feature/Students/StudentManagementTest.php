<?php

namespace Tests\Feature\Students;

use App\Models\Guardian;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StudentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_a_student_name(): void
    {
        [$user, $student] = $this->studentFixture();

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/students/{$student->id}", ['first_name' => 'Nadia'])
            ->assertOk()
            ->assertJsonPath('data.first_name', 'Nadia');

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'first_name' => 'Nadia',
        ]);
    }

    public function test_admin_can_add_a_parent_to_a_student(): void
    {
        [$user, $student] = $this->studentFixture();

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/students/{$student->id}", [
                'parents' => [$this->parentData('Added Parent')],
            ])
            ->assertOk()
            ->assertJsonPath('data.guardians.0.name', 'Added Parent');

        $this->assertDatabaseHas('guardians', [
            'student_id' => $student->id,
            'name' => 'Added Parent',
        ]);
    }

    public function test_admin_can_modify_a_parent_of_a_student(): void
    {
        [$user, $student] = $this->studentFixture();
        $parent = Guardian::create([
            'student_id' => $student->id,
            ...$this->parentData('Original Parent'),
        ]);

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/students/{$student->id}", [
                'parents' => [[
                    'id' => $parent->id,
                    ...$this->parentData('Updated Parent'),
                ]],
            ])
            ->assertOk()
            ->assertJsonPath('data.guardians.0.name', 'Updated Parent');

        $this->assertDatabaseMissing('guardians', ['id' => $parent->id]);
        $this->assertDatabaseHas('guardians', [
            'student_id' => $student->id,
            'name' => 'Updated Parent',
        ]);
    }

    public function test_admin_can_remove_all_parents_from_a_student(): void
    {
        [$user, $student] = $this->studentFixture();
        Guardian::create([
            'student_id' => $student->id,
            ...$this->parentData('Parent to remove'),
        ]);

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/students/{$student->id}", ['parents' => []])
            ->assertOk()
            ->assertJsonCount(0, 'data.guardians');

        $this->assertDatabaseMissing('guardians', ['student_id' => $student->id]);
    }

    public function test_admin_can_upload_a_student_image_to_public_storage(): void
    {
        Storage::fake('public');
        [$user, $student] = $this->studentFixture();

        $this->actingAs($user, 'sanctum')
            ->post("/api/students/{$student->id}", [
                '_method' => 'PUT',
                'student_image' => UploadedFile::fake()->image('student.jpg'),
            ])
            ->assertOk();

        $path = $student->fresh()->student_image;

        $this->assertStringStartsWith('student_images/', $path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_non_admin_cannot_update_a_student(): void
    {
        [, $student] = $this->studentFixture();
        $teacher = User::factory()->create(['role' => 'teacher']);

        $this->actingAs($teacher, 'sanctum')
            ->putJson("/api/students/{$student->id}", ['first_name' => 'Unauthorized'])
            ->assertForbidden();

        $this->assertDatabaseMissing('students', [
            'id' => $student->id,
            'first_name' => 'Unauthorized',
        ]);
    }

    public function test_validation_error_does_not_echo_submitted_data(): void
    {
        [$user, $student] = $this->studentFixture();
        $submittedMarker = 'PRIVATE-PAYLOAD-MARKER';

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/students/{$student->id}", [
                'parents' => [[
                    'name' => $submittedMarker,
                    'phone' => '123456789',
                    'relationship' => 'invalid',
                ]],
            ])
            ->assertUnprocessable()
            ->assertDontSee($submittedMarker);
    }

    private function studentFixture(): array
    {
        $user = User::factory()->create(['role' => 'admin']);
        $schoolClass = SchoolClass::create(['name' => 'CE1', 'capacity' => 30]);
        $student = Student::create([
            'first_name' => 'Initial',
            'last_name' => 'Student',
            'birth_date' => '2015-01-01',
            'gender' => 'female',
            'phone' => '00000000',
            'tuition_payment' => 'not_paid',
            'school_class_id' => $schoolClass->id,
        ]);

        return [$user, $student];
    }

    private function parentData(string $name): array
    {
        return [
            'name' => $name,
            'phone' => '123456789',
            'relationship' => 'mother',
        ];
    }
}
