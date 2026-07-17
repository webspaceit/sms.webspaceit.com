import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CalendarCheck, Save, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Student = { id: number; name: string; roll_no: number };

type BatchAttendanceProps = {
    students?: Student[];
    classes: { id: number; name: string }[];
    filters?: { class_id?: string; date?: string };
};

export default function BatchAttendance({ students, classes, filters }: BatchAttendanceProps) {
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const [date, setDate] = useState(filters?.date ?? new Date().toISOString().slice(0, 10));
    const [attendance, setAttendance] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);

    const loadStudents = () => {
        router.get('/batch-attendance', { class_id: classId, date }, { preserveState: true });
    };

    const toggleStatus = (studentId: number) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
        }));
    };

    const handleSave = () => {
        if (!classId || !date) return;
        setSaving(true);
        router.post('/batch-attendance', {
            class_id: classId,
            date,
            attendance: Object.entries(attendance).map(([student_id, status]) => ({
                student_id: Number(student_id),
                status,
            })),
        }, {
            onFinish: () => setSaving(false),
        });
    };

    return (
        <>
            <Head title="Batch Attendance" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2"><CalendarCheck className="size-6 text-purple-600" /> Batch Attendance</h1>
                    <p className="text-sm text-muted-foreground">Quickly mark attendance for an entire class.</p>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                    <div className="space-y-2">
                        <Label htmlFor="class_id">Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger id="class_id" className="w-48"><SelectValue placeholder="Select class..." /></SelectTrigger>
                            <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
                    </div>
                    <Button onClick={loadStudents} variant="secondary">Load Students</Button>
                </div>

                {students && students.length > 0 && (
                    <>
                        <section className="rounded-lg border bg-card shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/60 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium w-12">#</th>
                                            <th className="px-4 py-3 font-medium">Student Name</th>
                                            <th className="px-4 py-3 font-medium">Roll</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, idx) => {
                                            const status = attendance[student.id] ?? 'present';
                                            return (
                                                <tr key={student.id} className="border-t hover:bg-muted/40 transition-colors">
                                                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                                    <td className="px-4 py-3 font-medium">{student.name}</td>
                                                    <td className="px-4 py-3">{student.roll_no}</td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleStatus(student.id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors"
                                                        >
                                                            {status === 'present' ? (
                                                                <><Check className="size-4 text-green-600" /> <span className="text-green-700 dark:text-green-400">Present</span></>
                                                            ) : (
                                                                <><X className="size-4 text-red-600" /> <span className="text-red-700 dark:text-red-400">Absent</span></>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving}>
                                <Save className="mr-2 size-4" /> {saving ? 'Saving...' : 'Save Attendance'}
                            </Button>
                        </div>
                    </>
                )}
                {students && students.length === 0 && classId && (
                    <div className="text-center py-12 text-muted-foreground">No students found for the selected class.</div>
                )}
            </main>
        </>
    );
}

BatchAttendance.layout = { breadcrumbs: [{ title: 'Batch Attendance', href: '/batch-attendance' }] };
