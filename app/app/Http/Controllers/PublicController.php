<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Team;
use App\Models\League;
use App\Models\Player;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        // Get active season/league
        $activeLeague = League::where('status', 'active')
            ->orWhere('is_active', true)
            ->first();

        // Get upcoming and recent games
        $games = Game::with(['teamA', 'teamB', 'league'])
            ->when($activeLeague, function ($query) use ($activeLeague) {
                return $query->where('league_id', $activeLeague->id);
            })
            ->orderBy('date', 'desc')
            ->take(20)
            ->get();

        // Get teams for the active season with player statistics averages
        $teams = Team::with(['leagues', 'coach', 'players.user', 'players.playerStats' => function ($query) use ($activeLeague) {
                if ($activeLeague) {
                    $query->whereHas('game', function ($q) use ($activeLeague) {
                        $q->where('league_id', $activeLeague->id);
                    });
                }
            }])
            ->when($activeLeague, function ($query) use ($activeLeague) {
                return $query->whereHas('leagues', function ($q) use ($activeLeague) {
                    $q->where('leagues.id', $activeLeague->id);
                });
            })
            ->orderBy('name')
            ->get();

        // Calculate player averages for each team
        $teams->each(function ($team) {
            $team->players->each(function ($player) {
                $stats = $player->playerStats;
                $gameCount = $stats->count();
                
                if ($gameCount > 0) {
                    $player->averages = [
                        'games_played' => $gameCount,
                        'points' => round($stats->avg('points'), 1),
                        'rebounds' => round($stats->avg('rebounds'), 1),
                        'assists' => round($stats->avg('assists'), 1),
                        'steals' => round($stats->avg('steals'), 1),
                        'blocks' => round($stats->avg('blocks'), 1),
                        'field_goal_percentage' => $stats->sum('field_goals_attempted') > 0 ? 
                            round(($stats->sum('field_goals_made') / $stats->sum('field_goals_attempted')) * 100, 1) : 0,
                        'three_point_percentage' => $stats->sum('three_pointers_attempted') > 0 ? 
                            round(($stats->sum('three_pointers_made') / $stats->sum('three_pointers_attempted')) * 100, 1) : 0,
                        'free_throw_percentage' => $stats->sum('free_throws_attempted') > 0 ? 
                            round(($stats->sum('free_throws_made') / $stats->sum('free_throws_attempted')) * 100, 1) : 0,
                    ];
                } else {
                    $player->averages = [
                        'games_played' => 0,
                        'points' => 0,
                        'rebounds' => 0,
                        'assists' => 0,
                        'steals' => 0,
                        'blocks' => 0,
                        'field_goal_percentage' => 0,
                        'three_point_percentage' => 0,
                        'free_throw_percentage' => 0,
                    ];
                }
            });
        });

        // Get all leagues/seasons
        $seasons = League::orderBy('year', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Public/Home', [
            'games' => $games,
            'teams' => $teams,
            'seasons' => $seasons,
        ]);
    }

    public function gameDetail(Game $game)
    {
        // Load game with all related data including player statistics
        $game->load([
            'teamA.players.user',
            'teamB.players.user', 
            'league',
            'playerStats.player.user'
        ]);

        // Get MVP settings from the league, with default values if not set
        $defaultMvpSettings = [
            'points_weight' => 1.0,
            'rebounds_weight' => 1.2,
            'assists_weight' => 1.5,
            'steals_weight' => 2.0,
            'blocks_weight' => 2.0,
            'shooting_efficiency_weight' => 10.0,
            'fouls_penalty' => 0.5,
            'turnovers_penalty' => 1.0,
        ];
        
        $mvpSettings = $game->league->mvp_settings ? $game->league->mvp_settings : $defaultMvpSettings;

        return Inertia::render('Public/GameDetail', [
            'game' => $game,
            'mvpSettings' => $mvpSettings,
        ]);
    }

    public function teamDetail(Team $team)
    {
        // Get active league
        $activeLeague = League::where('status', 'active')
            ->orWhere('is_active', true)
            ->first();

        // Load team with players and their season stats
        $team->load([
            'coach',
            'players.user',
            'players.playerStats' => function ($query) use ($activeLeague) {
                if ($activeLeague) {
                    $query->whereHas('game', function ($q) use ($activeLeague) {
                        $q->where('league_id', $activeLeague->id);
                    });
                }
            },
            'leagues'
        ]);

        // Calculate player averages
        $team->players->each(function ($player) {
            $stats = $player->playerStats;
            $gameCount = $stats->count();
            
            if ($gameCount > 0) {
                $player->averages = [
                    'games_played' => $gameCount,
                    'points' => round($stats->avg('points'), 1),
                    'rebounds' => round($stats->avg('rebounds'), 1),
                    'assists' => round($stats->avg('assists'), 1),
                    'steals' => round($stats->avg('steals'), 1),
                    'blocks' => round($stats->avg('blocks'), 1),
                    'fouls' => round($stats->avg('fouls'), 1),
                    'field_goal_percentage' => $stats->sum('field_goals_attempted') > 0 ? 
                        round(($stats->sum('field_goals_made') / $stats->sum('field_goals_attempted')) * 100, 1) : 0,
                    'three_point_percentage' => $stats->sum('three_pointers_attempted') > 0 ? 
                        round(($stats->sum('three_pointers_made') / $stats->sum('three_pointers_attempted')) * 100, 1) : 0,
                    'free_throw_percentage' => $stats->sum('free_throws_attempted') > 0 ? 
                        round(($stats->sum('free_throws_made') / $stats->sum('free_throws_attempted')) * 100, 1) : 0,
                ];
            } else {
                $player->averages = [
                    'games_played' => 0,
                    'points' => 0,
                    'rebounds' => 0,
                    'assists' => 0,
                    'steals' => 0,
                    'blocks' => 0,
                    'fouls' => 0,
                    'field_goal_percentage' => 0,
                    'three_point_percentage' => 0,
                    'free_throw_percentage' => 0,
                ];
            }
        });

        // Get team's games for current season
        $games = Game::with(['teamA', 'teamB', 'league'])
            ->where(function ($query) use ($team) {
                $query->where('team_a_id', $team->id)
                      ->orWhere('team_b_id', $team->id);
            })
            ->when($activeLeague, function ($query) use ($activeLeague) {
                return $query->where('league_id', $activeLeague->id);
            })
            ->orderBy('date', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Public/TeamDetail', [
            'team' => $team,
            'games' => $games,
            'activeLeague' => $activeLeague,
        ]);
    }

    public function leaderboards()
    {
        // Get active league
        $activeLeague = League::where('status', 'active')
            ->orWhere('is_active', true)
            ->first();

        if (!$activeLeague) {
            return Inertia::render('Public/Leaderboards', [
                'players' => [],
                'mvpSettings' => null,
            ]);
        }

        // Get all players with their stats for the active season
        $players = Player::with([
            'user',
            'team',
            'playerStats' => function ($query) use ($activeLeague) {
                $query->whereHas('game', function ($q) use ($activeLeague) {
                    $q->where('league_id', $activeLeague->id);
                });
            }
        ])->get();

        // Get MVP settings from the active league, with default values if not set
        $defaultMvpSettings = [
            'points_weight' => 1.0,
            'rebounds_weight' => 1.2,
            'assists_weight' => 1.5,
            'steals_weight' => 2.0,
            'blocks_weight' => 2.0,
            'shooting_efficiency_weight' => 10.0,
            'fouls_penalty' => 0.5,
            'turnovers_penalty' => 1.0,
            'games_played_weight' => 0.5,
        ];
        
        $mvpSettings = $activeLeague->mvp_settings ? $activeLeague->mvp_settings : $defaultMvpSettings;

        return Inertia::render('Public/Leaderboards', [
            'players' => $players,
            'mvpSettings' => $mvpSettings,
        ]);
    }
}