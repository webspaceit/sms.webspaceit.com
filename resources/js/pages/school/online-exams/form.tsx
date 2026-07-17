import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    onlineExam?: {
        id: number; title: string; class_id: number | null; subject_id: number | null;
        duration_minutes: number; total_marks: number;
        start_time: string | null; end_time: string | null; status: string; instructions: string | null;
    };
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    isEdit: boolean;
};

export default function Form({ onlineExam, classes, subjects, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: onlineExam?.title ?? '',
        class_id: onlineExam?.class_id?.toString() ?? '',
        subject_id: onlineExam?.subject_id?.toString() ?? '',
        duration_minutes: onlineExam?.duration_minutes?.toString() ?? '30',
        total_marks: onlineExam?.total_marks?.toString() ?? '0',
        start_time: onlineExam?.start_time ?? '',
        end_time: onlineExam?.end_time ?? '',
        status: onlineExam?.status ?? 'draft',
        instructions: onlineExam?.instructions ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && onlineExam) {
            put(`/online-exams/${onlineExam.id}`);
        } else {
            post('/online-exams');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Online Exam' : 'Create Online Exam'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/online-exams"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Exam' : 'Create Online Exam'}</h1>
                    </div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label>Title <span className="text-red-500">*</span></Label>
                        <Input value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select value={data.class_id} onValueChange={(v) => setData('class_id', v)}>
                                <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
                                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select value={data.subject_id} onValueChange={(v) => setData('subject_id', v)}>
                                <SelectTrigger><SelectValue placeholder="All subjects" /></SelectTrigger>
                                <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Duration (minutes) <span className="text-red-500">*</span></Label>
                            <Input type="number" min="1" max="480" value={data.duration_minutes} onChange={(e) => setData('duration_minutes', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Marks <span className="text-red-500">*</span></Label>
                            <Input type="number" min="0" value={data.total_marks} onChange={(e) => setData('total_marks', e.target.value)} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input type="datetime-local" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input type="datetime-local" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea value={data.instructions} onChange={(e) => setData('instructions', e.target.value)} rows={3} />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" asChild><Link href="/online-exams">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Online Exams', href: '/online-exams' }, { title: 'Form', href: '' }] };
