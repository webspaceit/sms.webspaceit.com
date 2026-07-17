import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Exam = { id: number; name: string; type: string; academic_year_id: number; start_date: string; end_date: string; description: string | null };
type Props = { exam?: Exam; academicYears: { id: number; name: string }[]; isEdit: boolean };

const examTypes = ['Half Yearly', 'Final', 'Pre-Test', 'Test', 'Monthly', 'Weekly', 'Model Test'];

export default function Form({ exam, academicYears, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: exam?.name ?? '',
        type: exam?.type ?? '',
        academic_year_id: exam?.academic_year_id?.toString() ?? '',
        start_date: exam?.start_date ?? '',
        end_date: exam?.end_date ?? '',
        description: exam?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && exam) put(`/exams/${exam.id}`);
        else post('/exams');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Exam' : 'Create Exam'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/exams"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Exam' : 'Create Exam'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update exam information.' : 'Schedule a new exam.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Half Yearly Exam 2026" required />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>{examTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="academic_year_id">Academic Year</Label>
                        <Select value={data.academic_year_id} onValueChange={(val) => setData('academic_year_id', val)}>
                            <SelectTrigger id="academic_year_id"><SelectValue placeholder="Select year..." /></SelectTrigger>
                            <SelectContent>{academicYears.map((y) => <SelectItem key={y.id} value={y.id.toString()}>{y.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.academic_year_id && <p className="text-sm text-red-500">{errors.academic_year_id}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                            {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} required />
                            {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Optional notes..." />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/exams">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Exams', href: '/exams' }, { title: 'Manage', href: '' }] };
