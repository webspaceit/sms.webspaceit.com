import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TransportStop = { id: number; transport_route_id: number; name: string; pickup_time: string | null; drop_time: string | null; sort_order: number };
type Props = { stop?: TransportStop; routes: { id: number; name: string }[]; isEdit: boolean };

export default function Form({ stop, routes, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        transport_route_id: stop?.transport_route_id?.toString() ?? '',
        name: stop?.name ?? '',
        pickup_time: stop?.pickup_time ?? '',
        drop_time: stop?.drop_time ?? '',
        sort_order: stop?.sort_order?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && stop) put(`/transport-stops/${stop.id}`);
        else post('/transport-stops');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Stop' : 'Create Stop'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/transport-stops"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Stop' : 'Create Stop'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update stop details.' : 'Add a new route stop.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="transport_route_id">Route</Label>
                        <Select value={data.transport_route_id} onValueChange={(val) => setData('transport_route_id', val)}>
                            <SelectTrigger id="transport_route_id"><SelectValue placeholder="Select route..." /></SelectTrigger>
                            <SelectContent>{routes.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.transport_route_id && <p className="text-sm text-red-500">{errors.transport_route_id}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="name">Stop Name</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Mirpur-10 Bus Stand" required />{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="sort_order">Sort Order</Label><Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />{errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="pickup_time">Pickup Time</Label><Input id="pickup_time" type="time" value={data.pickup_time} onChange={(e) => setData('pickup_time', e.target.value)} />{errors.pickup_time && <p className="text-sm text-red-500">{errors.pickup_time}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="drop_time">Drop Time</Label><Input id="drop_time" type="time" value={data.drop_time} onChange={(e) => setData('drop_time', e.target.value)} />{errors.drop_time && <p className="text-sm text-red-500">{errors.drop_time}</p>}</div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/transport-stops">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Transport Stops', href: '/transport-stops' }, { title: 'Manage', href: '' }] };
