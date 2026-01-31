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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            
            // Audit fields
            $table->string('status')->default('Active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->string('created_location')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->string('updated_location')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->string('deleted_location')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
