<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = Book::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%")
                    ->orWhere('shelf_location', 'like', "%{$search}%");
            });
        }

        $books = $query->orderBy('title')->get();

        return Inertia::render('school/books/index', [
            'books' => $books,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('school/books/form', [
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:50|unique:books',
            'edition' => 'nullable|string|max:50',
            'quantity' => 'required|integer|min:0',
            'available' => 'required|integer|min:0',
            'shelf_location' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        Book::create($validated);

        return redirect()->route('books.index')->with('success', 'Book created successfully.');
    }

    public function show($id): Response
    {
        $book = Book::with('issues')->findOrFail($id);

        return Inertia::render('school/books/show', [
            'book' => $book,
        ]);
    }

    public function edit($id): Response
    {
        $book = Book::findOrFail($id);

        return Inertia::render('school/books/form', [
            'book' => $book,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'isbn' => ['nullable', 'string', 'max:50', \Illuminate\Validation\Rule::unique('books')->ignore($id)],
            'edition' => 'nullable|string|max:50',
            'quantity' => 'required|integer|min:0',
            'available' => 'required|integer|min:0',
            'shelf_location' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        $book->update($validated);

        return redirect()->route('books.index')->with('success', 'Book updated successfully.');
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();

        return redirect()->route('books.index')->with('success', 'Book deleted successfully.');
    }
}
