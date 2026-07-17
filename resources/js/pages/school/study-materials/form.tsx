import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    teacher: { id: number; name: string } | null;
    isEdit: boolean;
};

export default function Form({ classes, subjects, teacher, isEdit }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        class_id: '',
        subject_id: '',
        teacher_id: teacher?.id?.toString() ?? '',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/study-materials', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Upload Study Material" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/study-materials"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Upload Study Material</h1>
                        <p className="text-sm text-muted-foreground">Share resources with students and teachers.</p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Chapter 3 Notes" required />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Brief description of the material..." rows={3} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class_id">Class</Label>
                            <Select value={data.class_id} onValueChange={(val) => setData('class_id', val)}>
                                <SelectTrigger id="class_id"><SelectValue placeholder="All classes" /></SelectTrigger>
                                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject_id">Subject</Label>
                            <Select value={data.subject_id} onValueChange={(val) => setData('subject_id', val)}>
                                <SelectTrigger id="subject_id"><SelectValue placeholder="All subjects" /></SelectTrigger>
                                <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">File <span className="text-red-500">*</span></Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.mp4,.mp3"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            className="cursor-pointer"
                            required
                        />
                        <p className="text-xs text-muted-foreground">Allowed: jpg, png, jpeg, pdf, doc, docx, mp4, mp3 (Max 50MB)</p>
                        {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/study-materials">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> Upload
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Study Materials', href: '/study-materials' }, { title: 'Upload', href: '' }] };
