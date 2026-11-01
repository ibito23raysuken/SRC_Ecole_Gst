<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_conversations', function (Blueprint $table) {
            $table->id();
            $table->string('subject')->nullable();
            $table->timestamps();
        });

        Schema::create('teacher_conversation_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('teacher_conversations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['conversation_id', 'user_id'], 'conversation_user_unique');
        });

        Schema::create('teacher_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('teacher_conversations')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_messages');
        Schema::dropIfExists('teacher_conversation_participants');
        Schema::dropIfExists('teacher_conversations');
    }
};
