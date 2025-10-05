<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Models\PlayerStat;

class ClearGamesAndStatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeder will delete all data from games and player_stats tables.
     * Useful for clearing test data and resetting the game/stats state.
     */
    public function run()
    {
        // Ask for confirmation before proceeding
        if (!$this->command->confirm('This will delete ALL games and player stats data. Are you sure you want to continue?')) {
            $this->command->info('Operation cancelled by user.');
            return;
        }
        
        $this->command->info('Starting to clear games and player stats data...');
        
        // Get counts before deletion for reporting
        $gameCount = Game::count();
        $playerStatCount = PlayerStat::count();
        
        $this->command->info("Found {$gameCount} games and {$playerStatCount} player stats records");
        
        if ($gameCount === 0 && $playerStatCount === 0) {
            $this->command->info('No data to delete. Tables are already empty.');
            return;
        }
        
        // Disable foreign key checks temporarily to avoid constraint issues
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        try {
            // Delete all player stats first (child records)
            if ($playerStatCount > 0) {
                $this->command->info('Deleting all player stats...');
                PlayerStat::truncate();
                $this->command->info("✓ Deleted {$playerStatCount} player stats records");
            }
            
            // Delete all games (parent records)
            if ($gameCount > 0) {
                $this->command->info('Deleting all games...');
                Game::truncate();
                $this->command->info("✓ Deleted {$gameCount} games records");
            }
            
            $this->command->info('🎉 Successfully cleared all games and player stats data!');
            
        } catch (\Exception $e) {
            $this->command->error('❌ Error occurred while clearing data: ' . $e->getMessage());
            throw $e;
        } finally {
            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
        
        // Final verification
        $remainingGames = Game::count();
        $remainingStats = PlayerStat::count();
        
        if ($remainingGames === 0 && $remainingStats === 0) {
            $this->command->info('✅ Verification complete: All data successfully cleared!');
        } else {
            $this->command->warn("⚠️  Warning: {$remainingGames} games and {$remainingStats} player stats still remain");
        }
    }
}