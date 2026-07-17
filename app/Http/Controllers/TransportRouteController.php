<?php

namespace App\Http\Controllers;

use App\Models\TransportRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransportRouteController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = TransportRoute::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('driver_name', 'like', "%{$search}%")
                    ->orWhere('driver_phone', 'like', "%{$search}%")
                    ->orWhere('vehicle_no', 'like', "%{$search}%");
            });
        }

        $routes = $query->orderBy('name')->get();

        return Inertia::render('school/transport-routes/index', [
            'routes' => $routes,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/transport-routes/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:20',
            'vehicle_no' => 'nullable|string|max:50',
            'fare' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        TransportRoute::create($validated);

        return redirect()->route('transport-routes.index')->with('success', 'Transport route created successfully.');
    }

    public function show($id): Response
    {
        $route = TransportRoute::with('stops')->findOrFail($id);

        return Inertia::render('school/transport-routes/show', [
            'route' => $route,
        ]);
    }

    public function edit($id): Response
    {
        $route = TransportRoute::findOrFail($id);

        return Inertia::render('school/transport-routes/form', [
            'route' => $route,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $route = TransportRoute::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:20',
            'vehicle_no' => 'nullable|string|max:50',
            'fare' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $route->update($validated);

        return redirect()->route('transport-routes.index')->with('success', 'Transport route updated successfully.');
    }

    public function destroy($id)
    {
        $route = TransportRoute::findOrFail($id);
        $route->delete();

        return redirect()->route('transport-routes.index')->with('success', 'Transport route deleted successfully.');
    }
}
