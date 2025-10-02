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
        
        // Run seeders in order
        $this->command->info('Creating teams, coaches, and players...');
        $this->call(TeamPlayerSeeder::class);
        
        $this->command->info('Creating games...');
        $this->call(GameSeeder::class);
        
        $this->command->info('🎯 Basketball League setup complete!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('Teams: ' . Team::count());
        $this->command->info('Players: ' . Player::count());
        $this->command->info('Coaches: ' . User::where('role', 'coach')->count());
        $this->command->info('Referees: ' . User::where('role', 'referee')->count());
        $this->command->info('Games: ' . Game::count());
        $this->command->info('');
        $this->command->info('🔐 Login Credentials:');
        $this->command->info('All users have password: password');
        $this->command->info('Example logins:');
        $this->command->info('- Coach: thunderhawkscoach@example.com');
        $this->command->info('- Player: marcus.johnson@example.com');
        $this->command->info('- Referee: referee.smith@example.com');
    }
}
