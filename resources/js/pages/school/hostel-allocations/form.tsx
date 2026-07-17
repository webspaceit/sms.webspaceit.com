import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type HostelAllocation = { id: number; student_id: number; hostel_room_id: number; start_date: string; end_date: string | null; is_active: boolean };
type Props = { allocation?: HostelAllocation; students: { id: number; name: string }[]; rooms: { id: number; room_no: string }[]; isEdit: boolean };

export default function Form({ allocation, students, rooms, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        student_id: allocation?.student_id?.toString() ?? '',
        hostel_room_id: allocation?.hostel_room_id?.toString() ?? '',
        start_date: allocation?.start_date ?? '',
        end_date: allocation?.end_date ?? '',
        is_active: allocation?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && allocation) put(`/hostel-allocations/${allocation.id}`);
        else post('/hostel-allocations');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Allocation' : 'Allocate Room'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/hostel-allocations"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Allocation' : 'Allocate Hostel Room'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update allocation.' : 'Assign a room to a student.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="student_id">Student</Label>
                            <Select value={data.student_id} onValueChange={(val) => setData('student_id', val)}>
                                <SelectTrigger id="student_id"><SelectValue placeholder="Select student..." /></SelectTrigger>
                                <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hostel_room_id">Room</Label>
                            <Select value={data.hostel_room_id} onValueChange={(val) => setData('hostel_room_id', val)}>
                                <SelectTrigger id="hostel_room_id"><SelectValue placeholder="Select room..." /></SelectTrigger>
                                <SelectContent>{rooms.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.room_no}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.hostel_room_id && <p className="text-sm text-red-500">{errors.hostel_room_id}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="start_date">Start Date</Label><Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />{errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="end_date">End Date</Label><Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />{errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" checked={data.is_active as boolean} onChange={(e) => setData('is_active', e.target.checked)} className="size-4 rounded border-gray-300" />
                        <Label htmlFor="is_active" className="mb-0">Active</Label>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/hostel-allocations">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Hostel Allocations', href: '/hostel-allocations' }, { title: 'Manage', href: '' }] };
