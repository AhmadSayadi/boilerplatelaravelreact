<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('username', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhereHas('roles', function ($q2) use ($request) {
                      $q2->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sorting logic
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');

        // Whitelist allowed sort fields
        $allowedSortFields = ['name', 'email', 'location', 'status', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $users = $query->with('roles')->paginate(10)->onEachSide(1);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'required|array',
            'status' => 'required|string',
            'location' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->status,
            'location' => $request->location,
        ]);

        $user->syncRoles($request->roles);

        return redirect()->route('users')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $username)
    {
        $user = User::with('roles')->where('username', $username)->firstOrFail();

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $username)
    {
        $user = User::with('roles')->where('username', $username)->firstOrFail();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => Role::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $username)
    {
        $user = User::where('username', $username)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $username . ',username',
            'email' => 'required|string|email|max:255|unique:users,email,' . $username . ',username',
            'roles' => 'required|array',
            'status' => 'required|string',
            'location' => 'nullable|string',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->status = $request->status;
        $user->location = $request->location;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        $user->syncRoles($request->roles);

        return redirect()->route('users')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resources from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'usernames' => 'required|array',
            'usernames.*' => 'exists:users,username',
        ]);

        $usernames = $request->usernames;
        $count = 0;
        $skipped = 0;

        foreach ($usernames as $username) {
            $user = User::find($username);
            if ($user && !$user->hasRole('super-admin')) {
                $user->delete();
                $count++;
            } else {
                $skipped++;
            }
        }

        if ($skipped > 0) {
            return redirect()->route('users')->with('warning', "$count users deleted. $skipped users skipped (cannot delete super-admin).");
        }

        return redirect()->route('users')->with('success', "$count users deleted successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $username)
    {
        $user = User::where('username', $username)->firstOrFail();

        if ($user->hasRole('super-admin')) {
             return back()->with('error', 'Cannot delete super-admin user.');
        }

        $user->delete();

        return redirect()->route('users')->with('success', 'User deleted successfully.');
    }
}
