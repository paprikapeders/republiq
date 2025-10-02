<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('home_team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('away_team_id')->constrained('teams')->onDelete('cascade');
            $table->dateTime('game_date');
            $table->string('location')->nullable();
            $table->integer('home_score')->default(0);
            $table->integer('away_score')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('games');
    }
};
