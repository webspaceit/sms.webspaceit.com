import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    category?: { id: number; name: string; description: string | null };
    isEdit: boolean;
};

export default function Form({ category, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        description: category?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && category) {
            put(`/inventory/categories/${category.id}`);
        } else {
            post('/inventory/categories');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Category' : 'Add Category'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/inventory"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Category' : 'Add Category'}</h1>
                    </div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label>Name <span className="text-red-500">*</span></Label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" asChild><Link href="/inventory">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Inventory', href: '/inventory' }, { title: 'Category', href: '' }] };
