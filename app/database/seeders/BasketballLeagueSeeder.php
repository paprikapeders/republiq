<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Team;
use App\Models\Player;
use App\Models\Game;
use App\Models\League;

class BasketballLeagueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $this->command->info('🏀 Setting up Basketball League Database...');
        
        // Clear existing data (except admin user)
        $this->command->info('Clearing existing data...');
        
        // Disable foreign key checks temporarily
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear in proper order
        \DB::table('player_stats')->truncate();
        Player::truncate();
        Game::truncate();
        Team::truncate();
        League::truncate();
        User::where('role', '!=', 'admin')->delete();
        
        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Create leagues first
        $this->command->info('Creating leagues...');
        League::create([
            'name' => 'QBRL Season 2',
            'description' => 'Queens Basketball Recreation League Season 2',
            'season' => '2025',
            'start_date' => '2025-09-12',
            'end_date' => '2025-12-31',
        ]);

        // Run seeders in order
        $this->command->info('Creating demo users...');
        $this->call(DemoUsersSeeder::class);
        
        $this->command->info('Creating teams, coaches, and players...');
        $this->call(NewTeamsAndPlayersSeeder::class);
        
        $this->command->info('Creating games...');
        $this->call(GameSeeder::class);
        
        $this->command->info('🎯 Basketball League setup complete!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('Leagues: ' . League::count());
        $this->command->info('Teams: ' . Team::count());
        $this->command->info('Players: ' . Player::count());
        $this->command->info('Coaches: ' . User::where('role', 'coach')->count());
        $this->command->info('Referees: ' . User::where('role', 'referee')->count());
        $this->command->info('Games: ' . Game::count());
        $this->command->info('');
        $this->command->info('🏆 League Information:');
        $this->command->info('QBRL Season 2: September 12, 2025 - December 31, 2025');
        $this->command->info('Total Teams in QBRL: ' . Team::count());
        $this->command->info('');
        $this->command->info('🔐 Login Credentials:');
        $this->command->info('All users have password: demo123');
        $this->command->info('Example logins:');
        $this->command->info('- Admin: admin@pbl.com');
        $this->command->info('- Coach: coach@pbl.com');
        $this->command->info('- Player: player@pbl.com');
        $this->command->info('- Referee: referee@pbl.com');
        $this->command->info('- Team Coaches: coach.stars@pbl.com, coach.bwood@pbl.com, etc.');
        $this->command->info('- Team Players: juan.perez@pbl.com, ryu.primero@pbl.com, etc.');
    }
}
