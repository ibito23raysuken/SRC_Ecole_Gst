<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'firstName' => 'admin',
            'lastName' => 'principal',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

    }
}
