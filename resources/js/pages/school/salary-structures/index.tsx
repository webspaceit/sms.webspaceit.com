import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SalaryStructure = { id: number; teacher_name: string; basic_salary: number; house_rent: number; medical: number; transport_allowance: number; other_allowances: number; deductions: number; total: number };
export default function Index({ salaryStructures, filters }: { salaryStructures: SalaryStructure[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/salary-structures', { search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this structure?')) router.delete(`/salary-structures/${id}`); };

    return (
        <>
            <Head title="Salary Structures" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><CreditCard className="size-6 text-green-600" /> Salary Structures</h1><p className="text-sm text-muted-foreground">Define teacher salary breakdowns.</p></div>
                    <Button asChild><Link href="/salary-structures/create"><Plus className="mr-2 size-4" /> Add Structure</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/salary-structures'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Teacher</th><th className="px-4 py-3 font-medium">Basic</th><th className="px-4 py-3 font-medium">Allowances</th><th className="px-4 py-3 font-medium">Total</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {salaryStructures.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No salary structures found.</td></tr>
                                : salaryStructures.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.teacher_name}</td>
                                        <td className="px-4 py-3">BDT {Number(item.basic_salary).toLocaleString()}</td>
                                        <td className="px-4 py-3">HR: {Number(item.house_rent).toLocaleString()}<br /><span className="text-xs text-muted-foreground">Med: {Number(item.medical).toLocaleString()} · Trans: {Number(item.transport_allowance).toLocaleString()}</span></td>
                                        <td className="px-4 py-3 font-medium">BDT {Number(item.total).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/salary-structures/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Salary Structures', href: '/salary-structures' }] };
