<?php

namespace App\Http\Controllers;

use App\Models\InventoryCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = InventoryCategory::withCount('items')->orderBy('name')->get();

        return Inertia::render('school/inventory/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        InventoryCategory::create($validated);

        return redirect()->route('inventory.index')
            ->with('success', 'Category created successfully.');
    }

    public function update(Request $request, InventoryCategory $inventoryCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $inventoryCategory->update($validated);

        return redirect()->route('inventory.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(InventoryCategory $inventoryCategory)
    {
        if ($inventoryCategory->items()->count() > 0) {
            return redirect()->route('inventory.index')
                ->with('error', 'Cannot delete category with items.');
        }

        $inventoryCategory->delete();

        return redirect()->route('inventory.index')
            ->with('success', 'Category deleted successfully.');
    }
}
