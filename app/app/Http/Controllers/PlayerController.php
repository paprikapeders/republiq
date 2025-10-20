<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\PlayerStat;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PlayerController extends Controller
{
    /**
     * Show player statistics dashboard
     */
    public function stats()
    {
        $user = Auth::user();
        
        // Get player profile
        $playerProfile = Player::where('user_id', $user->id)
            ->with(['team'])
            ->first();
            
        if (!$playerProfile) {
            return redirect()->route('teams.index')
                ->with('error', 'You need to join a team first to view your stats.');
        }
        
        // Get team information
        $teamInfo = $playerProfile->team;
        
        // Get all player stats
        $playerStats = PlayerStat::where('player_id', $playerProfile->id)
            ->with(['game.teamA', 'game.teamB'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Calculate overall statistics
        $overallStats = [
            'total_points' => $playerStats->sum('points'),
            'total_rebounds' => $playerStats->sum('rebounds'),
            'total_assists' => $playerStats->sum('assists'),
            'total_steals' => $playerStats->sum('steals'),
            'total_blocks' => $playerStats->sum('blocks'),
            'total_field_goals' => $playerStats->sum('field_goals_made'),
            'total_field_goal_attempts' => $playerStats->sum('field_goals_attempted'),
            'total_three_pointers' => $playerStats->sum('three_pointers_made'),
            'total_three_point_attempts' => $playerStats->sum('three_pointers_attempted'),
            'total_free_throws' => $playerStats->sum('free_throws_made'),
            'total_free_throw_attempts' => $playerStats->sum('free_throws_attempted'),
            'total_turnovers' => $playerStats->sum('turnovers'),
            'total_fouls' => $playerStats->sum('fouls'),
        ];
        
        // Get MVP games (placeholder - no MVP column in current schema)
        $mvpGames = collect();
            
        // Get recent games (last 5)
        $recentGames = $playerStats->take(5)->map(function ($stat) {
            return [
                'game' => $stat->game,
                'stats' => $stat
            ];
        });
        
        return Inertia::render('Player/Stats', [
            'playerProfile' => $playerProfile,
            'teamInfo' => $teamInfo,
            'overallStats' => $overallStats,
            'gameStats' => $playerStats,
            'mvpGames' => $mvpGames,
            'recentGames' => $recentGames
        ]);
    }
    
    /**
     * Show individual game performance
     */
    public function gameStats($gameId)
    {
        $user = Auth::user();
        
        $playerProfile = Player::where('user_id', $user->id)->first();
        
        if (!$playerProfile) {
            return redirect()->route('teams.index')
                ->with('error', 'You need to join a team first to view game stats.');
        }
        
        $game = Game::with(['homeTeam', 'awayTeam'])->findOrFail($gameId);
        
        $playerStat = PlayerStat::where('player_id', $playerProfile->id)
            ->where('game_id', $gameId)
            ->first();
            
        if (!$playerStat) {
            return redirect()->route('player.stats')
                ->with('error', 'No stats found for this game.');
        }
        
        // Check if player was MVP
        $isMVP = $game->mvp_player_id === $playerProfile->id;
        
        return Inertia::render('Player/GameDetail', [
            'game' => $game,
            'playerStat' => $playerStat,
            'playerProfile' => $playerProfile,
            'isMVP' => $isMVP
        ]);
    }
}