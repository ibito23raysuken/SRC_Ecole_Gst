<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                $user = User::create([
            'first_name' => 'Admin',
            'last_name' => 'Root',
            'password' => bcrypt('12345678'),
        ]);
        $user->role = 'admin';
        $user->save();
    }
}
