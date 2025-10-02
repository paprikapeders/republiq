<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\Player;
use App\Models\PlayerStat;

class PlayerStatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Find an in-progress game
        $game = Game::with(['teamA', 'teamB'])->where('status', 'in_progress')->first();
        
        if (!$game) {
            $this->command->info('No in-progress games found. Creating sample stats for first game.');
            $game = Game::with(['teamA', 'teamB'])->first();
        }
        
        if (!$game) {
            $this->command->info('No games found. Please run GameSeeder first.');
            return;
        }

        // Get players from both teams
        $teamAPlayers = Player::where('team_id', $game->team_a_id)->take(5)->get();
        $teamBPlayers = Player::where('team_id', $game->team_b_id)->take(5)->get();

        // Create sample stats for Team A players
        foreach ($teamAPlayers as $index => $player) {
            PlayerStat::create([
                'game_id' => $game->id,
                'player_id' => $player->id, // Use player ID, not user ID
                'points' => rand(0, 15),
                'assists' => rand(0, 5),
                'rebounds' => rand(0, 8),
                'steals' => rand(0, 3),
                'blocks' => rand(0, 2)
            ]);
        }

        // Create sample stats for Team B players
        foreach ($teamBPlayers as $index => $player) {
            PlayerStat::create([
                'game_id' => $game->id,
                'player_id' => $player->id, // Use player ID, not user ID
                'points' => rand(0, 15),
                'assists' => rand(0, 5),
                'rebounds' => rand(0, 8),
                'steals' => rand(0, 3),
                'blocks' => rand(0, 2)
            ]);
        }

        // Update game scores based on player stats
        $teamAScore = PlayerStat::where('game_id', $game->id)
            ->whereIn('player_id', $teamAPlayers->pluck('id'))
            ->sum('points');
        
        $teamBScore = PlayerStat::where('game_id', $game->id)
            ->whereIn('player_id', $teamBPlayers->pluck('id'))
            ->sum('points');

        $game->update([
            'team_a_score' => $teamAScore,
            'team_b_score' => $teamBScore,
            'current_quarter' => 2,
            'time_remaining' => 8 * 60, // 8 minutes remaining in 2nd quarter
            'team_a_fouls' => 3,
            'team_b_fouls' => 2,
            'team_a_timeouts' => 4,
            'team_b_timeouts' => 5
        ]);

        $this->command->info("Created player stats for game ID: {$game->id}");
        $this->command->info("Game score: {$teamAScore} - {$teamBScore}");
        $this->command->info("Total player stats created: " . ($teamAPlayers->count() + $teamBPlayers->count()));
    }
}
