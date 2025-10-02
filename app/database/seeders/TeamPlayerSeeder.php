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
            ],
            [
                'name' => 'Steel Titans',
                'players' => [
                    ['name' => 'Zion Williams', 'position' => 'Point Guard', 'number' => 1],
                    ['name' => 'Kai Johnson', 'position' => 'Shooting Guard', 'number' => 2],
                    ['name' => 'Luka Martinez', 'position' => 'Small Forward', 'number' => 3],
                    ['name' => 'Giannis Rodriguez', 'position' => 'Power Forward', 'number' => 4],
                    ['name' => 'Joel Anderson', 'position' => 'Center', 'number' => 5],
                    ['name' => 'Ja Thompson', 'position' => 'Point Guard', 'number' => 11],
                    ['name' => 'Trae Young', 'position' => 'Guard', 'number' => 12],
                    ['name' => 'Jayson Brown', 'position' => 'Forward', 'number' => 13],
                    ['name' => 'Anthony Davis', 'position' => 'Forward', 'number' => 14],
                    ['name' => 'Nikola Wilson', 'position' => 'Center', 'number' => 15],
                ]
            ],
            [
                'name' => 'Phoenix Suns',
                'players' => [
                    ['name' => 'Devin Booker', 'position' => 'Shooting Guard', 'number' => 1],
                    ['name' => 'Chris Paul', 'position' => 'Point Guard', 'number' => 3],
                    ['name' => 'Kevin Durant', 'position' => 'Small Forward', 'number' => 35],
                    ['name' => 'Deandre Ayton', 'position' => 'Center', 'number' => 22],
                    ['name' => 'Mikal Bridges', 'position' => 'Forward', 'number' => 25],
                    ['name' => 'Cameron Johnson', 'position' => 'Forward', 'number' => 23],
                    ['name' => 'Landry Shamet', 'position' => 'Guard', 'number' => 14],
                    ['name' => 'Bismack Biyombo', 'position' => 'Center', 'number' => 18],
                    ['name' => 'Torrey Craig', 'position' => 'Forward', 'number' => 12],
                    ['name' => 'Ish Wainright', 'position' => 'Forward', 'number' => 15],
                ]
            ],
            [
                'name' => 'Golden Warriors',
                'players' => [
                    ['name' => 'Stephen Curry', 'position' => 'Point Guard', 'number' => 30],
                    ['name' => 'Klay Thompson', 'position' => 'Shooting Guard', 'number' => 11],
                    ['name' => 'Andrew Wiggins', 'position' => 'Small Forward', 'number' => 22],
                    ['name' => 'Draymond Green', 'position' => 'Power Forward', 'number' => 23],
                    ['name' => 'James Wiseman', 'position' => 'Center', 'number' => 33],
                    ['name' => 'Jordan Poole', 'position' => 'Guard', 'number' => 3],
                    ['name' => 'Gary Payton II', 'position' => 'Guard', 'number' => 0],
                    ['name' => 'Otto Porter Jr', 'position' => 'Forward', 'number' => 32],
                    ['name' => 'Kevon Looney', 'position' => 'Center', 'number' => 5],
                    ['name' => 'Moses Moody', 'position' => 'Guard', 'number' => 4],
                ]
            ],
            [
                'name' => 'Miami Heat',
                'players' => [
                    ['name' => 'Jimmy Butler', 'position' => 'Small Forward', 'number' => 22],
                    ['name' => 'Tyler Herro', 'position' => 'Shooting Guard', 'number' => 14],
                    ['name' => 'Bam Adebayo', 'position' => 'Center', 'number' => 13],
                    ['name' => 'Kyle Lowry', 'position' => 'Point Guard', 'number' => 7],
                    ['name' => 'Duncan Robinson', 'position' => 'Forward', 'number' => 55],
                    ['name' => 'PJ Tucker', 'position' => 'Forward', 'number' => 17],
                    ['name' => 'Max Strus', 'position' => 'Guard', 'number' => 31],
                    ['name' => 'Gabe Vincent', 'position' => 'Guard', 'number' => 2],
                    ['name' => 'Caleb Martin', 'position' => 'Forward', 'number' => 16],
                    ['name' => 'Dewayne Dedmon', 'position' => 'Center', 'number' => 21],
                ]
            ],
            [
                'name' => 'Boston Celtics',
                'players' => [
                    ['name' => 'Jayson Tatum', 'position' => 'Small Forward', 'number' => 0],
                    ['name' => 'Jaylen Brown', 'position' => 'Shooting Guard', 'number' => 7],
                    ['name' => 'Marcus Smart', 'position' => 'Point Guard', 'number' => 36],
                    ['name' => 'Robert Williams', 'position' => 'Center', 'number' => 44],
                    ['name' => 'Al Horford', 'position' => 'Power Forward', 'number' => 42],
                    ['name' => 'Malcolm Brogdon', 'position' => 'Guard', 'number' => 13],
                    ['name' => 'Derrick White', 'position' => 'Guard', 'number' => 9],
                    ['name' => 'Grant Williams', 'position' => 'Forward', 'number' => 12],
                    ['name' => 'Payton Pritchard', 'position' => 'Guard', 'number' => 11],
                    ['name' => 'Luke Kornet', 'position' => 'Center', 'number' => 40],
                ]
            ],
            [
                'name' => 'Brooklyn Nets',
                'players' => [
                    ['name' => 'Ben Simmons', 'position' => 'Small Forward', 'number' => 10],
                    ['name' => 'Cam Thomas', 'position' => 'Shooting Guard', 'number' => 24],
                    ['name' => 'Spencer Dinwiddie', 'position' => 'Point Guard', 'number' => 26],
                    ['name' => 'Nic Claxton', 'position' => 'Center', 'number' => 33],
                    ['name' => 'Dorian Finney-Smith', 'position' => 'Forward', 'number' => 28],
                    ['name' => 'Royce ONeale', 'position' => 'Forward', 'number' => 00],
                    ['name' => 'Joe Harris', 'position' => 'Guard', 'number' => 12],
                    ['name' => 'Seth Curry', 'position' => 'Guard', 'number' => 30],
                    ['name' => 'Day Ron Sharpe', 'position' => 'Center', 'number' => 20],
                    ['name' => 'Trendon Watford', 'position' => 'Forward', 'number' => 2],
                ]
            ],
            [
                'name' => 'Dallas Mavericks',
                'players' => [
                    ['name' => 'Luka Doncic', 'position' => 'Point Guard', 'number' => 77],
                    ['name' => 'Kyrie Irving', 'position' => 'Point Guard', 'number' => 2],
                    ['name' => 'Christian Wood', 'position' => 'Power Forward', 'number' => 35],
                    ['name' => 'Tim Hardaway Jr', 'position' => 'Shooting Guard', 'number' => 11],
                    ['name' => 'Dwight Powell', 'position' => 'Center', 'number' => 7],
                    ['name' => 'Josh Green', 'position' => 'Guard', 'number' => 8],
                    ['name' => 'Maxi Kleber', 'position' => 'Forward', 'number' => 42],
                    ['name' => 'Reggie Bullock', 'position' => 'Forward', 'number' => 25],
                    ['name' => 'JaVale McGee', 'position' => 'Center', 'number' => 00],
                    ['name' => 'Frank Ntilikina', 'position' => 'Guard', 'number' => 21],
                ]
            ]
        ];

        // Clear existing data (handled by parent seeder)
        // Data clearing is handled by BasketballLeagueSeeder

        foreach ($teamsData as $index => $teamData) {
            // Create coach for each team
            $coach = User::create([
                'name' => 'Coach ' . explode(' ', $teamData['name'])[0],
                'email' => strtolower(str_replace(' ', '', $teamData['name'])) . 'coach@example.com',
                'password' => Hash::make('password'),
                'role' => 'coach',
                'email_verified_at' => now(),
            ]);

            // Create team - distribute teams between leagues
            $leagueId = ($index < 6) ? 1 : 2; // First 6 teams in Premier League, rest in Development League
            $team = Team::create([
                'name' => $teamData['name'],
                'coach_id' => $coach->id,
                'code' => strtoupper(substr(str_replace(' ', '', $teamData['name']), 0, 4)) . rand(10, 99),
                'league_id' => $leagueId
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
