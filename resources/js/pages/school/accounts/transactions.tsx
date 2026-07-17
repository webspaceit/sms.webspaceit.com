import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Receipt, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Transaction = {
    id: number; type: string; category: string; amount: string; description: string | null;
    date: string; payment_method: string | null; reference: string | null; user: { name: string } | null;
};

type Props = {
    transactions: Transaction[];
    filters: { type?: string; from?: string; to?: string };
};

export default function Transactions({ transactions, filters }: Props) {
    const [typeFilter, setTypeFilter] = useState(filters?.type ?? '');
    const [from, setFrom] = useState(filters?.from ?? '');
    const [to, setTo] = useState(filters?.to ?? '');
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().slice(0, 10),
        payment_method: '',
        reference: '',
    });

    const handleFilter = () => {
        router.get('/accounts/transactions', { type: typeFilter, from, to }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this transaction?')) router.delete(`/accounts/transactions/${id}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/accounts/transactions', { onSuccess: () => { setDialogOpen(false); reset(); } });
    };

    return (
        <>
            <Head title="Transactions" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="size-8" asChild>
                            <a href="/accounts"><ArrowLeft className="size-4" /></a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold flex items-center gap-2">
                                <Receipt className="size-6 text-emerald-600" /> Transactions
                            </h1>
                            <p className="text-sm text-muted-foreground">Record income and expense entries.</p>
                        </div>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 size-4" /> Add Transaction</Button></DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type <span className="text-red-500">*</span></Label>
                                        <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="income">Income</SelectItem>
                                                <SelectItem value="expense">Expense</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Amount <span className="text-red-500">*</span></Label>
                                        <Input type="number" min="0" step="0.01" value={data.amount} onChange={(e) => setData('amount', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category <span className="text-red-500">*</span></Label>
                                    <Input value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="e.g. Tuition Fee, Salary" required />
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Date <span className="text-red-500">*</span></Label>
                                    <Input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Payment Method</Label>
                                        <Select value={data.payment_method} onValueChange={(v) => setData('payment_method', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="bank">Bank</SelectItem>
                                                <SelectItem value="bkash">bKash</SelectItem>
                                                <SelectItem value="nagad">Nagad</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reference</Label>
                                        <Input value={data.reference} onChange={(e) => setData('reference', e.target.value)} placeholder="Ref #" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} />
                                </div>
                                <Button type="submit" disabled={processing}>Record Transaction</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-wrap items-end gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">From</Label>
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-36" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">To</Label>
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-36" />
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleFilter}>Filter</Button>
                </div>

                <section className="rounded-lg border bg-card">
                    {transactions.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Receipt className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No transactions found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Category</th>
                                    <th className="px-4 py-3 font-medium">Type</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Method</th>
                                    <th className="px-4 py-3 font-medium">By</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id} className="border-b last:border-0">
                                        <td className="px-4 py-3">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium">{t.category}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}>
                                                {t.type}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{'৳' + parseFloat(t.amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{t.payment_method ?? '—'}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{t.user?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(t.id)} title="Delete">
                                                <Trash2 className="size-3.5 text-red-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </>
    );
}

Transactions.layout = { breadcrumbs: [{ title: 'Accounts', href: '/accounts' }, { title: 'Transactions', href: '/accounts/transactions' }] };
