import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Banknote, Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Reconciliation = {
    id: number; account_name: string; account_number: string | null; statement_date: string;
    ending_balance: string; cleared_balance: string; difference: string; status: string; notes: string | null;
};

type Props = {
    reconciliations: Reconciliation[];
};

const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    cleared: 'bg-emerald-100 text-emerald-800',
    discrepancy: 'bg-red-100 text-red-800',
};

export default function Reconciliations({ reconciliations }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: 0,
        account_name: '',
        account_number: '',
        statement_date: new Date().toISOString().slice(0, 10),
        ending_balance: '',
        cleared_balance: '',
        status: 'pending',
        notes: '',
    });

    const isEditing = data.id > 0;

    const handleDelete = (id: number) => {
        if (confirm('Delete this reconciliation?')) router.delete(`/accounts/reconciliations/${id}`);
    };

    const openEdit = (r: Reconciliation) => {
        setData({
            id: r.id, account_name: r.account_name, account_number: r.account_number ?? '',
            statement_date: r.statement_date, ending_balance: r.ending_balance,
            cleared_balance: r.cleared_balance, status: r.status, notes: r.notes ?? '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/accounts/reconciliations/${data.id}`, { onSuccess: () => { setDialogOpen(false); reset(); setData('id', 0); } });
        } else {
            post('/accounts/reconciliations', { onSuccess: () => { setDialogOpen(false); reset(); } });
        }
    };

    return (
        <>
            <Head title="Bank Reconciliations" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="size-8" asChild>
                            <a href="/accounts"><ArrowLeft className="size-4" /></a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold flex items-center gap-2">
                                <Banknote className="size-6 text-emerald-600" /> Bank Reconciliations
                            </h1>
                            <p className="text-sm text-muted-foreground">Reconcile bank statements with books.</p>
                        </div>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { reset(); setData('id', 0); }}><Plus className="mr-2 size-4" /> Add Reconciliation</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader><DialogTitle>{isEditing ? 'Edit Reconciliation' : 'Add Reconciliation'}</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Account Name <span className="text-red-500">*</span></Label>
                                        <Input value={data.account_name} onChange={(e) => setData('account_name', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Account Number</Label>
                                        <Input value={data.account_number} onChange={(e) => setData('account_number', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Statement Date <span className="text-red-500">*</span></Label>
                                    <Input type="date" value={data.statement_date} onChange={(e) => setData('statement_date', e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Ending Balance <span className="text-red-500">*</span></Label>
                                        <Input type="number" step="0.01" value={data.ending_balance} onChange={(e) => setData('ending_balance', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cleared Balance <span className="text-red-500">*</span></Label>
                                        <Input type="number" step="0.01" value={data.cleared_balance} onChange={(e) => setData('cleared_balance', e.target.value)} required />
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="cleared">Cleared</SelectItem>
                                                <SelectItem value="discrepancy">Discrepancy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={2} />
                                </div>
                                <Button type="submit" disabled={processing}>{isEditing ? 'Update' : 'Save'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="rounded-lg border bg-card">
                    {reconciliations.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Banknote className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No reconciliations yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Account</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Ending Balance</th>
                                    <th className="px-4 py-3 font-medium">Cleared Balance</th>
                                    <th className="px-4 py-3 font-medium">Difference</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reconciliations.map((r) => {
                                    const diff = parseFloat(r.difference);
                                    return (
                                        <tr key={r.id} className="border-b last:border-0">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{r.account_name}</p>
                                                {r.account_number && <p className="text-xs text-muted-foreground">{r.account_number}</p>}
                                            </td>
                                            <td className="px-4 py-3">{new Date(r.statement_date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{'৳' + parseFloat(r.ending_balance).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3">{'৳' + parseFloat(r.cleared_balance).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                                            <td className={`px-4 py-3 font-medium ${diff !== 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {diff !== 0 ? '+' : ''}{'৳' + diff.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={statusColor[r.status]}>{r.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(r)} title="Edit">
                                                        <Edit3 className="size-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(r.id)} title="Delete">
                                                        <Trash2 className="size-3.5 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </>
    );
}

Reconciliations.layout = { breadcrumbs: [{ title: 'Accounts', href: '/accounts' }, { title: 'Reconciliations', href: '/accounts/reconciliations' }] };
