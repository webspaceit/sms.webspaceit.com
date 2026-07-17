import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Award } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Exam = { id: number; name: string; type: string; academic_year: { id: number; name: string } | null; start_date: string; end_date: string };
export default function Index({ exams, filters }: { exams: Exam[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/exams', { search }, { preserveState: true }); };
    const handleDelete = (id: number, name: string) => { if (confirm(`Delete ${name}?`)) router.delete(`/exams/${id}`); };

    return (
        <>
            <Head title="Exams" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Award className="size-6 text-rose-600" /> Exams</h1><p className="text-sm text-muted-foreground">Manage examinations and schedules.</p></div>
                    <Button asChild><Link href="/exams/create"><Plus className="mr-2 size-4" /> Add Exam</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/exams'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Year</th><th className="px-4 py-3 font-medium">Duration</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {exams.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No exams found.</td></tr>
                                : exams.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3"><Badge variant="secondary">{item.type}</Badge></td>
                                        <td className="px-4 py-3">{item.academic_year?.name ?? '-'}</td>
                                        <td className="px-4 py-3">{item.start_date} - {item.end_date}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/exams/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id, item.name)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Exams', href: '/exams' }] };
