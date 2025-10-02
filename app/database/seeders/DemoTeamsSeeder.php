<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoTeamsSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run()
    {
        // Get coach users
        $coaches = User::where('role', 'coach')->get();
        
        if ($coaches->count() === 0) {
            $this->command->warn('No coaches found. Please run DemoUsersSeeder first.');
            return;
        }
        
        $teams = [
            [
                'name' => 'Manila Warriors',
                'code' => 'MNL001',
                'coach_id' => $coaches->first()->id
            ],
            [
                'name' => 'Cebu Dragons',
                'code' => 'CEB002',
                'coach_id' => $coaches->count() > 1 ? $coaches->get(1)->id : $coaches->first()->id
            ],
            [
                'name' => 'Davao Eagles',
                'code' => 'DAV003',
                'coach_id' => $coaches->count() > 2 ? $coaches->get(2)->id : $coaches->first()->id
            ]
        ];
        
        foreach ($teams as $teamData) {
            Team::updateOrCreate(
                ['code' => $teamData['code']],
                $teamData
            );
        }
        
        $this->command->info('Demo teams created successfully!');
        $this->command->info('Team codes: MNL001, CEB002, DAV003');
    }
}
