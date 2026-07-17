import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    holiday?: { id: number; title: string; date: string; description: string | null };
    isEdit: boolean;
};

export default function Form({ holiday, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: holiday?.title ?? '',
        date: holiday?.date ?? '',
        description: holiday?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && holiday) {
            put(`/holidays/${holiday.id}`);
        } else {
            post('/holidays');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Holiday' : 'Add Holiday'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/holidays"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Holiday' : 'Add Holiday'}</h1>
                        <p className="text-sm text-muted-foreground">{isEdit ? 'Update holiday details.' : 'Add a new school holiday.'}</p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Victory Day" required />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                        <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Optional description..." rows={3} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/holidays">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Holidays', href: '/holidays' }, { title: 'Form', href: '' }] };
