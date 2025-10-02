<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->onDelete('cascade');
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->integer('points')->default(0);
            $table->integer('assists')->default(0);
            $table->integer('rebounds')->default(0);
            $table->integer('steals')->default(0);
            $table->integer('blocks')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('player_stats');
    }
};
