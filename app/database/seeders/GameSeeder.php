<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\Team;
use App\Models\League;
use Carbon\Carbon;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Get existing teams
        $teams = Team::all();
        
        if ($teams->count() < 2) {
            $this->command->info('Not enough teams to create games. Need at least 2 teams.');
            return;
        }

        // Create a default league if none exists
        $league = League::firstOrCreate([
            'name' => 'Sample Basketball League',
            'season' => 'Winter 2024'
        ], [
            'name' => 'Sample Basketball League',
            'season' => 'Winter 2024',
            'year' => 2024,
            'is_active' => true
        ]);

        // Create sample games with more realistic matchups
        $games = [
            [
                'team_a_id' => $teams[0]->id,
                'team_b_id' => $teams[1]->id,
                'date' => Carbon::now()->addDays(2),
                'status' => 'scheduled'
            ],
            [
                'team_a_id' => $teams->count() > 2 ? $teams[2]->id : $teams[0]->id,
                'team_b_id' => $teams->count() > 3 ? $teams[3]->id : $teams[1]->id,
                'date' => Carbon::now()->addHours(3),
                'status' => 'scheduled'
            ],
            [
                'team_a_id' => $teams[0]->id,
                'team_b_id' => $teams->count() > 2 ? $teams[2]->id : $teams[1]->id,
                'date' => Carbon::now()->addMinutes(30),
                'status' => 'scheduled'
            ],
            [
                'team_a_id' => $teams[1]->id,
                'team_b_id' => $teams->count() > 3 ? $teams[3]->id : $teams[0]->id,
                'date' => Carbon::now()->subMinutes(30),
                'status' => 'in_progress'
            ],
            [
                'team_a_id' => $teams->count() > 2 ? $teams[2]->id : $teams[0]->id,
                'team_b_id' => $teams[1]->id,
                'date' => Carbon::now()->subHours(2),
                'status' => 'completed'
            ]
        ];

        foreach ($games as $gameData) {
            Game::create([
                'league_id' => $league->id,
                'team_a_id' => $gameData['team_a_id'],
                'team_b_id' => $gameData['team_b_id'],
                'date' => $gameData['date'],
                'status' => $gameData['status'],
                'team_a_score' => 0,
                'team_b_score' => 0,
                'current_quarter' => 1,
                'time_remaining' => 12 * 60, // 12 minutes in seconds
                'team_a_fouls' => 0,
                'team_b_fouls' => 0,
                'team_a_timeouts' => 6,
                'team_b_timeouts' => 6
            ]);
        }

        $this->command->info('Created ' . count($games) . ' sample games for testing.');
    }
}
