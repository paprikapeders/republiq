<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'season',
        'year',
        'start_date',
        'end_date',
        'description',
        'status',
        'is_active',
        'mvp_settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'year' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'mvp_settings' => 'array',
    ];

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'league_team')
                    ->withTimestamps();
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }
}
