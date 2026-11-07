<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_with_first_name_and_password(): void
    {
        User::factory()->create([
            'first_name' => 'AdminTest',
            'role' => 'admin',
            'password' => Hash::make('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'first_name' => 'AdminTest',
            'password' => 'secret123',
        ]);

        $response->assertOk()->assertJsonPath('user.role', 'admin');
        $this->assertNotEmpty($response->json('token'));
    }

    public function test_teacher_can_login_without_an_email(): void
    {
        User::factory()->create([
            'first_name' => 'TeacherTest',
            'role' => 'teacher',
            'password' => Hash::make('secret123'),
        ]);

        $this->postJson('/api/login', [
            'first_name' => 'TeacherTest',
            'password' => 'secret123',
        ])->assertOk()->assertJsonPath('user.role', 'teacher');
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create([
            'first_name' => 'AdminTest',
            'role' => 'admin',
            'password' => Hash::make('secret123'),
        ]);

        $this->postJson('/api/login', [
            'first_name' => 'AdminTest',
            'password' => 'wrong-password',
        ])->assertUnauthorized();
    }

    public function test_teacher_cannot_access_admin_api(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);

        $this->actingAs($teacher, 'sanctum')
            ->getJson('/api/school-classes')
            ->assertForbidden();
    }

    public function test_public_registration_uses_snake_case_names_and_assigns_user_role(): void
    {
        $response = $this->postJson('/api/register', [
            'first_name' => 'New',
            'last_name' => 'User',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'role' => 'admin',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.first_name', 'New')
            ->assertJsonPath('user.last_name', 'User')
            ->assertJsonPath('user.role', 'user');

        $this->assertDatabaseHas('users', [
            'first_name' => 'New',
            'last_name' => 'User',
            'role' => 'user',
        ]);
    }

    public function test_logout_invalidates_the_current_token(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseMissing('personal_access_tokens', [
            'token' => hash('sha256', $token),
        ]);
    }
}
