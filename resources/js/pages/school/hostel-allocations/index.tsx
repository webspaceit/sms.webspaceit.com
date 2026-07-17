import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type HostelAllocation = { id: number; student_name: string; room_no: string; start_date: string; end_date: string | null; is_active: boolean };
export default function Index({ allocations, filters }: { allocations: HostelAllocation[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/hostel-allocations', { search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this allocation?')) router.delete(`/hostel-allocations/${id}`); };

    return (
        <>
            <Head title="Hostel Allocations" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Building2 className="size-6 text-violet-600" /> Hostel Allocations</h1><p className="text-sm text-muted-foreground">Student hostel room assignments.</p></div>
                    <Button asChild><Link href="/hostel-allocations/create"><Plus className="mr-2 size-4" /> Allocate Room</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/hostel-allocations'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Room</th><th className="px-4 py-3 font-medium">Dates</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {allocations.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No allocations found.</td></tr>
                                : allocations.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.student_name}</td>
                                        <td className="px-4 py-3">{item.room_no}</td>
                                        <td className="px-4 py-3">{item.start_date}{item.end_date ? ` - ${item.end_date}` : ''}</td>
                                        <td className="px-4 py-3">{item.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/hostel-allocations/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Hostel Allocations', href: '/hostel-allocations' }] };
