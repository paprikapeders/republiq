<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Team;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SeasonManagementController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Only admins can manage seasons
        if ($user->role !== 'admin') {
            return redirect()->route('dashboard')->withErrors(['error' => 'You need administrator privileges to access season management.']);
        }
        
        $seasons = League::with(['teams', 'games'])
            ->orderBy('year', 'desc')
            ->get();
            
        // Get teams that are not in any league yet
        $availableTeams = Team::whereDoesntHave('leagues')->get();
        $allTeams = Team::all();
        $activeSeason = League::where('is_active', true)->first();
        $activeSeasonId = $activeSeason ? $activeSeason->id : null;
        
        return Inertia::render('SeasonManagement', [
            'seasons' => $seasons,
            'availableTeams' => $availableTeams,
            'allTeams' => $allTeams,
            'activeSeasonId' => $activeSeasonId,
            'userRole' => $user->role,
        ]);
    }
    
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer|min:2020|max:2050',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);
        
        // Deactivate other active seasons
        League::where('is_active', true)->update(['is_active' => false, 'status' => 'completed']);
        
        $season = League::create([
            'name' => $validated['name'],
            'season' => $validated['name'], // Use name as season for now
            'year' => $validated['year'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'description' => $validated['description'],
            'status' => 'upcoming',
            'is_active' => false,
        ]);
        
        return redirect()->back()->with('success', 'Season created successfully!');
    }
    
    public function updateStatus(Request $request, League $season)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'status' => 'required|in:upcoming,active,completed',
        ]);
        
        // If setting to active, deactivate other seasons
        if ($validated['status'] === 'active') {
            League::where('is_active', true)->update(['is_active' => false, 'status' => 'completed']);
            $season->update(['status' => 'active', 'is_active' => true]);
        } else {
            $season->update(['status' => $validated['status'], 'is_active' => false]);
        }
        
        return redirect()->back()->with('success', 'Season status updated successfully!');
    }

    public function activate(League $season)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Deactivate other seasons
        League::where('is_active', true)->update(['is_active' => false, 'status' => 'completed']);
        
        // Activate this season
        $season->update(['status' => 'active', 'is_active' => true]);
        
        return redirect()->back()->with('success', 'Season activated successfully!');
    }

    public function addTeam(Request $request, League $season)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
        ]);
        
        // Add team to this league using many-to-many relationship
        $team = Team::find($validated['team_id']);
        if (!$team->leagues()->where('league_id', $season->id)->exists()) {
            $team->leagues()->attach($season->id);
        }
        
        return redirect()->back()->with('success', 'Team added to season successfully!');
    }

    public function removeTeam(Request $request, League $season)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'team_id' => 'required|exists:teams,id',
        ]);
        
        // Remove team from this league using many-to-many relationship
        $team = Team::find($validated['team_id']);
        $team->leagues()->detach($season->id);
        
        return redirect()->back()->with('success', 'Team removed from season successfully!');
    }
    
    public function update(Request $request, League $season)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access.']);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer|min:2020|max:2050',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
            'status' => 'required|in:planning,active,completed,cancelled',
        ]);
        
        // If status is being set to active, deactivate other seasons
        if ($validated['status'] === 'active') {
            League::where('is_active', true)->update(['is_active' => false, 'status' => 'completed']);
            $validated['is_active'] = true;
        } else {
            $validated['is_active'] = false;
        }
        
        $season->update($validated);
        
        return redirect()->back()->with('success', 'Season updated successfully!');
    }
    
    public function show(League $season)
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return redirect()->route('dashboard')->withErrors(['error' => 'Admin access required.']);
        }
        
        $season->load([
            'teams.coach',
            'games.teamA',
            'games.teamB'
        ]);
        
        return Inertia::render('SeasonManagement', [
            'selectedSeason' => $season,
            'seasons' => League::orderBy('year', 'desc')->get(),
        ]);
    }
}