import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AcademicYear = { id: number; name: string; start_date: string; end_date: string; is_current: boolean };
type Props = { academicYear?: AcademicYear; isEdit: boolean };

export default function Form({ academicYear, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: academicYear?.name ?? '',
        start_date: academicYear?.start_date ?? '',
        end_date: academicYear?.end_date ?? '',
        is_current: academicYear?.is_current ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && academicYear) put(`/academic-years/${academicYear.id}`);
        else post('/academic-years');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Academic Year' : 'Create Academic Year'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/academic-years"><ArrowLeft className="size-4" /></Link></Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Academic Year' : 'Create Academic Year'}</h1>
                        <p className="text-sm text-muted-foreground">{isEdit ? 'Update academic year.' : 'Add a new academic year session.'}</p>
                    </div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. 2026-2027" required />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_current" checked={data.is_current as boolean} onChange={(e) => setData('is_current', e.target.checked)} className="size-4 rounded border-gray-300" />
                        <Label htmlFor="is_current" className="mb-0">Set as current academic year</Label>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/academic-years">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Academic Years', href: '/academic-years' }, { title: 'Manage', href: '' }] };
