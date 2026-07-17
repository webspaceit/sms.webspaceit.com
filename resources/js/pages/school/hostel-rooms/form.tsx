import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type HostelRoom = { id: number; room_no: string; type: string; capacity: number; rent_per_bed: number; facilities: string | null };
type Props = { room?: HostelRoom; isEdit: boolean };

const roomTypes = ['Single', 'Double', 'Triple', 'Dormitory'];

export default function Form({ room, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        room_no: room?.room_no ?? '',
        type: room?.type ?? '',
        capacity: room?.capacity?.toString() ?? '',
        rent_per_bed: room?.rent_per_bed?.toString() ?? '',
        facilities: room?.facilities ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && room) put(`/hostel-rooms/${room.id}`);
        else post('/hostel-rooms');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Room' : 'Add Room'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/hostel-rooms"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Hostel Room' : 'Add Hostel Room'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update room details.' : 'Add a new hostel room.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="room_no">Room No</Label><Input id="room_no" value={data.room_no} onChange={(e) => setData('room_no', e.target.value)} placeholder="e.g. 101A" required />{errors.room_no && <p className="text-sm text-red-500">{errors.room_no}</p>}</div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Room Type</Label>
                            <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>{roomTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="capacity">Capacity</Label><Input id="capacity" type="number" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} required />{errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="rent_per_bed">Rent Per Bed (BDT)</Label><Input id="rent_per_bed" type="number" value={data.rent_per_bed} onChange={(e) => setData('rent_per_bed', e.target.value)} required />{errors.rent_per_bed && <p className="text-sm text-red-500">{errors.rent_per_bed}</p>}</div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="facilities">Facilities</Label>
                        <textarea id="facilities" value={data.facilities} onChange={(e) => setData('facilities', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="e.g. Attached bathroom, Fan, Table" />
                        {errors.facilities && <p className="text-sm text-red-500">{errors.facilities}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/hostel-rooms">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Hostel Rooms', href: '/hostel-rooms' }, { title: 'Manage', href: '' }] };
