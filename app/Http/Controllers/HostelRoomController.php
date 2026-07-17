<?php

namespace App\Http\Controllers;

use App\Models\HostelRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HostelRoomController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = HostelRoom::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('room_no', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('facilities', 'like', "%{$search}%");
            });
        }

        $rooms = $query->orderBy('room_no')->get();

        return Inertia::render('school/hostel-rooms/index', [
            'rooms' => $rooms,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/hostel-rooms/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_no' => 'required|string|max:50|unique:hostel_rooms',
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'rent_per_bed' => 'nullable|numeric|min:0',
            'facilities' => 'nullable|string',
        ]);

        HostelRoom::create($validated);

        return redirect()->route('hostel-rooms.index')->with('success', 'Hostel room created successfully.');
    }

    public function show($id): Response
    {
        $room = HostelRoom::with('allocations')->findOrFail($id);

        return Inertia::render('school/hostel-rooms/show', [
            'room' => $room,
        ]);
    }

    public function edit($id): Response
    {
        $room = HostelRoom::findOrFail($id);

        return Inertia::render('school/hostel-rooms/form', [
            'room' => $room,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $room = HostelRoom::findOrFail($id);

        $validated = $request->validate([
            'room_no' => ['required', 'string', 'max:50', \Illuminate\Validation\Rule::unique('hostel_rooms')->ignore($id)],
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'rent_per_bed' => 'nullable|numeric|min:0',
            'facilities' => 'nullable|string',
        ]);

        $room->update($validated);

        return redirect()->route('hostel-rooms.index')->with('success', 'Hostel room updated successfully.');
    }

    public function destroy($id)
    {
        $room = HostelRoom::findOrFail($id);
        $room->delete();

        return redirect()->route('hostel-rooms.index')->with('success', 'Hostel room deleted successfully.');
    }
}
