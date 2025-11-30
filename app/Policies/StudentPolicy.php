<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StudentPolicy
{

public function modify(User $user, Student $student): Response
{
    if ($user->role=="admin") { // par exemple si tu as un champ is_admin
        return Response::allow();
    }

    return $user->id === $student->user_id
        ? Response::allow()
        : Response::deny('You do not own this student record.');
}

}
