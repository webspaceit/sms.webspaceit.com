import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TransportRoute = { id: number; name: string; driver_name: string; driver_phone: string; vehicle_no: string; fare: number; description: string | null };
type Props = { route?: TransportRoute; isEdit: boolean };

export default function Form({ route, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: route?.name ?? '',
        driver_name: route?.driver_name ?? '',
        driver_phone: route?.driver_phone ?? '',
        vehicle_no: route?.vehicle_no ?? '',
        fare: route?.fare?.toString() ?? '',
        description: route?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && route) put(`/transport-routes/${route.id}`);
        else post('/transport-routes');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Route' : 'Create Route'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/transport-routes"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Transport Route' : 'Create Transport Route'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update route details.' : 'Add a new transport route.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="name">Route Name</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Mirpur-12" required />{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="vehicle_no">Vehicle No</Label><Input id="vehicle_no" value={data.vehicle_no} onChange={(e) => setData('vehicle_no', e.target.value)} placeholder="e.g. Dhaka Metro-12-3456" required />{errors.vehicle_no && <p className="text-sm text-red-500">{errors.vehicle_no}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="driver_name">Driver Name</Label><Input id="driver_name" value={data.driver_name} onChange={(e) => setData('driver_name', e.target.value)} placeholder="e.g. Md. Karim" required />{errors.driver_name && <p className="text-sm text-red-500">{errors.driver_name}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="driver_phone">Driver Phone</Label><Input id="driver_phone" value={data.driver_phone} onChange={(e) => setData('driver_phone', e.target.value)} placeholder="e.g. 017XXXXXXXX" required />{errors.driver_phone && <p className="text-sm text-red-500">{errors.driver_phone}</p>}</div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fare">Monthly Fare (BDT)</Label>
                        <Input id="fare" type="number" value={data.fare} onChange={(e) => setData('fare', e.target.value)} placeholder="e.g. 1500" required />
                        {errors.fare && <p className="text-sm text-red-500">{errors.fare}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Route description..." />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/transport-routes">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Transport Routes', href: '/transport-routes' }, { title: 'Manage', href: '' }] };
