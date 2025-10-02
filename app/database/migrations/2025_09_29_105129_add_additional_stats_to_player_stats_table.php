<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('player_stats', function (Blueprint $table) {
            $table->integer('fouls')->default(0)->after('blocks');
            $table->integer('turnovers')->default(0)->after('fouls');
            $table->integer('field_goals_made')->default(0)->after('turnovers');
            $table->integer('field_goals_attempted')->default(0)->after('field_goals_made');
            $table->integer('three_pointers_made')->default(0)->after('field_goals_attempted');
            $table->integer('three_pointers_attempted')->default(0)->after('three_pointers_made');
            $table->integer('free_throws_made')->default(0)->after('three_pointers_attempted');
            $table->integer('free_throws_attempted')->default(0)->after('free_throws_made');
            $table->integer('minutes_played')->default(0)->after('free_throws_attempted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('player_stats', function (Blueprint $table) {
            $table->dropColumn([
                'fouls',
                'turnovers',
                'field_goals_made',
                'field_goals_attempted',
                'three_pointers_made',
                'three_pointers_attempted',
                'free_throws_made',
                'free_throws_attempted',
                'minutes_played'
            ]);
        });
    }
};
