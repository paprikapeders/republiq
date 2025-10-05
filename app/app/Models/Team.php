<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Team extends Model {
    use HasFactory;

    protected $fillable = ['name', 'coach_id', 'code'];

    public function coach() {
        return $this->belongsTo(User::class, 'coach_id');
    }

    public function leagues() {
        return $this->belongsToMany(League::class, 'league_team')
                    ->withTimestamps();
    }

    // Helper method to get the primary/current league (for backward compatibility)
    public function league() {
        return $this->leagues()->first();
    }

    public function players() {
        return $this->hasMany(Player::class);
    }

    public function homeGames() {
        return $this->hasMany(Game::class, 'home_team_id');
    }

    public function awayGames() {
        return $this->hasMany(Game::class, 'away_team_id');
    }
}
