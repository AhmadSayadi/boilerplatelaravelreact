<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'superadmin@app.com'],
            [
                'name' => 'Super Admin',
                'username' => 'superadmin',
                'password' => Hash::make('password'),
            ]
        );

        $user->assignRole('super-admin');
    }
}
