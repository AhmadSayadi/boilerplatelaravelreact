<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products/Index');
    }

    public function create()
    {
        $categories = Category::where('status', 'Active')->select('id', 'name')->get();
        return Inertia::render('Products/Edit', [
            'categories' => $categories
        ]);
    }

    public function show($id)
    {
        return Inertia::render('Products/Show', ['id' => $id]);
    }

    public function edit($id)
    {
        $categories = Category::where('status', 'Active')->select('id', 'name')->get();
        return Inertia::render('Products/Edit', [
            'id' => $id,
            'categories' => $categories
        ]);
    }
}
