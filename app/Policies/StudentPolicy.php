<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StudentPolicy
{

    public function modify(User $user, Student $student): Response
    {
        return $user->id === $student->user_id?Response::allow() : Response::deny('You do not own this student record.' );
    }
}
