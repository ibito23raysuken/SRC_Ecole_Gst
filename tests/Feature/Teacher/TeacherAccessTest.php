<?php

namespace Tests\Feature\Teacher;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\StudentNote;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherClassSubject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class TeacherAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_only_sees_assigned_classes_and_students(): void
    {
        [$user, $teacher, $class, $subject] = $this->teacherFixture();
        $otherClass = SchoolClass::create(['name' => 'CM1', 'capacity' => 30]);
        Student::create($this->studentData($class->id, 'CE1 Student'));
        Student::create($this->studentData($otherClass->id, 'CM1 Student'));

        TeacherClassSubject::create([
            'teacher_id' => $teacher->id,
            'school_class_id' => $class->id,
            'subject_id' => $subject->id,
        ]);

        $this->actingAs($user, 'sanctum')->getJson('/api/teacher/classes')->assertOk()->assertJsonCount(1);
        $this->actingAs($user, 'sanctum')->getJson('/api/teacher/students')->assertOk()->assertJsonPath('total', 1);
    }

    public function test_teacher_cannot_save_a_note_for_an_unassigned_class(): void
    {
        [$user, $teacher, $class, $subject] = $this->teacherFixture();
        $otherClass = SchoolClass::create(['name' => 'CM1', 'capacity' => 30]);
        $student = Student::create($this->studentData($otherClass->id, 'Other Student'));

        TeacherClassSubject::create([
            'teacher_id' => $teacher->id,
            'school_class_id' => $class->id,
            'subject_id' => $subject->id,
        ]);

        $this->actingAs($user, 'sanctum')->postJson('/api/teacher/notes', [
            'student_id' => $student->id,
            'class_id' => $otherClass->id,
            'subject_id' => $subject->id,
            'period' => 'T1',
            'score' => 15,
        ])->assertForbidden();

        $this->assertDatabaseCount('student_notes', 0);
    }

    private function teacherFixture(): array
    {
        $user = User::factory()->create(['role' => 'teacher', 'password' => Hash::make('secret123')]);
        $teacher = Teacher::create(['user_id' => $user->id, 'first_name' => 'Teacher', 'last_name' => 'Test']);
        $class = SchoolClass::create(['name' => 'CE1', 'capacity' => 30]);
        $subject = Subject::create(['name' => 'Mathématiques', 'coefficient' => 1, 'class_id' => $class->id]);

        return [$user, $teacher, $class, $subject];
    }

    private function studentData(int $classId, string $name): array
    {
        [$first_name, $last_name] = explode(' ', $name, 2);

        return [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'birth_date' => '2015-01-01',
            'gender' => 'male',
            'phone' => '00000000',
            'tuition_payment' => 'not_paid',
            'school_class_id' => $classId,
        ];
    }
}
