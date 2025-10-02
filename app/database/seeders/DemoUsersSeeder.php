<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo users
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@pbl.com',
            'password' => bcrypt('demo123'),
            'role' => 'admin',
            'phone' => '+63 912 345 6789',
        ]);

        \App\Models\User::create([
            'name' => 'John Coach',
            'email' => 'coach@pbl.com',
            'password' => bcrypt('demo123'),
            'role' => 'coach',
            'phone' => '+63 912 345 6780',
        ]);

        \App\Models\User::create([
            'name' => 'LeBron Player',
            'email' => 'player@pbl.com',
            'password' => bcrypt('demo123'),
            'role' => 'player',
            'phone' => '+63 912 345 6781',
        ]);

        \App\Models\User::create([
            'name' => 'Mike Referee',
            'email' => 'referee@pbl.com',
            'password' => bcrypt('demo123'),
            'role' => 'referee',
            'phone' => '+63 912 345 6782',
        ]);
    }
}
