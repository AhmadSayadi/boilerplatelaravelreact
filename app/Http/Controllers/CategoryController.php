<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        $categories = $query->paginate(10)->onEachSide(1);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:Active,Inactive',
            'description' => 'nullable|string',
        ]);

        Category::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'description' => $request->description,
            'status' => $request->status,
            'parent_id' => $request->parent_id,
        ]);

        return redirect()->route('categories')->with('success', 'Category created successfully.');
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return Inertia::render('Categories/Show', [
            'category' => $category
        ]);
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);
        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:Active,Inactive',
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'description' => $request->description,
            'status' => $request->status,
            'parent_id' => $request->parent_id,
        ]);

        return redirect()->route('categories')->with('success', 'Category updated successfully.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->route('categories')->with('success', 'Category deleted successfully.');
    }
}
