<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Player extends Model {
    use HasFactory;

    protected $fillable = ['user_id', 'team_id', 'position', 'number', 'jersey_number', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function team() {
        return $this->belongsTo(Team::class);
    }

    public function stats() {
        return $this->hasMany(PlayerStat::class);
    }
}
