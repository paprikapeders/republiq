<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Team;
use App\Models\User;
use App\Models\PlayerStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LiveScoresheetController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Only coaches, referees, and admins can access live scoresheet
        if (!in_array($user->role, ['coach', 'referee', 'admin'])) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Unauthorized access.']);
        }
        
        // Get available games for live scoring
        $games = Game::with(['teamA', 'teamB', 'league'])
            ->where('status', 'scheduled')
            ->orWhere('status', 'in_progress')
            ->orderBy('date', 'asc')
            ->get();
            
        // Get all leagues with their teams
        $leagues = \App\Models\League::with('teams')
            ->where('status', 'active')
            ->orWhere('is_active', true)
            ->orderBy('year', 'desc')
            ->get();
            
        // Get all teams for matchup creation
        $allTeams = \App\Models\Team::with('league')
            ->orderBy('name')
            ->get();
            
        return Inertia::render('LiveScoresheet', [
            'games' => $games,
            'leagues' => $leagues,
            'allTeams' => $allTeams,
            'userRole' => $user->role,
        ]);
    }
    
    public function show(Game $game)
    {
        $user = Auth::user();
        
        // Authorization check
        if (!in_array($user->role, ['coach', 'referee', 'admin'])) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Unauthorized access.']);
        }
        
        // Load game with teams and players
        $game->load([
            'teamA.players.user',
            'teamB.players.user',
            'playerStats.player.user'
        ]);
        
        // Get current game state
        $gameState = [
            'quarter' => $game->current_quarter ?: 1,
            'time_remaining' => $game->time_remaining ?: 12 * 60,
            'is_running' => $game->status === 'in_progress',
            'team_a_score' => $game->team_a_score ?: 0,
            'team_b_score' => $game->team_b_score ?: 0,
            'team_a_fouls' => $game->team_a_fouls ?: 0,
            'team_b_fouls' => $game->team_b_fouls ?: 0,
            'team_a_timeouts' => $game->team_a_timeouts ?: 6,
            'team_b_timeouts' => $game->team_b_timeouts ?: 6,
        ];
        
        return Inertia::render('LiveScoresheet', [
            'selectedGame' => $game,
            'gameState' => $gameState,
            'userRole' => $user->role,
        ]);
    }
    
    public function updateGameState(Request $request, Game $game)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['referee', 'admin'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }
        
        $validated = $request->validate([
            'quarter' => 'integer|min:1|max:4',
            'time_remaining' => 'integer|min:0',
            'is_running' => 'boolean',
            'team_a_score' => 'integer|min:0',
            'team_b_score' => 'integer|min:0',
            'team_a_fouls' => 'integer|min:0',
            'team_b_fouls' => 'integer|min:0',
            'team_a_timeouts' => 'integer|min:0|max:6',
            'team_b_timeouts' => 'integer|min:0|max:6',
        ]);
        
        $game->update([
            'current_quarter' => isset($validated['quarter']) ? $validated['quarter'] : $game->current_quarter,
            'time_remaining' => isset($validated['time_remaining']) ? $validated['time_remaining'] : $game->time_remaining,
            'status' => $validated['is_running'] ? 'in_progress' : ($game->status === 'in_progress' ? 'scheduled' : $game->status),
            'team_a_score' => isset($validated['team_a_score']) ? $validated['team_a_score'] : $game->team_a_score,
            'team_b_score' => isset($validated['team_b_score']) ? $validated['team_b_score'] : $game->team_b_score,
            'team_a_fouls' => isset($validated['team_a_fouls']) ? $validated['team_a_fouls'] : $game->team_a_fouls,
            'team_b_fouls' => isset($validated['team_b_fouls']) ? $validated['team_b_fouls'] : $game->team_b_fouls,
            'team_a_timeouts' => isset($validated['team_a_timeouts']) ? $validated['team_a_timeouts'] : $game->team_a_timeouts,
            'team_b_timeouts' => isset($validated['team_b_timeouts']) ? $validated['team_b_timeouts'] : $game->team_b_timeouts,
        ]);
        
        return redirect()->back()->with('success', 'Game state updated successfully.');
    }
    
    public function recordPlayerStat(Request $request, Game $game)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['coach', 'referee', 'admin'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }
        
        $validated = $request->validate([
            'player_id' => 'required|exists:users,id',
            'stat_type' => 'required|in:points,assists,rebounds,steals,blocks,fouls,turnovers,field_goals_made,field_goals_attempted,three_pointers_made,three_pointers_attempted,free_throws_made,free_throws_attempted',
            'value' => 'required|integer',
            'quarter' => 'required|integer|min:1|max:4',
        ]);
        
        // Find the player record using the user_id
        $player = \App\Models\Player::where('user_id', $validated['player_id'])->first();
        
        if (!$player) {
            return redirect()->back()->withErrors(['error' => 'Player not found.']);
        }
        
        // Find or create player stat record using the actual player_id
        $playerStat = PlayerStat::firstOrCreate([
            'game_id' => $game->id,
            'player_id' => $player->id,
        ], [
            'points' => 0,
            'assists' => 0,
            'rebounds' => 0,
            'steals' => 0,
            'blocks' => 0,
            'fouls' => 0,
            'turnovers' => 0,
            'field_goals_made' => 0,
            'field_goals_attempted' => 0,
            'three_pointers_made' => 0,
            'three_pointers_attempted' => 0,
            'free_throws_made' => 0,
            'free_throws_attempted' => 0,
            'minutes_played' => 0,
        ]);
        
        // Update the specific stat
        $currentValue = $playerStat->{$validated['stat_type']};
        $newValue = max(0, $currentValue + $validated['value']);
        $playerStat->update([$validated['stat_type'] => $newValue]);
        
        return redirect()->back()->with('success', 'Player stat recorded successfully.');
    }
    
    public function recordFieldGoal(Request $request, Game $game)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['coach', 'referee', 'admin'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }
        
        $validated = $request->validate([
            'player_id' => 'required|exists:users,id',
            'points' => 'required|in:1,2,3',
            'made' => 'required|boolean',
            'quarter' => 'required|integer|min:1|max:4',
        ]);
        
        // Find the player record using the user_id
        $player = \App\Models\Player::where('user_id', $validated['player_id'])->first();
        
        if (!$player) {
            return redirect()->back()->withErrors(['error' => 'Player not found.']);
        }
        
        $playerStat = PlayerStat::firstOrCreate([
            'game_id' => $game->id,
            'player_id' => $player->id,
        ], [
            'points' => 0,
            'assists' => 0,
            'rebounds' => 0,
            'steals' => 0,
            'blocks' => 0,
            'fouls' => 0,
            'turnovers' => 0,
            'field_goals_made' => 0,
            'field_goals_attempted' => 0,
            'three_pointers_made' => 0,
            'three_pointers_attempted' => 0,
            'free_throws_made' => 0,
            'free_throws_attempted' => 0,
            'minutes_played' => 0,
        ]);
        
        $points = $validated['points'];
        $made = $validated['made'];
        
        // Update stats based on shot type
        if ($points === 1) {
            // Free throw
            $playerStat->increment('free_throws_attempted');
            if ($made) {
                $playerStat->increment('free_throws_made');
                $playerStat->increment('points');
            }
        } elseif ($points === 2) {
            // 2-point field goal
            $playerStat->increment('field_goals_attempted');
            if ($made) {
                $playerStat->increment('field_goals_made');
                $playerStat->increment('points', 2);
            }
        } elseif ($points === 3) {
            // 3-point field goal
            $playerStat->increment('field_goals_attempted');
            $playerStat->increment('three_pointers_attempted');
            if ($made) {
                $playerStat->increment('field_goals_made');
                $playerStat->increment('three_pointers_made');
                $playerStat->increment('points', 3);
            }
        }
        
        // Update team scores if shot was made
        if ($made) {
            $player = User::find($validated['player_id']);
            $playerTeam = $player->players()->where('team_id', $game->team_a_id)->exists() ? 'a' : 'b';
            
            if ($playerTeam === 'a') {
                $game->increment('team_a_score', $points);
            } else {
                $game->increment('team_b_score', $points);
            }
        }
        
        return redirect()->back()->with('success', 'Field goal recorded successfully.');
    }
    
    public function createMatchup(Request $request)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['referee', 'admin'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }
        
        $validated = $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'team_a_id' => 'required|exists:teams,id',
            'team_b_id' => 'required|exists:teams,id|different:team_a_id',
            'date' => 'required|date|after:now',
            'venue' => 'nullable|string|max:255',
        ]);
        
        // Verify teams belong to the selected league
        $teamA = Team::find($validated['team_a_id']);
        $teamB = Team::find($validated['team_b_id']);
        
        if ($teamA->league_id != $validated['league_id'] || $teamB->league_id != $validated['league_id']) {
            return redirect()->back()->withErrors(['error' => 'Both teams must belong to the selected league.']);
        }
        
        $game = Game::create([
            'league_id' => $validated['league_id'],
            'team_a_id' => $validated['team_a_id'],
            'team_b_id' => $validated['team_b_id'],
            'date' => $validated['date'],
            'venue' => $validated['venue'],
            'status' => 'scheduled',
            'team_a_score' => 0,
            'team_b_score' => 0,
            'current_quarter' => 1,
            'time_remaining' => 12 * 60,
            'team_a_fouls' => 0,
            'team_b_fouls' => 0,
            'team_a_timeouts' => 6,
            'team_b_timeouts' => 6,
        ]);
        
        return redirect()->route('scoresheet.index')->with('success', 'Matchup created successfully!');
    }
}