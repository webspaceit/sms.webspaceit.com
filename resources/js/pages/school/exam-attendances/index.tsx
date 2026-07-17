import { Head, router, useForm } from '@inertiajs/react';
import { ClipboardCheck, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type StudentAttendance = {
    student_id: number;
    student_name: string;
    roll_no: number;
    student_id_display: string;
    present: boolean;
    attendance_id: number | null;
};

type Props = {
    exams: { id: number; name: string }[];
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    attendances: StudentAttendance[];
    filters: { exam_id?: string; class_id?: string; subject_id?: string };
    selectedExam: { id: number; name: string } | null;
    selectedClass: { id: number; name: string } | null;
    selectedSubject: { id: number; name: string } | null;
};

export default function Index({ exams, classes, subjects, attendances, filters, selectedExam, selectedClass, selectedSubject }: Props) {
    const [examId, setExamId] = useState(filters?.exam_id ?? '');
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const [subjectId, setSubjectId] = useState(filters?.subject_id ?? '');

    const { data, setData, post, processing } = useForm({
        exam_id: selectedExam?.id?.toString() ?? '',
        subject_id: selectedSubject?.id?.toString() ?? '',
        class_id: selectedClass?.id?.toString() ?? '',
        attendances: attendances.map((a) => ({ student_id: a.student_id, present: a.present })),
    });

    const handleLoad = () => {
        router.get('/exam-attendances', { exam_id: examId, class_id: classId, subject_id: subjectId }, { preserveState: true });
    };

    const togglePresent = (studentId: number) => {
        setData('attendances', data.attendances.map((a) =>
            a.student_id === studentId ? { ...a, present: !a.present } : a
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/exam-attendances', { preserveState: true });
    };

    return (
        <>
            <Head title="Exam Attendance" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <ClipboardCheck className="size-6 text-emerald-600" /> Exam Attendance
                        </h1>
                        <p className="text-sm text-muted-foreground">Mark student attendance during exams.</p>
                    </div>
                </div>

                <form onSubmit={handleLoad} className="flex flex-wrap items-end gap-3">
                    <div className="space-y-1">
                        <Label>Exam</Label>
                        <Select value={examId} onValueChange={setExamId}>
                            <SelectTrigger className="w-44"><SelectValue placeholder="Select exam" /></SelectTrigger>
                            <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="w-44"><SelectValue placeholder="Select class" /></SelectTrigger>
                            <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Subject</Label>
                        <Select value={subjectId} onValueChange={setSubjectId}>
                            <SelectTrigger className="w-44"><SelectValue placeholder="Select subject" /></SelectTrigger>
                            <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={!examId || !classId || !subjectId}>
                        <Search className="mr-2 size-4" /> Load Students
                    </Button>
                </form>

                {attendances.length > 0 && (
                    <form onSubmit={handleSubmit} className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Roll</TableHead>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-center">Present</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendances.map((a) => (
                                    <TableRow key={a.student_id}>
                                        <TableCell>{a.roll_no}</TableCell>
                                        <TableCell className="font-mono text-xs">{a.student_id_display}</TableCell>
                                        <TableCell>{a.student_name}</TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                type="button"
                                                variant={a.present ? 'default' : 'outline'}
                                                size="sm"
                                                className={a.present ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                                onClick={() => togglePresent(a.student_id)}
                                            >
                                                {a.present ? 'Present' : 'Absent'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-4 border-t flex justify-end">
                            <Button type="submit" disabled={processing}>Save Attendance</Button>
                        </div>
                    </form>
                )}
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Exam Attendance', href: '/exam-attendances' }] };
