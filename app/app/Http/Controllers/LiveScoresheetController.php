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
        
        // Only coaches, referees, committee, and admins can access live scoresheet
        if (!in_array($user->role, ['coach', 'referee', 'committee', 'admin'])) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Unauthorized access.']);
        }
        
        // Get all games (except cancelled) for live scoring - let frontend handle filtering
        $games = Game::with(['teamA', 'teamB', 'league'])
            ->where('status', '!=', 'cancelled')
            ->orderBy('date', 'asc')
            ->get();
            
        // Get all leagues with their teams
        // Admin and committee can see all leagues, others only see active ones
        $leaguesQuery = \App\Models\League::with('teams');
        
        if (!in_array($user->role, ['admin', 'committee'])) {
            $leaguesQuery->where(function($query) {
                $query->where('status', 'active')
                      ->orWhere('is_active', true);
            });
        }
        
        $leagues = $leaguesQuery->orderBy('year', 'desc')->get();
            
        // Get all teams for matchup creation
        $allTeams = \App\Models\Team::with('leagues')
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
        if (!in_array($user->role, ['coach', 'referee', 'committee', 'admin'])) {
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
            'team_a_timeouts' => $game->team_a_timeouts ?: ($game->timeouts_per_quarter * ($game->total_quarters ?: 4)) ?: 6,
            'team_b_timeouts' => $game->team_b_timeouts ?: ($game->timeouts_per_quarter * ($game->total_quarters ?: 4)) ?: 6,
            'team_a_active_players' => $game->team_a_active_players,
            'team_b_active_players' => $game->team_b_active_players,
            'total_quarters' => $game->total_quarters ?: 4,
            'minutes_per_quarter' => $game->minutes_per_quarter ?: 12,
            'timeouts_per_quarter' => $game->timeouts_per_quarter ?: 2,
        ];
        
        // Get all leagues with their teams for edit matchup functionality
        // Admin and committee can see all leagues, others only see active ones
        $leaguesQuery = \App\Models\League::with('teams');
        
        if (!in_array($user->role, ['admin', 'committee'])) {
            $leaguesQuery->where(function($query) {
                $query->where('status', 'active')
                      ->orWhere('is_active', true);
            });
        }
        
        $leagues = $leaguesQuery->orderBy('year', 'desc')->get();
            
        // Get all teams for matchup editing
        $allTeams = \App\Models\Team::with('leagues')
            ->orderBy('name')
            ->get();

        return Inertia::render('LiveScoresheet', [
            'selectedGame' => $game,
            'gameState' => $gameState,
            'leagues' => $leagues,
            'allTeams' => $allTeams,
            'userRole' => $user->role,
        ]);
    }
    
    public function updateGameState(Request $request, Game $game)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['referee', 'committee', 'admin'])) {
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
            'team_a_active_players' => 'array|nullable',
            'team_b_active_players' => 'array|nullable',
            'team_a_active_players.*' => 'integer|exists:users,id',
            'team_b_active_players.*' => 'integer|exists:users,id',
        ]);
        
        $updateData = [
            'current_quarter' => isset($validated['quarter']) ? $validated['quarter'] : $game->current_quarter,
            'time_remaining' => isset($validated['time_remaining']) ? $validated['time_remaining'] : $game->time_remaining,
            'status' => $validated['is_running'] ? 'in_progress' : ($game->status === 'in_progress' ? 'scheduled' : $game->status),
            'team_a_score' => isset($validated['team_a_score']) ? $validated['team_a_score'] : $game->team_a_score,
            'team_b_score' => isset($validated['team_b_score']) ? $validated['team_b_score'] : $game->team_b_score,
            'team_a_fouls' => isset($validated['team_a_fouls']) ? $validated['team_a_fouls'] : $game->team_a_fouls,
            'team_b_fouls' => isset($validated['team_b_fouls']) ? $validated['team_b_fouls'] : $game->team_b_fouls,
            'team_a_timeouts' => isset($validated['team_a_timeouts']) ? $validated['team_a_timeouts'] : $game->team_a_timeouts,
            'team_b_timeouts' => isset($validated['team_b_timeouts']) ? $validated['team_b_timeouts'] : $game->team_b_timeouts,
        ];
        
        // Add active players if provided
        if (isset($validated['team_a_active_players'])) {
            $updateData['team_a_active_players'] = $validated['team_a_active_players'];
        }
        if (isset($validated['team_b_active_players'])) {
            $updateData['team_b_active_players'] = $validated['team_b_active_players'];
        }
        
        $game->update($updateData);
        
        return redirect()->back()->with('success', 'Game state updated successfully.');
    }
    
    public function recordPlayerStat(Request $request, Game $game)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['coach', 'referee', 'committee', 'admin'])) {
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
        
        if (!in_array($user->role, ['coach', 'referee', 'committee', 'admin'])) {
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
        
        if (!in_array($user->role, ['referee', 'committee', 'admin'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }
        
        $validated = $request->validate([
            'league_id' => 'required|exists:leagues,id',
            'team_a_id' => 'required|exists:teams,id',
            'team_b_id' => 'required|exists:teams,id|different:team_a_id',
            'date' => 'required|date',
            'venue' => 'nullable|string|max:255',
        ]);
        
        // Verify teams belong to the selected league
        $teamA = Team::with('leagues')->find($validated['team_a_id']);
        $teamB = Team::with('leagues')->find($validated['team_b_id']);
        
        if (!$teamA->leagues->contains($validated['league_id']) || !$teamB->leagues->contains($validated['league_id'])) {
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
            'team_a_timeouts' => 2,
            'team_b_timeouts' => 2,
            'total_quarters' => 4,
            'minutes_per_quarter' => 12,
            'timeouts_per_quarter' => 2,
        ]);
        
        return redirect()->route('scoresheet.index')->with('success', 'Matchup created successfully!');
    }

    public function updateMatchup(Request $request, Game $game)
    {
        $user = Auth::user();
        
        // Only admins, coaches, and committee can edit matchups
        if (!in_array($user->role, ['admin', 'coach', 'committee'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        $validated = $request->validate([
            'league_id' => 'nullable|exists:leagues,id',
            'team_a_id' => 'required|exists:teams,id',
            'team_b_id' => 'required|exists:teams,id|different:team_a_id',
            'date' => 'required|date',
            'venue' => 'nullable|string|max:255',
        ]);
        
        // Validate teams belong to selected league if league is specified
        if ($validated['league_id']) {
            $teamA = Team::with('leagues')->find($validated['team_a_id']);
            $teamB = Team::with('leagues')->find($validated['team_b_id']);
            
            if (!$teamA->leagues->contains($validated['league_id']) || !$teamB->leagues->contains($validated['league_id'])) {
                return redirect()->back()->withErrors(['error' => 'Both teams must belong to the selected league.']);
            }
        }
        
        $game->update([
            'league_id' => $validated['league_id'],
            'team_a_id' => $validated['team_a_id'],
            'team_b_id' => $validated['team_b_id'],
            'date' => $validated['date'],
            'venue' => $validated['venue'],
        ]);
        
        return redirect()->back()->with('success', 'Matchup updated successfully!');
    }

    public function savePlayerStats(Request $request, Game $game)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['coach', 'referee', 'committee', 'admin'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }
        
        try {
            $playerStats = $request->input('player_stats', []);
            
            foreach ($playerStats as $statData) {
                $playerId = $statData['player_id'];
                
                // Find the actual player record using user_id
                $player = \App\Models\Player::where('user_id', $playerId)->first();
                
                if (!$player) {
                    continue; // Skip if player not found
                }
                
                // Prepare the stat data (remove player_id from data array)
                $statsToSave = [
                    'points' => (int)(isset($statData['points']) ? $statData['points'] : 0),
                    'assists' => (int)(isset($statData['assists']) ? $statData['assists'] : 0),
                    'rebounds' => (int)(isset($statData['rebounds']) ? $statData['rebounds'] : 0),
                    'steals' => (int)(isset($statData['steals']) ? $statData['steals'] : 0),
                    'blocks' => (int)(isset($statData['blocks']) ? $statData['blocks'] : 0),
                    'fouls' => (int)(isset($statData['fouls']) ? $statData['fouls'] : 0),
                    'field_goals_made' => (int)(isset($statData['field_goals_made']) ? $statData['field_goals_made'] : 0),
                    'field_goals_attempted' => (int)(isset($statData['field_goals_attempted']) ? $statData['field_goals_attempted'] : 0),
                    'three_pointers_made' => (int)(isset($statData['three_pointers_made']) ? $statData['three_pointers_made'] : 0),
                    'three_pointers_attempted' => (int)(isset($statData['three_pointers_attempted']) ? $statData['three_pointers_attempted'] : 0),
                    'free_throws_made' => (int)(isset($statData['free_throws_made']) ? $statData['free_throws_made'] : 0),
                    'free_throws_attempted' => (int)(isset($statData['free_throws_attempted']) ? $statData['free_throws_attempted'] : 0),
                    'turnovers' => (int)(isset($statData['turnovers']) ? $statData['turnovers'] : 0),
                    'minutes_played' => (int)(isset($statData['minutes_played']) ? $statData['minutes_played'] : 0)
                ];
                
                // Use updateOrCreate to either update existing stats or create new ones
                $playerStat = PlayerStat::updateOrCreate(
                    [
                        'game_id' => $game->id,
                        'player_id' => $player->id  // Use the actual player ID, not user ID
                    ],
                    $statsToSave
                );
            }
            
            return redirect()->back()->with('success', 'Player stats saved successfully');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error saving player stats: ' . $e->getMessage()]);
        }
    }

    public function completeGame(Request $request, Game $game)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['referee', 'admin', 'committee'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }

        try {
            // Update game status to completed
            $game->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Game marked as completed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error completing game: ' . $e->getMessage()]);
        }
    }
}