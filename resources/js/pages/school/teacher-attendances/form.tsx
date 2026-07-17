import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TeacherAttendance = { id: number; teacher_id: number; date: string; status: string; remarks: string | null };
type Props = { attendance?: TeacherAttendance; teachers: { id: number; name: string }[]; isEdit: boolean };

const statuses = ['present', 'absent', 'late', 'leave'];

export default function Form({ attendance, teachers, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        teacher_id: attendance?.teacher_id?.toString() ?? '',
        date: attendance?.date ?? '',
        status: attendance?.status ?? 'present',
        remarks: attendance?.remarks ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && attendance) put(`/teacher-attendances/${attendance.id}`);
        else post('/teacher-attendances');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Attendance' : 'Mark Attendance'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/teacher-attendances"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Attendance' : 'Mark Teacher Attendance'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update attendance record.' : 'Record teacher attendance.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="teacher_id">Teacher</Label>
                        <Select value={data.teacher_id} onValueChange={(val) => setData('teacher_id', val)}>
                            <SelectTrigger id="teacher_id"><SelectValue placeholder="Select teacher..." /></SelectTrigger>
                            <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.teacher_id && <p className="text-sm text-red-500">{errors.teacher_id}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                <SelectTrigger id="status"><SelectValue placeholder="Select status..." /></SelectTrigger>
                                <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="remarks">Remarks</Label>
                        <Input id="remarks" value={data.remarks} onChange={(e) => setData('remarks', e.target.value)} placeholder="Optional remarks..." />
                        {errors.remarks && <p className="text-sm text-red-500">{errors.remarks}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/teacher-attendances">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Teacher Attendance', href: '/teacher-attendances' }, { title: 'Manage', href: '' }] };
