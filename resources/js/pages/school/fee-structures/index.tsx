import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FeeStructure = { id: number; class_name: string; fee_head_name: string; amount: number };
type Props = { feeStructures: FeeStructure[]; classes: { id: number; name: string }[]; filters?: { class_id?: string; search?: string } };

export default function Index({ feeStructures, classes, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/fee-structures', { class_id: classId, search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this structure?')) router.delete(`/fee-structures/${id}`); };

    return (
        <>
            <Head title="Fee Structures" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><DollarSign className="size-6 text-emerald-600" /> Fee Structures</h1><p className="text-sm text-muted-foreground">Configure fee amounts per class.</p></div>
                    <Button asChild><Link href="/fee-structures/create"><Plus className="mr-2 size-4" /> Add Structure</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2 flex-wrap">
                    <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {(filters?.search || filters?.class_id) && <Button type="button" variant="ghost" onClick={() => { setSearch(''); setClassId(''); router.get('/fee-structures'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Class</th><th className="px-4 py-3 font-medium">Fee Head</th><th className="px-4 py-3 font-medium">Amount (BDT)</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {feeStructures.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No fee structures found.</td></tr>
                                : feeStructures.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3">{item.class_name}</td>
                                        <td className="px-4 py-3 font-medium">{item.fee_head_name}</td>
                                        <td className="px-4 py-3">BDT {Number(item.amount).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/fee-structures/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Fee Structures', href: '/fee-structures' }] };
