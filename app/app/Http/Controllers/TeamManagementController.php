<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Player;
use App\Models\User;
use App\Models\League;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
        
        if ($user->role === 'admin') {
            // Get all teams for admin
            $teams = Team::with(['players.user', 'coach', 'leagues'])
                ->get();
                
            // Get all team members for admin
            $teamMembers = Player::with(['user', 'team'])
                ->get();
        } elseif ($user->role === 'coach') {
            // Get teams coached by this user
            $teams = Team::where('coach_id', $user->id)
                ->with(['players.user', 'leagues'])
                ->get();
                
            // Get all players from teams coached by this user
            $teamMembers = Player::whereIn('team_id', $teams->pluck('id'))
                ->with(['user', 'team'])
                ->get();
        } elseif ($user->role === 'player') {
            // Get teams where this user is a player
            $playerTeams = Player::where('user_id', $user->id)
                ->with(['team.coach', 'team.leagues', 'team.players.user'])
                ->get();
            $teams = $playerTeams->pluck('team');
        }
        
        // Get additional data for admin/coach
        $leagues = [];
        $allUsers = [];
        
        if ($user->role === 'admin' || $user->role === 'coach') {
            $leagues = League::all();
            if ($user->role === 'admin') {
                $allUsers = User::all();
            }
        }
        
        return Inertia::render('TeamManagement', [
            'teams' => $teams,
            'teamMembers' => $teamMembers,
            'userRole' => $user->role,
            'leagues' => $leagues,
            'allUsers' => $allUsers,
        ]);
    }

    /**
     * Create a new team (coaches only).
     */
    public function createTeam(Request $request)
    {
        $user = Auth::user();
        
        if (!in_array($user->role, ['coach', 'admin'])) {
            return redirect()->back()->withErrors(['error' => 'Only coaches and admins can create teams.']);
        }
        
        $validationRules = [
            'name' => 'required|string|max:255|unique:teams,name',
        ];
        
        // Additional validation for admin
        if ($user->role === 'admin') {
            $validationRules['league_id'] = 'nullable|exists:leagues,id';
            $validationRules['coach_id'] = 'nullable|exists:users,id';
        }
        
        $request->validate($validationRules);
        
        // Generate unique team code
        do {
            $code = strtoupper(Str::random(6));
        } while (Team::where('code', $code)->exists());
        
        $teamData = [
            'name' => $request->name,
            'code' => $code,
        ];
        
        // Set coach_id based on role
        if ($user->role === 'admin') {
            $teamData['coach_id'] = $request->filled('coach_id') ? $request->coach_id : null;
        } else {
            $teamData['coach_id'] = $user->id;
        }
        
        $team = Team::create($teamData);
        
        // If admin specified a league, add the team to that league
        if ($user->role === 'admin' && $request->filled('league_id')) {
            $team->leagues()->attach($request->league_id);
        }
        
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
        
        // Check if user is admin or the coach of the team
        if (!in_array($user->role, ['admin', 'coach'])) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        // If user is coach, they can only manage their own team
        if ($user->role === 'coach' && $player->team->coach_id !== $user->id) {
            return redirect()->back()->withErrors(['error' => 'You can only manage players from your own teams.']);
        }
        
        // Admin can manage any team
        
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

    /**
     * Add a player to a team (admin only).
     */
    public function addPlayerToTeam(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        // Validate input - support both existing user_id and new player creation
        $rules = [
            'team_id' => 'required|exists:teams,id',
            'jersey_number' => 'nullable|integer|min:0|max:99',
            'position' => 'nullable|string|max:255',
        ];
        
        // If user_id is provided, validate it exists
        if ($request->filled('user_id')) {
            $rules['user_id'] = 'required|exists:users,id';
        } else {
            // If creating new player, validate required fields
            $rules['name'] = 'required|string|max:255';
            $rules['email'] = 'required|email|unique:users,email';
            $rules['phone'] = 'nullable|string|max:20';
        }
        
        $request->validate($rules);
        
        // Determine user_id
        $userId = null;
        
        if ($request->filled('user_id')) {
            // Using existing user
            $userId = $request->user_id;
            $targetUser = User::find($userId);
            
            if ($targetUser->role !== 'player') {
                return redirect()->back()->withErrors(['error' => 'Only players can be added to teams.']);
            }
        } else {
            // Create new player user
            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => 'player',
                'password' => Hash::make('defaultpassword123'), // Default password
                'email_verified_at' => now(), // Auto-verify admin-created users
            ]);
            $userId = $newUser->id;
        }
        
        // Check if user is already a member of this team
        $existingPlayer = Player::where('team_id', $request->team_id)
            ->where('user_id', $userId)
            ->first();
            
        if ($existingPlayer) {
            return redirect()->back()->withErrors(['error' => 'User is already a member of this team.']);
        }
        
        Player::create([
            'team_id' => $request->team_id,
            'user_id' => $userId,
            'jersey_number' => $request->jersey_number,
            'position' => $request->position,
            'status' => 'approved', // Admin can directly approve
        ]);
        
        $successMessage = $request->filled('user_id') 
            ? 'Player added to team successfully!' 
            : 'New player created and added to team successfully! Default password: defaultpassword123';
        
        return redirect()->back()->with('success', $successMessage);
    }

    /**
     * Remove a player from team (admin only).
     */
    public function adminRemovePlayer(Player $player)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        $playerName = $player->user->name;
        $teamName = $player->team->name;
        $player->delete();
        
        return redirect()->back()->with('success', $playerName . ' removed from ' . $teamName . '.');
    }

    /**
     * Show the edit player form (admin only).
     */
    public function editPlayer(Player $player)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        $player->load(['user', 'team']);
        
        return Inertia::render('EditPlayer', [
            'player' => $player,
        ]);
    }

    /**
     * Update a player's details (admin only).
     */
    public function updatePlayer(Request $request, Player $player)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return redirect()->back()->withErrors(['error' => 'Unauthorized action.']);
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $player->user->id,
            'phone' => 'nullable|string|max:20',
            'jersey_number' => 'nullable|integer|min:0|max:99',
            'position' => 'nullable|string|max:255',
        ]);
        
        // Update user information
        $player->user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);
        
        // Update player-specific information
        $player->update([
            'jersey_number' => $request->filled('jersey_number') ? $request->jersey_number : null,
            'position' => $request->filled('position') ? $request->position : null,
        ]);
        
        return redirect()->route('teams.index')->with('success', 'Player details updated successfully!');
    }
}