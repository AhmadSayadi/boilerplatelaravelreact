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
        $tables = ['users', 'roles', 'permissions'];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->unsignedBigInteger('created_by')->nullable();
                $table->string('created_location')->nullable();
                $table->unsignedBigInteger('updated_by')->nullable();
                $table->string('updated_location')->nullable();
                $table->unsignedBigInteger('deleted_by')->nullable();
                $table->string('deleted_location')->nullable();
                $table->string('status')->default('active');
            });
        }

        Schema::table('roles', function (Blueprint $table) {
            $table->string('group_name')->nullable()->after('name');
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->string('display_name')->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['users', 'roles', 'permissions'];
        $columns = [
            'created_by', 'created_location',
            'updated_by', 'updated_location',
            'deleted_by', 'deleted_location',
            'status'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) use ($columns) {
                    $table->dropColumn($columns);
                });
            }
        }

        if (Schema::hasColumn('roles', 'group_name')) {
            Schema::table('roles', function (Blueprint $table) {
                $table->dropColumn('group_name');
            });
        }

        if (Schema::hasColumn('permissions', 'display_name')) {
            Schema::table('permissions', function (Blueprint $table) {
                $table->dropColumn('display_name');
            });
        }
    }
};
