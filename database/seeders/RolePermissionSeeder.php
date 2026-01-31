<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Clear existing permissions to avoid duplicates and remove unused ones
        \Illuminate\Support\Facades\DB::table('role_has_permissions')->delete();
        \Illuminate\Support\Facades\DB::table('model_has_permissions')->delete();
        Permission::query()->delete();

        $guardName = 'web';

        // create permissions
        $permissions = [
            // Dashboard
            [
                'name' => 'view-dashboard',
                'group_name' => 'Dashboard',
                'display_name' => 'Lihat Dashboard'
            ],
            
            // User Management
            [
                'name' => 'manage-users',
                'group_name' => 'User',
                'display_name' => 'Kelola User'
            ],
            [
                'name' => 'view-users',
                'group_name' => 'User',
                'display_name' => 'Lihat User'
            ],
            [
                'name' => 'create-users',
                'group_name' => 'User',
                'display_name' => 'Tambah User'
            ],
            [
                'name' => 'edit-users',
                'group_name' => 'User',
                'display_name' => 'Edit User'
            ],
            [
                'name' => 'delete-users',
                'group_name' => 'User',
                'display_name' => 'Hapus User'
            ],

            // Role Management
            [
                'name' => 'manage-roles',
                'group_name' => 'Role',
                'display_name' => 'Kelola Role'
            ],
            [
                'name' => 'view-roles',
                'group_name' => 'Role',
                'display_name' => 'Lihat Role'
            ],
            [
                'name' => 'create-roles',
                'group_name' => 'Role',
                'display_name' => 'Tambah Role'
            ],
            [
                'name' => 'edit-roles',
                'group_name' => 'Role',
                'display_name' => 'Edit Role'
            ],
            [
                'name' => 'delete-roles',
                'group_name' => 'Role',
                'display_name' => 'Hapus Role'
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name'], 'guard_name' => $guardName],
                [
                    'group_name' => $permission['group_name'],
                    'display_name' => $permission['display_name']
                ]
            );
        }

        // create roles and assign created permissions

        // User Role
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => $guardName]);
        $userRole->givePermissionTo([
            'view-dashboard',
        ]);

        // Admin Role
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => $guardName]);
        $adminRole->givePermissionTo([
            'view-dashboard',
            'view-users',
        ]);

        // Super-Admin Role
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => $guardName]);
        // give all permissions
        $superAdminRole->givePermissionTo(Permission::all());
    }
}
