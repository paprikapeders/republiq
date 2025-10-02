<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Player;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TeamManagementController extends Controller
{
    /**
     * Display the team management page.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get teams based on user role
        $teams = collect();
        $teamMembers = collect();
        
        if ($user->role === 'coach') {
            // Get teams coached by this user
            $teams = Team::where('coach_id', $user->id)
                ->with(['players.user'])
                ->get();
                
            // Get all players from teams coached by this user
            $teamMembers = Player::whereIn('team_id', $teams->pluck('id'))
                ->with(['user', 'team'])
                ->get();
        } elseif ($user->role === 'player') {
            // Get teams where this user is a player
            $playerTeams = Player::where('user_id', $user->id)
                ->with(['team.coach', 'team.players.user'])
                ->get();
            $teams = $playerTeams->pluck('team');
        }
        
        return Inertia::render('TeamManagement', [
            'teams' => $teams,
            'teamMembers' => $teamMembers,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Create a new team (coaches only).
     */
    public function createTeam(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role !== 'coach') {
            return redirect()->back()->withErrors(['error' => 'Only coaches can create teams.']);
        }
        
        $request->validate([
            'name' => 'required|string|max:255|unique:teams,name',
        ]);
        
        // Generate unique team code
        do {
            $code = strtoupper(Str::random(6));
        } while (Team::where('code', $code)->exists());
        
        $team = Team::create([
            'name' => $request->name,
            'code' => $code,
            'coach_id' => $user->id,
        ]);
        
        return redirect()->back()->with('success', 'Team created successfully! Team code: ' . $code);
    }

    /**
     * Join a team using team code (players only).
     */
    public function joinTeam(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role !== 'player') {
            return redirect()->back()->withErrors(['error' => 'Only players can join teams.']);
        }
        
        $request->validate([
            'code' => 'required|string|size:6',
        ]);
        
        $team = Team::where('code', strtoupper($request->code))->first();
        
        if (!$team) {
            return redirect()->back()->withErrors(['error' => 'Invalid team code.']);
        }
        
        // Check if already a member
        $existingPlayer = Player::where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->first();
            
        if ($existingPlayer) {
            $statusMessage = $existingPlayer->status === 'pending' 
                ? 'You already have a pending request for this team.'
                : 'You are already a member of this team.';
            return redirect()->back()->withErrors(['error' => $statusMessage]);
        }
        
        Player::create([
            'team_id' => $team->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
        
        return redirect()->back()->with('success', 'Join request sent! Waiting for coach approval.');
    }

    /**
     * Approve or reject a player request (coaches only).
     */
    public function handlePlayerRequest(Request $request, Player $player)
    {
        $user = Auth::user();
        
        // Check if user is the coach of the team
        if ($user->role !== 'coach' || $player->team->coach_id !== $user->id) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);
        
        $action = $request->action;
        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        
        $player->update(['status' => $newStatus]);
        
        $message = $action === 'approve' 
            ? 'Player approved successfully!' 
            : 'Player request rejected.';
            
        return redirect()->back()->with('success', $message);
    }

    /**
     * Get team information by code (for validation).
     */
    public function getTeamByCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);
        
        $team = Team::where('code', strtoupper($request->code))
            ->with('coach:id,name')
            ->first();
            
        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }
        
        return response()->json([
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'code' => $team->code,
                'coach' => $team->coach->name,
            ]
        ]);
    }

    /**
     * Remove a player from team (coaches only).
     */
    public function removePlayer(Player $player)
    {
        $user = Auth::user();
        
        // Check if user is the coach of the team
        if ($user->role !== 'coach' || $player->team->coach_id !== $user->id) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        $playerName = $player->user->name;
        $player->delete();
        
        return redirect()->back()->with('success', $playerName . ' removed from team.');
    }
}