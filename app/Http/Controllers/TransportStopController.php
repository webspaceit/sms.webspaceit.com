<?php

namespace App\Http\Controllers;

use App\Models\TransportRoute;
use App\Models\TransportStop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransportStopController extends Controller
{
    public function index(Request $request): Response
    {
        $routeId = $request->input('transport_route_id');

        $query = TransportStop::with('transportRoute');

        if ($routeId) {
            $query->where('transport_route_id', $routeId);
        }

        $stops = $query->orderBy('sort_order')->orderBy('name')->get();

        $routes = TransportRoute::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/transport-stops/index', [
            'stops' => $stops,
            'routes' => $routes,
            'filters' => ['transport_route_id' => $routeId],
        ]);
    }

    public function create(): Response
    {
        $routes = TransportRoute::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/transport-stops/form', [
            'routes' => $routes,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transport_route_id' => 'required|exists:transport_routes,id',
            'name' => 'required|string|max:255',
            'pickup_time' => 'nullable',
            'drop_time' => 'nullable',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        TransportStop::create($validated);

        return redirect()->route('transport-stops.index')->with('success', 'Transport stop created successfully.');
    }

    public function show($id): Response
    {
        $stop = TransportStop::with('transportRoute')->findOrFail($id);

        return Inertia::render('school/transport-stops/show', [
            'stop' => $stop,
        ]);
    }

    public function edit($id): Response
    {
        $stop = TransportStop::findOrFail($id);
        $routes = TransportRoute::orderBy('name')->get(['id', 'name']);

        return Inertia::render('school/transport-stops/form', [
            'stop' => $stop,
            'routes' => $routes,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $stop = TransportStop::findOrFail($id);

        $validated = $request->validate([
            'transport_route_id' => 'required|exists:transport_routes,id',
            'name' => 'required|string|max:255',
            'pickup_time' => 'nullable',
            'drop_time' => 'nullable',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $stop->update($validated);

        return redirect()->route('transport-stops.index')->with('success', 'Transport stop updated successfully.');
    }

    public function destroy($id)
    {
        $stop = TransportStop::findOrFail($id);
        $stop->delete();

        return redirect()->route('transport-stops.index')->with('success', 'Transport stop deleted successfully.');
    }
}
