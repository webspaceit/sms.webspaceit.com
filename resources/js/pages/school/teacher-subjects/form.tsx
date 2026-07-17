import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TeacherSubject = { id: number; teacher_id: number; class_id: number; subject_id: number; is_class_teacher: boolean };
type Props = { assignment?: TeacherSubject; teachers: { id: number; name: string }[]; classes: { id: number; name: string }[]; subjects: { id: number; name: string }[]; isEdit: boolean };

export default function Form({ assignment, teachers, classes, subjects, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        teacher_id: assignment?.teacher_id?.toString() ?? '',
        class_id: assignment?.class_id?.toString() ?? '',
        subject_id: assignment?.subject_id?.toString() ?? '',
        is_class_teacher: assignment?.is_class_teacher ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && assignment) put(`/teacher-subjects/${assignment.id}`);
        else post('/teacher-subjects');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Assignment' : 'Create Assignment'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/teacher-subjects"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Assignment' : 'Create Assignment'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update teacher assignment.' : 'Assign a subject to a teacher.'}</p></div>
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
                            <Label htmlFor="class_id">Class</Label>
                            <Select value={data.class_id} onValueChange={(val) => setData('class_id', val)}>
                                <SelectTrigger id="class_id"><SelectValue placeholder="Select class..." /></SelectTrigger>
                                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject_id">Subject</Label>
                            <Select value={data.subject_id} onValueChange={(val) => setData('subject_id', val)}>
                                <SelectTrigger id="subject_id"><SelectValue placeholder="Select subject..." /></SelectTrigger>
                                <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_class_teacher" checked={data.is_class_teacher as boolean} onChange={(e) => setData('is_class_teacher', e.target.checked)} className="size-4 rounded border-gray-300" />
                        <Label htmlFor="is_class_teacher" className="mb-0">Class Teacher</Label>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/teacher-subjects">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Teacher Subjects', href: '/teacher-subjects' }, { title: 'Manage', href: '' }] };
