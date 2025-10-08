<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamManagementController;
use App\Http\Controllers\LiveScoresheetController;
use App\Http\Controllers\SeasonManagementController;
use App\Http\Controllers\TeamLeagueController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\PublicController::class, 'home'])->name('home');
Route::get('/games/{game}', [App\Http\Controllers\PublicController::class, 'gameDetail'])->name('public.game.detail');
Route::get('/teams/{team}', [App\Http\Controllers\PublicController::class, 'teamDetail'])->name('public.team.detail');

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    // Role-based redirect logic
    switch ($user->role) {
        case 'admin':
            return Inertia::render('Dashboard', [
                'redirectMessage' => 'Welcome Admin! You have full access to all features.',
                'availableFeatures' => ['Team Management', 'User Management', 'League Settings', 'Statistics']
            ]);
        case 'coach':
            return Inertia::render('Dashboard', [
                'redirectMessage' => 'Welcome Coach! Manage your teams and players.',
                'availableFeatures' => ['Team Management', 'Player Stats', 'Game Management']
            ]);
        case 'referee':
            return Inertia::render('Dashboard', [
                'redirectMessage' => 'Welcome Referee! Enter game stats and manage matches.',
                'availableFeatures' => ['Game Statistics', 'Match Management']
            ]);
        case 'player':
            return Inertia::render('Dashboard', [
                'redirectMessage' => 'Welcome Player! View your stats and team information.',
                'availableFeatures' => ['Team Membership', 'Personal Stats', 'Game Schedule']
            ]);
        default:
            return Inertia::render('Dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Team Management Routes
    Route::get('/teams', [TeamManagementController::class, 'index'])->name('teams.index');
    Route::post('/teams/create', [TeamManagementController::class, 'createTeam'])->name('teams.create');
    Route::post('/teams/join', [TeamManagementController::class, 'joinTeam'])->name('teams.join');
    Route::post('/teams/player/{player}/handle', [TeamManagementController::class, 'handlePlayerRequest'])->name('teams.handle-player-request');
    Route::delete('/teams/player/{player}', [TeamManagementController::class, 'removePlayer'])->name('teams.remove-player');
    Route::get('/teams/code/{code}', [TeamManagementController::class, 'getTeamByCode'])->name('teams.by-code');
    
    // Admin-only Team Management Routes
    Route::middleware('admin')->group(function () {
        Route::post('/admin/teams/add-player', [TeamManagementController::class, 'addPlayerToTeam'])->name('admin.teams.add-player');
        Route::delete('/admin/teams/remove-player/{player}', [TeamManagementController::class, 'adminRemovePlayer'])->name('admin.teams.remove-player');
        Route::get('/admin/teams/edit-player/{player}', [TeamManagementController::class, 'editPlayer'])->name('admin.teams.edit-player');
        Route::put('/admin/teams/update-player/{player}', [TeamManagementController::class, 'updatePlayer'])->name('admin.teams.update-player');
    });
    
    // Live Scoresheet Routes
    Route::get('/scoresheet', [LiveScoresheetController::class, 'index'])->name('scoresheet.index');
    Route::post('/scoresheet/create-matchup', [LiveScoresheetController::class, 'createMatchup'])->name('scoresheet.create-matchup');
    Route::get('/scoresheet/{game}', [LiveScoresheetController::class, 'show'])->name('scoresheet.show');
    Route::put('/scoresheet/{game}/update-matchup', [LiveScoresheetController::class, 'updateMatchup'])->name('scoresheet.update-matchup');
    Route::post('/scoresheet/{game}/update-state', [LiveScoresheetController::class, 'updateGameState'])->name('scoresheet.update-state');
    Route::post('/scoresheet/{game}/field-goal', [LiveScoresheetController::class, 'recordFieldGoal'])->name('scoresheet.record-field-goal');
    Route::post('/scoresheet/{game}/stat', [LiveScoresheetController::class, 'recordPlayerStat'])->name('scoresheet.record-stat');
    Route::post('/scoresheet/{game}/save-player-stats', [LiveScoresheetController::class, 'savePlayerStats'])->name('scoresheet.save-player-stats');
    Route::post('/scoresheet/{game}/complete', [LiveScoresheetController::class, 'completeGame'])->name('scoresheet.complete-game');
    Route::post('/games/{game}/reset-stats', [LiveScoresheetController::class, 'resetGameStats'])->name('games.reset-stats');
    
    // Team-League Management Routes (Admin Only)
    Route::get('/team-leagues', [TeamLeagueController::class, 'index'])->name('team-leagues.index');
    Route::post('/team-leagues/add', [TeamLeagueController::class, 'addTeamToLeague'])->name('team-leagues.add');
    Route::post('/team-leagues/remove', [TeamLeagueController::class, 'removeTeamFromLeague'])->name('team-leagues.remove');
    
    // Season Management Routes (Admin Only)
    Route::get('/season-management', [SeasonManagementController::class, 'index'])->name('season-management.index');
    Route::post('/season-management', [SeasonManagementController::class, 'store'])->name('season-management.store');
    Route::get('/season-management/{season}', [SeasonManagementController::class, 'show'])->name('season-management.show');
    Route::put('/season-management/{season}', [SeasonManagementController::class, 'update'])->name('season-management.update');
    Route::delete('/season-management/{season}', [SeasonManagementController::class, 'destroy'])->name('season-management.destroy');
    Route::post('/season-management/{season}/activate', [SeasonManagementController::class, 'activate'])->name('season-management.activate');
    Route::post('/season-management/{season}/update-status', [SeasonManagementController::class, 'updateStatus'])->name('season-management.update-status');
    Route::post('/season-management/{season}/add-team', [SeasonManagementController::class, 'addTeam'])->name('season-management.add-team');
    Route::post('/season-management/{season}/remove-team', [SeasonManagementController::class, 'removeTeam'])->name('season-management.remove-team');
    Route::post('/season-management/{season}/update-mvp-settings', [SeasonManagementController::class, 'updateMvpSettings'])->name('season-management.update-mvp-settings');
});

require __DIR__.'/auth.php';
