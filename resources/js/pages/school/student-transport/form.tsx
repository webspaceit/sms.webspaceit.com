import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type StudentTransport = { id: number; student_id: number; transport_route_id: number; transport_stop_id: number; start_date: string; end_date: string | null; is_active: boolean };
type Props = { assignment?: StudentTransport; students: { id: number; name: string }[]; routes: { id: number; name: string }[]; stops: { id: number; name: string }[]; isEdit: boolean };

export default function Form({ assignment, students, routes, stops, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        student_id: assignment?.student_id?.toString() ?? '',
        transport_route_id: assignment?.transport_route_id?.toString() ?? '',
        transport_stop_id: assignment?.transport_stop_id?.toString() ?? '',
        start_date: assignment?.start_date ?? '',
        end_date: assignment?.end_date ?? '',
        is_active: assignment?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && assignment) put(`/student-transport/${assignment.id}`);
        else post('/student-transport');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Assignment' : 'Create Assignment'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/student-transport"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Transport Assignment' : 'Assign Transport'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update assignment.' : 'Assign a transport route to a student.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="student_id">Student</Label>
                            <Select value={data.student_id} onValueChange={(val) => setData('student_id', val)}>
                                <SelectTrigger id="student_id"><SelectValue placeholder="Select student..." /></SelectTrigger>
                                <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transport_route_id">Route</Label>
                            <Select value={data.transport_route_id} onValueChange={(val) => setData('transport_route_id', val)}>
                                <SelectTrigger id="transport_route_id"><SelectValue placeholder="Select route..." /></SelectTrigger>
                                <SelectContent>{routes.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.transport_route_id && <p className="text-sm text-red-500">{errors.transport_route_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transport_stop_id">Stop</Label>
                            <Select value={data.transport_stop_id} onValueChange={(val) => setData('transport_stop_id', val)}>
                                <SelectTrigger id="transport_stop_id"><SelectValue placeholder="Select stop..." /></SelectTrigger>
                                <SelectContent>{stops.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.transport_stop_id && <p className="text-sm text-red-500">{errors.transport_stop_id}</p>}
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
                        <Button variant="outline" type="button" asChild><Link href="/student-transport">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Student Transport', href: '/student-transport' }, { title: 'Manage', href: '' }] };
