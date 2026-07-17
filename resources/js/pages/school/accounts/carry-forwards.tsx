import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowUpDown, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type CarryForward = {
    id: number; amount: string; reason: string | null; date: string;
    student: { id: number; name: string; student_id: string } | null;
    academic_year: { id: number; name: string } | null;
};

type Props = {
    carryForwards: CarryForward[];
    students: { id: number; name: string; student_id: string }[];
    academicYears: { id: number; name: string }[];
};

export default function CarryForwards({ carryForwards, students, academicYears }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        student_id: '',
        academic_year_id: '',
        amount: '',
        reason: '',
        date: new Date().toISOString().slice(0, 10),
    });

    const handleDelete = (id: number) => {
        if (confirm('Delete this carry forward?')) router.delete(`/accounts/carry-forwards/${id}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/accounts/carry-forwards', { onSuccess: () => { setDialogOpen(false); reset(); } });
    };

    return (
        <>
            <Head title="Fee Carry Forwards" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="size-8" asChild>
                            <a href="/accounts"><ArrowLeft className="size-4" /></a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold flex items-center gap-2">
                                <ArrowUpDown className="size-6 text-emerald-600" /> Fee Carry Forwards
                            </h1>
                            <p className="text-sm text-muted-foreground">Carry forward student fee balances.</p>
                        </div>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild><Button><Plus className="mr-2 size-4" /> Add Carry Forward</Button></DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader><DialogTitle>Add Carry Forward</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Student <span className="text-red-500">*</span></Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select student</option>
                                        {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Academic Year <span className="text-red-500">*</span></Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={data.academic_year_id}
                                            onChange={(e) => setData('academic_year_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Select year</option>
                                            {academicYears.map((ay) => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
                                        </select>
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
                                    <Label>Reason</Label>
                                    <Textarea value={data.reason} onChange={(e) => setData('reason', e.target.value)} rows={2} />
                                </div>
                                <Button type="submit" disabled={processing}>Save</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="rounded-lg border bg-card">
                    {carryForwards.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <ArrowUpDown className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No carry forwards yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Student</th>
                                    <th className="px-4 py-3 font-medium">Academic Year</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Reason</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carryForwards.map((cf) => (
                                    <tr key={cf.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">{cf.student?.name ?? '—'}</td>
                                        <td className="px-4 py-3">{cf.academic_year?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-emerald-600 font-medium">{'৳' + parseFloat(cf.amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{cf.reason ?? '—'}</td>
                                        <td className="px-4 py-3">{new Date(cf.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(cf.id)} title="Delete">
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

CarryForwards.layout = { breadcrumbs: [{ title: 'Accounts', href: '/accounts' }, { title: 'Carry Forwards', href: '/accounts/carry-forwards' }] };
