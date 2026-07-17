import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ClassRoutine = { id: number; class_name: string; section_name: string; day_of_week: string; subject_name: string; teacher_name: string; start_time: string; end_time: string; room: string | null };
type Props = { routines: ClassRoutine[]; classes: { id: number; name: string }[]; filters?: { class_id?: string; search?: string } };

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

export default function Index({ routines, classes, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/class-routines', { class_id: classId, search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this routine entry?')) router.delete(`/class-routines/${id}`); };

    return (
        <>
            <Head title="Class Routines" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Clock className="size-6 text-blue-600" /> Class Routines</h1><p className="text-sm text-muted-foreground">Weekly class timetable management.</p></div>
                    <Button asChild><Link href="/class-routines/create"><Plus className="mr-2 size-4" /> Add Entry</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2 flex-wrap">
                    <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {(filters?.search || filters?.class_id) && <Button type="button" variant="ghost" onClick={() => { setSearch(''); setClassId(''); router.get('/class-routines'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Class</th><th className="px-4 py-3 font-medium">Section</th><th className="px-4 py-3 font-medium">Day</th><th className="px-4 py-3 font-medium">Subject</th><th className="px-4 py-3 font-medium">Teacher</th><th className="px-4 py-3 font-medium">Time</th><th className="px-4 py-3 font-medium">Room</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {routines.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No routines found.</td></tr>
                                : routines.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3">{item.class_name}</td>
                                        <td className="px-4 py-3">{item.section_name}</td>
                                        <td className="px-4 py-3 text-xs font-medium">{item.day_of_week.slice(0, 3)}</td>
                                        <td className="px-4 py-3">{item.subject_name}</td>
                                        <td className="px-4 py-3">{item.teacher_name}</td>
                                        <td className="px-4 py-3">{item.start_time} - {item.end_time}</td>
                                        <td className="px-4 py-3">{item.room ?? '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/class-routines/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Class Routines', href: '/class-routines' }] };
