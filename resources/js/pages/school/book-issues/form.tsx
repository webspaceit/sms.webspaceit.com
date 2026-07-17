import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BookIssue = { id: number; book_id: number; issuable_type: string; issuable_id: number; issue_date: string; due_date: string; return_date: string | null; status: string; fine: number | null };
type Props = { issue?: BookIssue; books: { id: number; title: string }[]; isEdit: boolean };

const statuses = ['issued', 'returned', 'overdue', 'lost'];

export default function Form({ issue, books, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        book_id: issue?.book_id?.toString() ?? '',
        issuable_type: issue?.issuable_type ?? 'student',
        issuable_id: issue?.issuable_id?.toString() ?? '',
        issue_date: issue?.issue_date ?? '',
        due_date: issue?.due_date ?? '',
        return_date: issue?.return_date ?? '',
        status: issue?.status ?? 'issued',
        fine: issue?.fine?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && issue) put(`/book-issues/${issue.id}`);
        else post('/book-issues');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Book Issue' : 'Issue Book'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/book-issues"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Book Issue' : 'Issue Book'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update issue record.' : 'Issue a book to a member.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="book_id">Book</Label>
                            <Select value={data.book_id} onValueChange={(val) => setData('book_id', val)}>
                                <SelectTrigger id="book_id"><SelectValue placeholder="Select book..." /></SelectTrigger>
                                <SelectContent>{books.map((b) => <SelectItem key={b.id} value={b.id.toString()}>{b.title}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.book_id && <p className="text-sm text-red-500">{errors.book_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="issuable_type">Member Type</Label>
                            <Select value={data.issuable_type} onValueChange={(val) => setData('issuable_type', val)}>
                                <SelectTrigger id="issuable_type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="teacher">Teacher</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="issuable_id">Member ID</Label>
                        <Input id="issuable_id" type="number" value={data.issuable_id} onChange={(e) => setData('issuable_id', e.target.value)} placeholder="e.g. 1" required />
                        {errors.issuable_id && <p className="text-sm text-red-500">{errors.issuable_id}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="issue_date">Issue Date</Label><Input id="issue_date" type="date" value={data.issue_date} onChange={(e) => setData('issue_date', e.target.value)} required />{errors.issue_date && <p className="text-sm text-red-500">{errors.issue_date}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="due_date">Due Date</Label><Input id="due_date" type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} required />{errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                <SelectTrigger id="status"><SelectValue placeholder="Select status..." /></SelectTrigger>
                                <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="return_date">Return Date</Label><Input id="return_date" type="date" value={data.return_date} onChange={(e) => setData('return_date', e.target.value)} />{errors.return_date && <p className="text-sm text-red-500">{errors.return_date}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="fine">Fine (BDT)</Label><Input id="fine" type="number" value={data.fine} onChange={(e) => setData('fine', e.target.value)} placeholder="e.g. 50" />{errors.fine && <p className="text-sm text-red-500">{errors.fine}</p>}</div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/book-issues">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Book Issues', href: '/book-issues' }, { title: 'Manage', href: '' }] };
