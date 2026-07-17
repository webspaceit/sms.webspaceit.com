import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type StudentTransport = { id: number; student_name: string; route_name: string; stop_name: string; is_active: boolean };
export default function Index({ assignments, filters }: { assignments: StudentTransport[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/student-transport', { search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this assignment?')) router.delete(`/student-transport/${id}`); };

    return (
        <>
            <Head title="Student Transport" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Truck className="size-6 text-cyan-600" /> Student Transport</h1><p className="text-sm text-muted-foreground">Assign transport routes to students.</p></div>
                    <Button asChild><Link href="/student-transport/create"><Plus className="mr-2 size-4" /> Add Assignment</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/student-transport'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Route</th><th className="px-4 py-3 font-medium">Stop</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {assignments.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No assignments found.</td></tr>
                                : assignments.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.student_name}</td>
                                        <td className="px-4 py-3">{item.route_name}</td>
                                        <td className="px-4 py-3">{item.stop_name}</td>
                                        <td className="px-4 py-3">{item.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/student-transport/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Student Transport', href: '/student-transport' }] };
