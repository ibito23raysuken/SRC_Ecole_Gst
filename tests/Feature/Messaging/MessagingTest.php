<?php

namespace Tests\Feature\Messaging;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MessagingTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_and_teacher_can_exchange_messages_and_read_state_is_updated(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $teacher = User::factory()->create(['role' => 'teacher']);

        $created = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/messages', [
            'recipient_id' => $teacher->id,
            'subject' => 'Planning',
            'body' => 'Bonjour, voici le planning.',
        ]);

        $created->assertCreated()->assertJsonPath('sender_id', $admin->id);
        $conversationId = $created->json('conversation_id');

        $this->actingAs($teacher, 'sanctum')
            ->getJson('/api/teacher/messages')
            ->assertOk()
            ->assertJsonPath('0.unread_count', 1);

        $detail = $this->actingAs($teacher, 'sanctum')
            ->getJson("/api/teacher/messages/{$conversationId}")
            ->assertOk();
        $this->assertNotNull($detail->json('messages.0.read_at'));

        $this->actingAs($teacher, 'sanctum')->postJson("/api/teacher/messages/{$conversationId}/reply", [
            'body' => 'Bien reçu.',
        ])->assertCreated();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/messages/unread-count')
            ->assertOk()
            ->assertJsonPath('count', 1);
    }

    public function test_teacher_cannot_read_another_teachers_conversation(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $teacher = User::factory()->create(['role' => 'teacher']);
        $otherTeacher = User::factory()->create(['role' => 'teacher']);

        $conversationId = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/messages', ['recipient_id' => $teacher->id, 'body' => 'Privé.'])
            ->json('conversation_id');

        $this->actingAs($otherTeacher, 'sanctum')
            ->getJson("/api/teacher/messages/{$conversationId}")
            ->assertForbidden();
    }

    public function test_attachment_is_stored_and_requires_conversation_access(): void
    {
        Storage::fake('private');
        $admin = User::factory()->create(['role' => 'admin']);
        $teacher = User::factory()->create(['role' => 'teacher']);
        $otherTeacher = User::factory()->create(['role' => 'teacher']);

        $created = $this->actingAs($admin, 'sanctum')->post('/api/admin/messages', [
            'recipient_id' => $teacher->id,
            'body' => 'Document joint.',
            'attachment' => UploadedFile::fake()->create('planning.pdf', 100, 'application/pdf'),
        ]);

        $created->assertCreated();
        $messageId = $created->json('id');
        $attachmentId = $created->json('attachments.0.id');
        $this->assertNotNull($attachmentId);

        $this->actingAs($teacher, 'sanctum')
            ->get("/api/teacher/messages/{$messageId}/attachments/{$attachmentId}")
            ->assertOk();

        $this->actingAs($otherTeacher, 'sanctum')
            ->get("/api/teacher/messages/{$messageId}/attachments/{$attachmentId}")
            ->assertForbidden();
    }
}
