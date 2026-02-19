<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rcd_entries', function (Blueprint $table) {
            $table->id();
            $table->date('Date');
            $table->string('Collector');
            $table->string('Type_Of_Receipt');
            $table->unsignedBigInteger('Receipt_No_From');
            $table->unsignedBigInteger('Receipt_No_To');
            $table->decimal('Total', 14, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rcd_entries');
    }
};
