<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rcd_issued_form', function (Blueprint $table) {
            $table->string('status', 20)->default('Not Remit')->after('total');
        });
    }

    public function down(): void
    {
        Schema::table('rcd_issued_form', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
