import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FeeStructure = { id: number; class_id: number; fee_head_id: number; amount: number };
type Props = { feeStructure?: FeeStructure; classes: { id: number; name: string }[]; feeHeads: { id: number; name: string }[]; isEdit: boolean };

export default function Form({ feeStructure, classes, feeHeads, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        class_id: feeStructure?.class_id?.toString() ?? '',
        fee_head_id: feeStructure?.fee_head_id?.toString() ?? '',
        amount: feeStructure?.amount?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && feeStructure) put(`/fee-structures/${feeStructure.id}`);
        else post('/fee-structures');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Fee Structure' : 'Create Fee Structure'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/fee-structures"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Fee Structure' : 'Create Fee Structure'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update fee structure.' : 'Set fee amount for a class.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class</Label>
                            <Select value={data.class_id} onValueChange={(val) => setData('class_id', val)}>
                                <SelectTrigger id="class_id"><SelectValue placeholder="Select class..." /></SelectTrigger>
                                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fee_head_id">Fee Head</Label>
                            <Select value={data.fee_head_id} onValueChange={(val) => setData('fee_head_id', val)}>
                                <SelectTrigger id="fee_head_id"><SelectValue placeholder="Select fee head..." /></SelectTrigger>
                                <SelectContent>{feeHeads.map((f) => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.fee_head_id && <p className="text-sm text-red-500">{errors.fee_head_id}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (BDT)</Label>
                        <Input id="amount" type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} placeholder="e.g. 1500" required />
                        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/fee-structures">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Fee Structures', href: '/fee-structures' }, { title: 'Manage', href: '' }] };
