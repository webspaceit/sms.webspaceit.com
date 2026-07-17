import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LeaveRequest = { id: number; teacher_id: number; type: string; start_date: string; end_date: string; reason: string | null; status: string; admin_remarks: string | null };
type Props = { leaveRequest?: LeaveRequest; teachers: { id: number; name: string }[]; isEdit: boolean };

const leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Study Leave', 'Other'];
const statuses = ['pending', 'approved', 'rejected'];

export default function Form({ leaveRequest, teachers, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        teacher_id: leaveRequest?.teacher_id?.toString() ?? '',
        type: leaveRequest?.type ?? '',
        start_date: leaveRequest?.start_date ?? '',
        end_date: leaveRequest?.end_date ?? '',
        reason: leaveRequest?.reason ?? '',
        status: leaveRequest?.status ?? 'pending',
        admin_remarks: leaveRequest?.admin_remarks ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && leaveRequest) put(`/leave-requests/${leaveRequest.id}`);
        else post('/leave-requests');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Leave Request' : 'Create Leave Request'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/leave-requests"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Leave Request' : 'New Leave Request'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update leave request.' : 'Submit a leave request.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="teacher_id">Teacher</Label>
                            <Select value={data.teacher_id} onValueChange={(val) => setData('teacher_id', val)}>
                                <SelectTrigger id="teacher_id"><SelectValue placeholder="Select teacher..." /></SelectTrigger>
                                <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.teacher_id && <p className="text-sm text-red-500">{errors.teacher_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Leave Type</Label>
                            <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>{leaveTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="start_date">Start Date</Label><Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />{errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="end_date">End Date</Label><Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} required />{errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}</div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <textarea id="reason" value={data.reason} onChange={(e) => setData('reason', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Describe the reason..." />
                        {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                <SelectTrigger id="status"><SelectValue placeholder="Select status..." /></SelectTrigger>
                                <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin_remarks">Admin Remarks</Label>
                            <Input id="admin_remarks" value={data.admin_remarks} onChange={(e) => setData('admin_remarks', e.target.value)} placeholder="Admin notes..." />
                            {errors.admin_remarks && <p className="text-sm text-red-500">{errors.admin_remarks}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/leave-requests">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Leave Requests', href: '/leave-requests' }, { title: 'Manage', href: '' }] };
