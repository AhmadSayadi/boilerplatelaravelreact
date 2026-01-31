<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Role::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('group_name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Sorting logic
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        
        // Whitelist allowed sort fields to prevent SQL injection
        $allowedSortFields = ['name', 'group_name', 'status', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        $roles = $query->with('permissions')->paginate(10)->onEachSide(1);

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Roles/Create', [
            'permissions' => Permission::all()->groupBy('group_name'), // Group permissions if useful
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'group_name' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'group_name' => $request->group_name,
            'guard_name' => 'web',
            'status' => 'Active', // Default status
        ]);

        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('roles')->with('success', 'Role created successfully.');
    }

   /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        
        return Inertia::render('Roles/Show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => Permission::all()->groupBy('group_name'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'group_name' => 'nullable|string',
            'permissions' => 'nullable|array',
            'status' => 'required|string',
        ]);

        $role->update([
            'name' => $request->name,
            'group_name' => $request->group_name,
            'status' => $request->status,
        ]);

        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('roles')->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resources from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
        ]);

        $ids = $request->ids;
        $count = 0;
        $skipped = 0;

        foreach ($ids as $id) {
            $role = Role::find($id);
            if ($role && $role->name !== 'super-admin') {
                $role->delete();
                $count++;
            } else {
                $skipped++;
            }
        }

        if ($skipped > 0) {
            return redirect()->route('roles')->with('warning', "$count roles deleted. $skipped roles skipped (cannot delete super-admin).");
        }

        return redirect()->route('roles')->with('success', "$count roles deleted successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        
        // Prevent deleting super-admin if necessary
        if ($role->name === 'super-admin') {
            return back()->with('error', 'Cannot delete super-admin role.');
        }

        $role->delete();

        return redirect()->route('roles')->with('success', 'Role deleted successfully.');
    }
}
