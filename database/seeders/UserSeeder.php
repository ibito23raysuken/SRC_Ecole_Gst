<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'first_name' => 'admin',
            'last_name' => 'principal',
            'password' => Hash::make('admin123'),
        ]);
        $user->role = 'admin';
        $user->save();

    }
}
