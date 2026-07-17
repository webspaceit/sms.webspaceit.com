<?php

namespace App\Http\Controllers;

use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryItemController extends Controller
{
    public function index(Request $request): Response
    {
        $query = InventoryItem::with('category');

        if ($request->input('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }
        if ($request->input('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $items = $query->orderBy('name')->get();
        $categories = InventoryCategory::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/inventory/index', [
            'items' => $items,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:inventory_categories,id',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        InventoryItem::create($validated);

        return redirect()->route('inventory.index')
            ->with('success', 'Item added successfully.');
    }

    public function update(Request $request, InventoryItem $inventoryItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:inventory_categories,id',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $inventoryItem->update($validated);

        return redirect()->route('inventory.index')
            ->with('success', 'Item updated successfully.');
    }

    public function destroy(InventoryItem $inventoryItem)
    {
        $inventoryItem->delete();

        return redirect()->route('inventory.index')
            ->with('success', 'Item deleted successfully.');
    }
}
