<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamLeagueController extends Controller
{
    /**
     * Add a team to a league
     */
    public function addTeamToLeague(Request $request)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['admin', 'committee'])) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }
        
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'league_id' => 'required|exists:leagues,id',
        ]);
        
        $team = Team::find($validated['team_id']);
        $league = League::find($validated['league_id']);
        
        // Check if team is already in the league
        if ($team->leagues()->where('league_id', $validated['league_id'])->exists()) {
            return response()->json(['error' => 'Team is already in this league.'], 400);
        }
        
        // Add team to league
        $team->leagues()->attach($validated['league_id']);
        
        return response()->json([
            'success' => true,
            'message' => "Team '{$team->name}' added to league '{$league->name}' successfully."
        ]);
    }
    
    /**
     * Remove a team from a league
     */
    public function removeTeamFromLeague(Request $request)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['admin', 'committee'])) {
            return response()->json(['error' => 'Unauthorized access.'], 403);
        }
        
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
            'league_id' => 'required|exists:leagues,id',
        ]);
        
        $team = Team::find($validated['team_id']);
        $league = League::find($validated['league_id']);
        
        // Check if team is in the league
        if (!$team->leagues()->where('league_id', $validated['league_id'])->exists()) {
            return response()->json(['error' => 'Team is not in this league.'], 400);
        }
        
        // Remove team from league
        $team->leagues()->detach($validated['league_id']);
        
        return response()->json([
            'success' => true,
            'message' => "Team '{$team->name}' removed from league '{$league->name}' successfully."
        ]);
    }
    
    /**
     * Get all teams with their leagues for management
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['admin', 'committee'])) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Unauthorized access.']);
        }
        
        $teams = Team::with(['leagues', 'coach'])->orderBy('name')->get();
        // Admin and committee can see all leagues
        $leagues = League::orderBy('name')->get();
        
        return view('admin.team-leagues', compact('teams', 'leagues'));
    }
}
