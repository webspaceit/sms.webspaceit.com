import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Library } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Book = { id: number; title: string; author: string; isbn: string; quantity: number; available: number };
export default function Index({ books, filters }: { books: Book[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/books', { search }, { preserveState: true }); };
    const handleDelete = (id: number, title: string) => { if (confirm(`Delete "${title}"?`)) router.delete(`/books/${id}`); };

    return (
        <>
            <Head title="Books" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Library className="size-6 text-amber-600" /> Books</h1><p className="text-sm text-muted-foreground">Library inventory management.</p></div>
                    <Button asChild><Link href="/books/create"><Plus className="mr-2 size-4" /> Add Book</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/books'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Title</th><th className="px-4 py-3 font-medium">Author</th><th className="px-4 py-3 font-medium">ISBN</th><th className="px-4 py-3 font-medium">Qty/Avail</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {books.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No books found.</td></tr>
                                : books.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.title}</td>
                                        <td className="px-4 py-3">{item.author}</td>
                                        <td className="px-4 py-3 text-xs font-mono">{item.isbn}</td>
                                        <td className="px-4 py-3">{item.available}/{item.quantity}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/books/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id, item.title)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Books', href: '/books' }] };
