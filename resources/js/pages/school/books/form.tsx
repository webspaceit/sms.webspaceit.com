import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Book = { id: number; title: string; author: string; publisher: string | null; isbn: string; edition: string | null; quantity: number; available: number; shelf_location: string | null; description: string | null };
type Props = { book?: Book; isEdit: boolean };

export default function Form({ book, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: book?.title ?? '',
        author: book?.author ?? '',
        publisher: book?.publisher ?? '',
        isbn: book?.isbn ?? '',
        edition: book?.edition ?? '',
        quantity: book?.quantity?.toString() ?? '',
        available: book?.available?.toString() ?? '',
        shelf_location: book?.shelf_location ?? '',
        description: book?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && book) put(`/books/${book.id}`);
        else post('/books');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Book' : 'Add Book'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/books"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Book' : 'Add New Book'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update book details.' : 'Add a book to the library.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. The Great Gatsby" required />{errors.title && <p className="text-sm text-red-500">{errors.title}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="author">Author</Label><Input id="author" value={data.author} onChange={(e) => setData('author', e.target.value)} placeholder="e.g. F. Scott Fitzgerald" required />{errors.author && <p className="text-sm text-red-500">{errors.author}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="isbn">ISBN</Label><Input id="isbn" value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} placeholder="e.g. 978-3-16-148410-0" />{errors.isbn && <p className="text-sm text-red-500">{errors.isbn}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="publisher">Publisher</Label><Input id="publisher" value={data.publisher} onChange={(e) => setData('publisher', e.target.value)} placeholder="Publisher name" />{errors.publisher && <p className="text-sm text-red-500">{errors.publisher}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="edition">Edition</Label><Input id="edition" value={data.edition} onChange={(e) => setData('edition', e.target.value)} placeholder="e.g. 2nd" />{errors.edition && <p className="text-sm text-red-500">{errors.edition}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="quantity">Quantity</Label><Input id="quantity" type="number" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} required />{errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="available">Available</Label><Input id="available" type="number" value={data.available} onChange={(e) => setData('available', e.target.value)} required />{errors.available && <p className="text-sm text-red-500">{errors.available}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="shelf_location">Shelf Location</Label><Input id="shelf_location" value={data.shelf_location} onChange={(e) => setData('shelf_location', e.target.value)} placeholder="e.g. A-12" />{errors.shelf_location && <p className="text-sm text-red-500">{errors.shelf_location}</p>}</div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Brief description..." />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/books">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Books', href: '/books' }, { title: 'Manage', href: '' }] };
