<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Team;
use App\Models\Player;
use Illuminate\Support\Facades\Hash;

class TeamPlayerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Basketball team names and their colors
        $teamsData = [
            [
                'name' => 'Thunder Hawks',
                'players' => [
                    ['name' => 'Marcus Johnson', 'position' => 'Point Guard', 'number' => 1],
                    ['name' => 'DeShawn Williams', 'position' => 'Shooting Guard', 'number' => 2],
                    ['name' => 'Terrell Davis', 'position' => 'Small Forward', 'number' => 3],
                    ['name' => 'Jamal Thompson', 'position' => 'Power Forward', 'number' => 4],
                    ['name' => 'Brandon Carter', 'position' => 'Center', 'number' => 5],
                    ['name' => 'Tony Rodriguez', 'position' => 'Point Guard', 'number' => 10],
                    ['name' => 'Kevin Brown', 'position' => 'Forward', 'number' => 11],
                    ['name' => 'Chris Wilson', 'position' => 'Guard', 'number' => 12],
                ]
            ],
            [
                'name' => 'Fire Dragons',
                'players' => [
                    ['name' => 'Alex Chen', 'position' => 'Point Guard', 'number' => 7],
                    ['name' => 'Jordan Martinez', 'position' => 'Shooting Guard', 'number' => 8],
                    ['name' => 'Tyler Jackson', 'position' => 'Small Forward', 'number' => 9],
                    ['name' => 'Mike Anderson', 'position' => 'Power Forward', 'number' => 13],
                    ['name' => 'David Robinson', 'position' => 'Center', 'number' => 14],
                    ['name' => 'Carlos Gonzalez', 'position' => 'Guard', 'number' => 15],
                    ['name' => 'Ryan Mitchell', 'position' => 'Forward', 'number' => 16],
                    ['name' => 'Sean Taylor', 'position' => 'Center', 'number' => 17],
                ]
            ],
            [
                'name' => 'Storm Eagles',
                'players' => [
                    ['name' => 'Isaiah Washington', 'position' => 'Point Guard', 'number' => 6],
                    ['name' => 'Malik Jones', 'position' => 'Shooting Guard', 'number' => 18],
                    ['name' => 'Andre Smith', 'position' => 'Small Forward', 'number' => 19],
                    ['name' => 'Darius Lee', 'position' => 'Power Forward', 'number' => 20],
                    ['name' => 'Xavier Johnson', 'position' => 'Center', 'number' => 21],
                    ['name' => 'Mason Williams', 'position' => 'Guard', 'number' => 22],
                    ['name' => 'Caleb Davis', 'position' => 'Forward', 'number' => 23],
                    ['name' => 'Ethan Miller', 'position' => 'Guard', 'number' => 24],
                ]
            ],
            [
                'name' => 'Lightning Bolts',
                'players' => [
                    ['name' => 'Cameron White', 'position' => 'Point Guard', 'number' => 25],
                    ['name' => 'Noah Parker', 'position' => 'Shooting Guard', 'number' => 26],
                    ['name' => 'Logan Thompson', 'position' => 'Small Forward', 'number' => 27],
                    ['name' => 'Hunter Garcia', 'position' => 'Power Forward', 'number' => 28],
                    ['name' => 'Jayden Clark', 'position' => 'Center', 'number' => 29],
                    ['name' => 'Austin Lewis', 'position' => 'Guard', 'number' => 30],
                    ['name' => 'Blake Moore', 'position' => 'Forward', 'number' => 31],
                    ['name' => 'Connor Hall', 'position' => 'Center', 'number' => 32],
                ]
            ]
        ];

        // Clear existing data (handled by parent seeder)
        // Data clearing is handled by BasketballLeagueSeeder

        foreach ($teamsData as $teamData) {
            // Create coach for each team
            $coach = User::create([
                'name' => 'Coach ' . explode(' ', $teamData['name'])[0],
                'email' => strtolower(str_replace(' ', '', $teamData['name'])) . 'coach@example.com',
                'password' => Hash::make('password'),
                'role' => 'coach',
                'email_verified_at' => now(),
            ]);

            // Create team
            $team = Team::create([
                'name' => $teamData['name'],
                'coach_id' => $coach->id,
                'code' => strtoupper(substr(str_replace(' ', '', $teamData['name']), 0, 4)) . rand(10, 99),
                'league_id' => 1 // Default to first league
            ]);

            // Create players for the team
            foreach ($teamData['players'] as $playerData) {
                // Create user account for player
                $playerUser = User::create([
                    'name' => $playerData['name'],
                    'email' => strtolower(str_replace(' ', '.', $playerData['name'])) . '@example.com',
                    'password' => Hash::make('password'),
                    'role' => 'player',
                    'email_verified_at' => now(),
                ]);

                // Create player record
                Player::create([
                    'user_id' => $playerUser->id,
                    'team_id' => $team->id,
                    'position' => $playerData['position'],
                    'number' => $playerData['number'],
                    'status' => 'approved'
                ]);
            }

            $this->command->info("Created team: {$teamData['name']} with coach {$coach->name} and " . count($teamData['players']) . " players");
        }

        // Create additional coaches without teams (available coaches)
        $additionalCoaches = [
            'Coach Johnson',
            'Coach Martinez', 
            'Coach Thompson'
        ];

        foreach ($additionalCoaches as $coachName) {
            User::create([
                'name' => $coachName,
                'email' => strtolower(str_replace(' ', '.', $coachName)) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'coach',
                'email_verified_at' => now(),
            ]);
        }

        // Create additional referees
        $referees = [
            'Referee Smith',
            'Referee Brown',
            'Referee Wilson'
        ];

        foreach ($referees as $refereeName) {
            User::create([
                'name' => $refereeName,
                'email' => strtolower(str_replace(' ', '.', $refereeName)) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'referee',
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info('Created ' . count($teamsData) . ' teams with players and coaches');
        $this->command->info('Created ' . count($additionalCoaches) . ' additional coaches');
        $this->command->info('Created ' . count($referees) . ' referees');
        $this->command->info('All users have password: password');
    }
}
