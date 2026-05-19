<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Drop foreign key/index on sessions table
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        // 2. Drop model_has_permissions and model_has_roles (Spatie) - will recreate with string model_id
        Schema::dropIfExists('model_has_permissions');
        Schema::dropIfExists('model_has_roles');

        // 3. Change users table: remove auto-increment id, make username primary key
        // First remove auto_increment attribute, then drop primary, then drop column
        DB::statement('ALTER TABLE users MODIFY id BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE users DROP PRIMARY KEY');
        DB::statement('ALTER TABLE users DROP COLUMN id');

        // Drop the existing unique index on username (will be replaced by primary key)
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
        });

        // Make username the primary key
        Schema::table('users', function (Blueprint $table) {
            $table->primary('username');
        });

        // 4. Change audit fields on users, roles, permissions from unsignedBigInteger to string
        $auditTables = ['users', 'roles', 'permissions'];
        foreach ($auditTables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->string('created_by')->nullable()->change();
                $table->string('updated_by')->nullable()->change();
                $table->string('deleted_by')->nullable()->change();
            });
        }

        // 5. Change audit fields on categories table
        if (Schema::hasTable('categories')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->string('created_by')->nullable()->change();
                $table->string('updated_by')->nullable()->change();
                $table->string('deleted_by')->nullable()->change();
            });
        }

        // 6. Recreate sessions.user_id as string referencing username
        Schema::table('sessions', function (Blueprint $table) {
            $table->string('user_id')->nullable()->index();
        });

        // 7. Recreate model_has_permissions with string model_id
        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $teams = config('permission.teams');
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id';
        $pivotRole = $columnNames['role_pivot_key'] ?? 'role_id';

        Schema::create($tableNames['model_has_permissions'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission, $teams) {
            $table->unsignedBigInteger($pivotPermission);
            $table->string('model_type');
            $table->string($columnNames['model_morph_key']);
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

            $table->foreign($pivotPermission)
                ->references('id')
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_permissions_team_foreign_key_index');
                $table->primary([$columnNames['team_foreign_key'], $pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_permissions_permission_model_type_primary');
            } else {
                $table->primary([$pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_permissions_permission_model_type_primary');
            }
        });

        // 8. Recreate model_has_roles with string model_id
        Schema::create($tableNames['model_has_roles'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
            $table->unsignedBigInteger($pivotRole);
            $table->string('model_type');
            $table->string($columnNames['model_morph_key']);
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

            $table->foreign($pivotRole)
                ->references('id')
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_roles_team_foreign_key_index');
                $table->primary([$columnNames['team_foreign_key'], $pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            } else {
                $table->primary([$pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is not easily reversible due to data loss
        // A fresh migration would be needed to revert
    }
};
