<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamManagementController;
use App\Http\Controllers\LiveScoresheetController;
use App\Http\Controllers\SeasonManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

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
    
    // Live Scoresheet Routes
    Route::get('/scoresheet', [LiveScoresheetController::class, 'index'])->name('scoresheet.index');
    Route::post('/scoresheet/create-matchup', [LiveScoresheetController::class, 'createMatchup'])->name('scoresheet.create-matchup');
    Route::get('/scoresheet/{game}', [LiveScoresheetController::class, 'show'])->name('scoresheet.show');
    Route::post('/scoresheet/{game}/update-state', [LiveScoresheetController::class, 'updateGameState'])->name('scoresheet.update-state');
    Route::post('/scoresheet/{game}/field-goal', [LiveScoresheetController::class, 'recordFieldGoal'])->name('scoresheet.record-field-goal');
    Route::post('/scoresheet/{game}/stat', [LiveScoresheetController::class, 'recordPlayerStat'])->name('scoresheet.record-stat');
    
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
});

require __DIR__.'/auth.php';
