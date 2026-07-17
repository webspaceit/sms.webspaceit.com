import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FeeHead = { id: number; name: string; name_bn: string | null; frequency: string; is_optional: boolean; sort_order: number };
type Props = { feeHead?: FeeHead; isEdit: boolean };

const frequencies = ['Monthly', 'Yearly', 'One-Time', 'Termly'];

export default function Form({ feeHead, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: feeHead?.name ?? '',
        name_bn: feeHead?.name_bn ?? '',
        frequency: feeHead?.frequency ?? 'Monthly',
        is_optional: feeHead?.is_optional ?? false,
        sort_order: feeHead?.sort_order?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && feeHead) put(`/fee-heads/${feeHead.id}`);
        else post('/fee-heads');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Fee Head' : 'Create Fee Head'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/fee-heads"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Fee Head' : 'Create Fee Head'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update fee head.' : 'Add a new fee category.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="name">Name (English)</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Tuition Fee" required />{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="name_bn">Name (Bangla)</Label><Input id="name_bn" value={data.name_bn} onChange={(e) => setData('name_bn', e.target.value)} placeholder="e.g. টিউশন ফি" />{errors.name_bn && <p className="text-sm text-red-500">{errors.name_bn}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select value={data.frequency} onValueChange={(val) => setData('frequency', val)}>
                                <SelectTrigger id="frequency"><SelectValue placeholder="Select frequency..." /></SelectTrigger>
                                <SelectContent>{frequencies.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.frequency && <p className="text-sm text-red-500">{errors.frequency}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_optional" checked={data.is_optional as boolean} onChange={(e) => setData('is_optional', e.target.checked)} className="size-4 rounded border-gray-300" />
                        <Label htmlFor="is_optional" className="mb-0">Optional fee (not mandatory)</Label>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/fee-heads">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Fee Heads', href: '/fee-heads' }, { title: 'Manage', href: '' }] };
