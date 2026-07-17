import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Student = {
    id: number;
    name: string;
    class_name: string;
    roll_no: number;
};

type AttendanceRecord = {
    id: number;
    student_id: number;
    date: string;
    status: string;
    marked_by: string;
};

type AttendanceFormProps = {
    attendance?: AttendanceRecord;
    students: Student[];
    isEdit: boolean;
};

const statuses = ['present', 'absent', 'late', 'holiday'];

export default function AttendanceForm({ attendance, students, isEdit }: AttendanceFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        student_id: attendance?.student_id?.toString() ?? '',
        date: attendance?.date ?? '',
        status: attendance?.status ?? 'present',
        marked_by: attendance?.marked_by ?? 'Class Teacher',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...data,
            student_id: Number(data.student_id),
        };
        if (isEdit && attendance) {
            put(`/attendance/${attendance.id}`);
        } else {
            post('/attendance');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Attendance' : 'Mark Attendance'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-2xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/attendance">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Attendance Record' : 'Mark Attendance'}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit ? 'Update an attendance record.' : 'Record student attendance for today.'}
                        </p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="student_id">Student</Label>
                        {isEdit && attendance ? (
                            <Input
                                disabled
                                value={students.find((s) => s.id === attendance.student_id)?.name ?? ''}
                                className="bg-muted"
                            />
                        ) : (
                            <Select
                                value={data.student_id}
                                onValueChange={(val) => setData('student_id', val)}
                            >
                                <SelectTrigger id="student_id">
                                    <SelectValue placeholder="Choose a student..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id.toString()}>
                                            {student.name} ({student.class_name} · Roll {student.roll_no})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                            />
                            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="marked_by">Marked By</Label>
                        <Input
                            id="marked_by"
                            value={data.marked_by}
                            onChange={(e) => setData('marked_by', e.target.value)}
                            placeholder="e.g. Class Teacher"
                        />
                        {errors.marked_by && <p className="text-sm text-red-500">{errors.marked_by}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/attendance">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update Attendance' : 'Save Attendance'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

AttendanceForm.layout = {
    breadcrumbs: [
        { title: 'Attendance', href: '/attendance' },
        { title: 'Manage', href: '' },
    ],
};
