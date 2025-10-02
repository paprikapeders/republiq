<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model {
    use HasFactory;

    protected $fillable = [
        'league_id', 'team_a_id', 'team_b_id', 'date', 'venue', 'status', 
        'team_a_score', 'team_b_score', 'current_quarter', 'time_remaining',
        'team_a_fouls', 'team_b_fouls', 'team_a_timeouts', 'team_b_timeouts'
    ];

    protected $casts = [
        'date' => 'datetime',
        'team_a_score' => 'integer',
        'team_b_score' => 'integer',
        'current_quarter' => 'integer',
        'time_remaining' => 'integer',
        'team_a_fouls' => 'integer',
        'team_b_fouls' => 'integer',
        'team_a_timeouts' => 'integer',
        'team_b_timeouts' => 'integer',
    ];

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function teamA()
    {
        return $this->belongsTo(Team::class, 'team_a_id');
    }

    public function teamB()
    {
        return $this->belongsTo(Team::class, 'team_b_id');
    }

    public function playerStats()
    {
        return $this->hasMany(PlayerStat::class);
    }

    // Legacy support
    public function homeTeam() {
        return $this->teamA();
    }

    public function awayTeam() {
        return $this->teamB();
    }

    public function stats() {
        return $this->playerStats();
    }
}

