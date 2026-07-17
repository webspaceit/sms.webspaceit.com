import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SalaryPayment = { id: number; teacher_name: string; month: number; year: number; gross_salary: number; deductions: number; net_pay: number; paid_date: string };
export default function Index({ payments, filters }: { payments: SalaryPayment[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/salary-payments', { search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this payment record?')) router.delete(`/salary-payments/${id}`); };

    return (
        <>
            <Head title="Salary Payments" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><DollarSign className="size-6 text-emerald-600" /> Salary Payments</h1><p className="text-sm text-muted-foreground">Teacher salary payment history.</p></div>
                    <Button asChild><Link href="/salary-payments/create"><Plus className="mr-2 size-4" /> Add Payment</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/salary-payments'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Teacher</th><th className="px-4 py-3 font-medium">Period</th><th className="px-4 py-3 font-medium">Gross</th><th className="px-4 py-3 font-medium">Deductions</th><th className="px-4 py-3 font-medium">Net Pay</th><th className="px-4 py-3 font-medium">Paid Date</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No payments found.</td></tr>
                                : payments.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.teacher_name}</td>
                                        <td className="px-4 py-3">Month {item.month}/{item.year}</td>
                                        <td className="px-4 py-3">BDT {Number(item.gross_salary).toLocaleString()}</td>
                                        <td className="px-4 py-3">BDT {Number(item.deductions).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium">BDT {Number(item.net_pay).toLocaleString()}</td>
                                        <td className="px-4 py-3">{item.paid_date}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/salary-payments/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Salary Payments', href: '/salary-payments' }] };
