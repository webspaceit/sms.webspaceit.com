<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlider;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HeroSliderController extends Controller
{
    public function index(): Response
    {
        $sliders = HeroSlider::orderBy('sort_order')->get()->map(fn ($s) => [
            'id' => $s->id,
            'title' => $s->title,
            'subtitle' => $s->subtitle,
            'image' => $s->image,
            'button_text' => $s->button_text,
            'button_url' => $s->button_url,
            'sort_order' => $s->sort_order,
            'is_active' => $s->is_active,
        ]);

        return Inertia::render('cms/hero-sliders/index', [
            'sliders' => $sliders,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        HeroSlider::create($validated);

        return redirect()->route('hero-sliders.index')
            ->with('success', 'Hero slider created successfully.');
    }

    public function update(Request $request, HeroSlider $heroSlider)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $heroSlider->update($validated);

        return redirect()->route('hero-sliders.index')
            ->with('success', 'Hero slider updated successfully.');
    }

    public function destroy(HeroSlider $heroSlider)
    {
        $heroSlider->delete();

        return redirect()->route('hero-sliders.index')
            ->with('success', 'Hero slider deleted successfully.');
    }
}
