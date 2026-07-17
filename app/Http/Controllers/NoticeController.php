<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NoticeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $type = $request->input('type');
        $isPublished = $request->input('is_published');

        $query = Notice::with('createdBy');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($type) {
            $query->where('type', $type);
        }

        if ($isPublished !== null) {
            $query->where('is_published', $isPublished === '1' || $isPublished === 'true');
        }

        $notices = $query->orderBy('published_date', 'desc')->get();

        return Inertia::render('school/notices/index', [
            'notices' => $notices,
            'filters' => [
                'search' => $search,
                'type' => $type,
                'is_published' => $isPublished,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/notices/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|max:50',
            'target_roles' => 'nullable|array',
            'published_date' => 'required|date',
            'expires_date' => 'nullable|date|after_or_equal:published_date',
            'is_published' => 'boolean',
        ]);

        $validated['created_by'] = Auth::id();

        Notice::create($validated);

        return redirect()->route('notices.index')->with('success', 'Notice created successfully.');
    }

    public function show($id): Response
    {
        $notice = Notice::with('createdBy')->findOrFail($id);

        return Inertia::render('school/notices/show', [
            'notice' => $notice,
        ]);
    }

    public function edit($id): Response
    {
        $notice = Notice::findOrFail($id);

        return Inertia::render('school/notices/form', [
            'notice' => $notice,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $notice = Notice::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|max:50',
            'target_roles' => 'nullable|array',
            'published_date' => 'required|date',
            'expires_date' => 'nullable|date|after_or_equal:published_date',
            'is_published' => 'boolean',
        ]);

        $notice->update($validated);

        return redirect()->route('notices.index')->with('success', 'Notice updated successfully.');
    }

    public function destroy($id)
    {
        $notice = Notice::findOrFail($id);
        $notice->delete();

        return redirect()->route('notices.index')->with('success', 'Notice deleted successfully.');
    }
}
