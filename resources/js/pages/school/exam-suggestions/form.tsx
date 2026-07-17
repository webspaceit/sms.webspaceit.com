import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    exams: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    teachers: { id: number; name: string }[];
    isEdit: boolean;
};

export default function Form({ exams, subjects, teachers, isEdit }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        exam_id: '',
        subject_id: '',
        teacher_id: '',
        title: '',
        suggestion: '',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/exam-suggestions', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Add Exam Suggestion" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/exam-suggestions"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Add Exam Suggestion</h1>
                        <p className="text-sm text-muted-foreground">Upload suggestion materials for an exam subject.</p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Chapter 3-5 Suggestions" required />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="exam_id">Exam <span className="text-red-500">*</span></Label>
                            <Select value={data.exam_id} onValueChange={(val) => setData('exam_id', val)}>
                                <SelectTrigger id="exam_id"><SelectValue placeholder="Select exam" /></SelectTrigger>
                                <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.exam_id && <p className="text-sm text-red-500">{errors.exam_id}</p>}
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
                        <Label htmlFor="suggestion">Suggestion Details</Label>
                        <Textarea id="suggestion" value={data.suggestion} onChange={(e) => setData('suggestion', e.target.value)} placeholder="Describe the suggestion content..." rows={4} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">File (Optional)</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".jpg,.png,.jpeg,.pdf,.doc,.docx"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">Allowed: jpg, png, jpeg, pdf, doc, docx (Max 50MB)</p>
                        {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/exam-suggestions">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> Upload
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Exam Suggestions', href: '/exam-suggestions' }, { title: 'Add', href: '' }] };
