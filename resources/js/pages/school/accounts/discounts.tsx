import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Percent, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Discount = {
    id: number; amount: string; reason: string; date: string;
    student: { id: number; name: string; student_id: string } | null;
    fee_head: { id: number; name: string } | null;
    approver: { id: number; name: string } | null;
};

type Props = {
    discounts: Discount[];
    students: { id: number; name: string; student_id: string }[];
    feeHeads: { id: number; name: string }[];
};

export default function Discounts({ discounts, students, feeHeads }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        student_id: '',
        fee_head_id: '',
        amount: '',
        reason: '',
        date: new Date().toISOString().slice(0, 10),
    });

    const handleDelete = (id: number) => {
        if (confirm('Delete this discount?')) router.delete(`/accounts/discounts/${id}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/accounts/discounts', { onSuccess: () => { setDialogOpen(false); reset(); } });
    };

    return (
        <>
            <Head title="Fee Discounts" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="size-8" asChild>
                            <a href="/accounts"><ArrowLeft className="size-4" /></a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold flex items-center gap-2">
                                <Percent className="size-6 text-emerald-600" /> Fee Discounts
                            </h1>
                            <p className="text-sm text-muted-foreground">Apply discounts to student fees.</p>
                        </div>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 size-4" /> Add Discount</Button></DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader><DialogTitle>Apply Fee Discount</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Student <span className="text-red-500">*</span></Label>
                                    <Select value={data.student_id} onValueChange={(v) => setData('student_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                                        <SelectContent>
                                            {students.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name} ({s.student_id})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Fee Head <span className="text-red-500">*</span></Label>
                                        <Select value={data.fee_head_id} onValueChange={(v) => setData('fee_head_id', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {feeHeads.map((fh) => <SelectItem key={fh.id} value={fh.id.toString()}>{fh.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Amount <span className="text-red-500">*</span></Label>
                                        <Input type="number" min="0" step="0.01" value={data.amount} onChange={(e) => setData('amount', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date <span className="text-red-500">*</span></Label>
                                    <Input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reason <span className="text-red-500">*</span></Label>
                                    <Textarea value={data.reason} onChange={(e) => setData('reason', e.target.value)} placeholder="Why is this discount applied?" required rows={2} />
                                </div>
                                <Button type="submit" disabled={processing}>Apply Discount</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="rounded-lg border bg-card">
                    {discounts.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Percent className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No discounts applied yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Student</th>
                                    <th className="px-4 py-3 font-medium">Fee Head</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Reason</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Approved By</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discounts.map((d) => (
                                    <tr key={d.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">{d.student?.name ?? '—'}</td>
                                        <td className="px-4 py-3">{d.fee_head?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-emerald-600 font-medium">{'৳' + parseFloat(d.amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{d.reason}</td>
                                        <td className="px-4 py-3">{new Date(d.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{d.approver?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(d.id)} title="Delete">
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

Discounts.layout = { breadcrumbs: [{ title: 'Accounts', href: '/accounts' }, { title: 'Fee Discounts', href: '/accounts/discounts' }] };
