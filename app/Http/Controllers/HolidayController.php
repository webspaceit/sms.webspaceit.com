<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HolidayController extends Controller
{
    public function index(): Response
    {
        $holidays = Holiday::orderBy('date', 'desc')->get();

        return Inertia::render('school/holidays/index', [
            'holidays' => $holidays,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/holidays/form', ['isEdit' => false]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        Holiday::create($validated);

        return redirect()->route('holidays.index')
            ->with('success', 'Holiday created successfully.');
    }

    public function edit(Holiday $holiday): Response
    {
        return Inertia::render('school/holidays/form', [
            'holiday' => $holiday,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, Holiday $holiday)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $holiday->update($validated);

        return redirect()->route('holidays.index')
            ->with('success', 'Holiday updated successfully.');
    }

    public function destroy(Holiday $holiday)
    {
        $holiday->delete();

        return redirect()->route('holidays.index')
            ->with('success', 'Holiday deleted successfully.');
    }
}
