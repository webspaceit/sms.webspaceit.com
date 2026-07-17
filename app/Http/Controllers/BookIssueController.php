<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookIssue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookIssueController extends Controller
{
    public function index(Request $request): Response
    {
        $bookId = $request->input('book_id');
        $status = $request->input('status');

        $query = BookIssue::with(['book', 'issuable']);

        if ($bookId) {
            $query->where('book_id', $bookId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $issues = $query->orderBy('issue_date', 'desc')->get();

        $books = Book::orderBy('title')->get(['id', 'title', 'isbn']);

        return Inertia::render('school/book-issues/index', [
            'issues' => $issues,
            'books' => $books,
            'filters' => [
                'book_id' => $bookId,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        $books = Book::orderBy('title')->get(['id', 'title', 'isbn', 'available']);

        return Inertia::render('school/book-issues/form', [
            'books' => $books,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'issuable_type' => 'required|string|max:255',
            'issuable_id' => 'required|integer',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'return_date' => 'nullable|date|after_or_equal:issue_date',
            'fine' => 'nullable|numeric|min:0',
            'status' => 'required|string|max:20',
        ]);

        BookIssue::create($validated);

        return redirect()->route('book-issues.index')->with('success', 'Book issue created successfully.');
    }

    public function show($id): Response
    {
        $issue = BookIssue::with(['book', 'issuable'])->findOrFail($id);

        return Inertia::render('school/book-issues/show', [
            'issue' => $issue,
        ]);
    }

    public function edit($id): Response
    {
        $issue = BookIssue::findOrFail($id);
        $books = Book::orderBy('title')->get(['id', 'title', 'isbn', 'available']);

        return Inertia::render('school/book-issues/form', [
            'issue' => $issue,
            'books' => $books,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $issue = BookIssue::findOrFail($id);

        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'issuable_type' => 'required|string|max:255',
            'issuable_id' => 'required|integer',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'return_date' => 'nullable|date|after_or_equal:issue_date',
            'fine' => 'nullable|numeric|min:0',
            'status' => 'required|string|max:20',
        ]);

        $issue->update($validated);

        return redirect()->route('book-issues.index')->with('success', 'Book issue updated successfully.');
    }

    public function destroy($id)
    {
        $issue = BookIssue::findOrFail($id);
        $issue->delete();

        return redirect()->route('book-issues.index')->with('success', 'Book issue deleted successfully.');
    }
}
