import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    lessonPlan?: {
        id: number; class_id: number; subject_id: number; teacher_id: number;
        topic: string; topic_overview: string | null; lesson_breakdown: string | null; lesson_date: string | null;
    };
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    teachers: { id: number; name: string }[];
    isEdit: boolean;
};

export default function Form({ lessonPlan, classes, subjects, teachers, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        class_id: lessonPlan?.class_id?.toString() ?? '',
        subject_id: lessonPlan?.subject_id?.toString() ?? '',
        teacher_id: lessonPlan?.teacher_id?.toString() ?? '',
        topic: lessonPlan?.topic ?? '',
        topic_overview: lessonPlan?.topic_overview ?? '',
        lesson_breakdown: lessonPlan?.lesson_breakdown ?? '',
        lesson_date: lessonPlan?.lesson_date ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && lessonPlan) {
            put(`/lesson-plans/${lessonPlan.id}`);
        } else {
            post('/lesson-plans');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Lesson Plan' : 'Add Lesson Plan'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/lesson-plans"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Lesson Plan' : 'Add Lesson Plan'}</h1>
                        <p className="text-sm text-muted-foreground">Plan a lesson for a class and subject.</p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic <span className="text-red-500">*</span></Label>
                        <Input id="topic" value={data.topic} onChange={(e) => setData('topic', e.target.value)} placeholder="e.g. Quadratic Equations" required />
                        {errors.topic && <p className="text-sm text-red-500">{errors.topic}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class <span className="text-red-500">*</span></Label>
                            <Select value={data.class_id} onValueChange={(val) => setData('class_id', val)}>
                                <SelectTrigger id="class_id"><SelectValue placeholder="Select class" /></SelectTrigger>
                                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject_id">Subject <span className="text-red-500">*</span></Label>
                            <Select value={data.subject_id} onValueChange={(val) => setData('subject_id', val)}>
                                <SelectTrigger id="subject_id"><SelectValue placeholder="Select subject" /></SelectTrigger>
                                <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teacher_id">Teacher <span className="text-red-500">*</span></Label>
                            <Select value={data.teacher_id} onValueChange={(val) => setData('teacher_id', val)}>
                                <SelectTrigger id="teacher_id"><SelectValue placeholder="Select teacher" /></SelectTrigger>
                                <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.teacher_id && <p className="text-sm text-red-500">{errors.teacher_id}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lesson_date">Lesson Date</Label>
                        <Input id="lesson_date" type="date" value={data.lesson_date} onChange={(e) => setData('lesson_date', e.target.value)} />
                        {errors.lesson_date && <p className="text-sm text-red-500">{errors.lesson_date}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="topic_overview">Topic Overview</Label>
                        <Textarea id="topic_overview" value={data.topic_overview} onChange={(e) => setData('topic_overview', e.target.value)} placeholder="Brief overview of the topic..." rows={3} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lesson_breakdown">Lesson Breakdown</Label>
                        <Textarea id="lesson_breakdown" value={data.lesson_breakdown} onChange={(e) => setData('lesson_breakdown', e.target.value)} placeholder="Step-by-step breakdown of the lesson..." rows={4} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/lesson-plans">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Lesson Plans', href: '/lesson-plans' }, { title: 'Form', href: '' }] };
