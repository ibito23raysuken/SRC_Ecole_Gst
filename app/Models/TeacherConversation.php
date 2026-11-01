<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherConversation extends Model
{
    protected $fillable = ['subject'];

    public function participants()
    {
        return $this->belongsToMany(User::class, 'teacher_conversation_participants', 'conversation_id', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(TeacherMessage::class, 'conversation_id')->oldest();
    }

    public function latestMessage()
    {
        return $this->hasOne(TeacherMessage::class, 'conversation_id')->latestOfMany();
    }
}
