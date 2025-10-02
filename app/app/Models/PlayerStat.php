<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlayerStat extends Model {
    use HasFactory;

    protected $fillable = [
        'player_id', 'game_id', 'points', 'assists', 'rebounds', 'steals', 'blocks', 
        'fouls', 'turnovers', 'field_goals_made', 'field_goals_attempted', 
        'three_pointers_made', 'three_pointers_attempted', 'free_throws_made', 
        'free_throws_attempted', 'minutes_played'
    ];

    public function player() {
        return $this->belongsTo(Player::class);
    }

    public function game() {
        return $this->belongsTo(Game::class);
    }
}
