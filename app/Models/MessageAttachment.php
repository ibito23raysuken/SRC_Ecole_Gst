<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    protected $fillable = ['message_id', 'file_name', 'file_path', 'mime_type', 'file_size'];

    protected $hidden = ['file_path'];

    public function message()
    {
        return $this->belongsTo(TeacherMessage::class, 'message_id');
    }
}
