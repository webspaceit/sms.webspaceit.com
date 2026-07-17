import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    event?: { id: number; title: string; description: string | null; start_date: string; end_date: string | null; color: string };
    isEdit: boolean;
};

export default function Form({ event, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: event?.title ?? '',
        description: event?.description ?? '',
        start_date: event?.start_date ?? '',
        end_date: event?.end_date ?? '',
        color: event?.color ?? '#00704F',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && event) {
            put(`/events/${event.id}`);
        } else {
            post('/events');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Event' : 'Add Event'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/events"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Event' : 'Add Event'}</h1>
                        <p className="text-sm text-muted-foreground">{isEdit ? 'Update event details.' : 'Add a new school event.'}</p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Annual Sports Day" required />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                            <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                            {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                            {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <div className="flex items-center gap-3">
                            <Input id="color" type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="w-16 h-10 p-1 cursor-pointer" />
                            <span className="text-sm text-muted-foreground">{data.color}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Optional description..." rows={3} />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/events">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Calendar', href: '/events' }, { title: 'Form', href: '' }] };
