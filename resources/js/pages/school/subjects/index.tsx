import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Subject = { id: number; name: string; name_bn: string | null; code: string; type: string; classes: { id: number; name: string }[] };
type Props = { subjects: Subject[]; classes: { id: number; name: string }[]; filters?: { search?: string; class_id?: string } };

export default function Index({ subjects, classes, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/subjects', { class_id: classId, search }, { preserveState: true }); };
    const handleDelete = (id: number, name: string) => { if (confirm(`Delete ${name}?`)) router.delete(`/subjects/${id}`); };

    return (
        <>
            <Head title="Subjects" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><BookOpen className="size-6 text-blue-600" /> Subjects</h1><p className="text-sm text-muted-foreground">Manage subjects with Bangla names and codes.</p></div>
                    <Button asChild><Link href="/subjects/create"><Plus className="mr-2 size-4" /> Add Subject</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {(filters?.search || filters?.class_id) && <Button type="button" variant="ghost" onClick={() => { setSearch(''); setClassId(''); router.get('/subjects'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium w-10">Sl. No.</th><th className="px-4 py-3 font-medium">Classes</th><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Bangla Name</th><th className="px-4 py-3 font-medium">Code</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                                </thead>
                                <tbody>
                                    {subjects.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No subjects found.</td></tr>
                                    : subjects.map((item, idx) => (
                                        <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 text-center text-muted-foreground text-xs">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            {item.classes.length > 0
                                                ? <div className="flex flex-wrap gap-1">{item.classes.map((c) => <Badge key={c.id} variant="secondary" className="text-xs">{c.name}</Badge>)}</div>
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3">{item.name_bn ?? '-'}</td>
                                        <td className="px-4 py-3">{item.code}</td>
                                        <td className="px-4 py-3"><Badge variant="secondary">{item.type}</Badge></td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/subjects/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Subjects', href: '/subjects' }] };