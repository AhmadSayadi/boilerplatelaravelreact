<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Users
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::post('/users/bulk-delete', [UserController::class, 'bulkDestroy'])->name('users.bulk-delete'); // Changed to POST for array data
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/edit/{id}', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::get('/users/view/{id}', [UserController::class, 'show'])->name('users.show');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    // Roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles');
    Route::post('/roles/bulk-delete', [RoleController::class, 'bulkDestroy'])->name('roles.bulk-delete'); // Changed to POST for array data
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/edit/{id}', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{id}', [RoleController::class, 'update'])->name('roles.update');
    Route::get('/roles/view/{id}', [RoleController::class, 'show'])->name('roles.show');
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->name('roles.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
