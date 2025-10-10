<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPhotoPathToPlayersTable extends Migration {
    public function up() {
        Schema::table('players', function (Blueprint $table) {
            $table->string('photo_path')->nullable()->after('position');
        });
    }

    public function down() {
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn('photo_path');
        });
    }
}