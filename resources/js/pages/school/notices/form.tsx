import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Notice = { id: number; title: string; content: string; type: string; target_roles: string | null; published_date: string; expires_date: string | null; is_published: boolean };
type Props = { notice?: Notice; isEdit: boolean };

const noticeTypes = ['General', 'Academic', 'Exam', 'Holiday', 'Event', 'Circular', 'Emergency'];
const targetRoleOptions = ['all', 'teachers', 'students', 'guardians', 'staff'];

export default function Form({ notice, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: notice?.title ?? '',
        content: notice?.content ?? '',
        type: notice?.type ?? 'General',
        target_roles: notice?.target_roles ?? 'all',
        published_date: notice?.published_date ?? '',
        expires_date: notice?.expires_date ?? '',
        is_published: notice?.is_published ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && notice) put(`/notices/${notice.id}`);
        else post('/notices');
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Notice' : 'Create Notice'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/notices"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit Notice' : 'Create Notice'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update notice.' : 'Publish a new notice.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Summer Vacation Notice" required />{errors.title && <p className="text-sm text-red-500">{errors.title}</p>}</div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>{noticeTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea id="content" value={data.content} onChange={(e) => setData('content', e.target.value)} className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Notice content..." required />
                        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="target_roles">Target Audience</Label>
                            <Select value={data.target_roles} onValueChange={(val) => setData('target_roles', val)}>
                                <SelectTrigger id="target_roles"><SelectValue placeholder="Select audience..." /></SelectTrigger>
                                <SelectContent>{targetRoleOptions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.target_roles && <p className="text-sm text-red-500">{errors.target_roles}</p>}
                        </div>
                        <div className="space-y-2"><Label htmlFor="published_date">Published Date</Label><Input id="published_date" type="date" value={data.published_date} onChange={(e) => setData('published_date', e.target.value)} required />{errors.published_date && <p className="text-sm text-red-500">{errors.published_date}</p>}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="expires_date">Expires Date</Label><Input id="expires_date" type="date" value={data.expires_date} onChange={(e) => setData('expires_date', e.target.value)} />{errors.expires_date && <p className="text-sm text-red-500">{errors.expires_date}</p>}</div>
                        <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" id="is_published" checked={data.is_published as boolean} onChange={(e) => setData('is_published', e.target.checked)} className="size-4 rounded border-gray-300" />
                            <Label htmlFor="is_published" className="mb-0">Publish immediately</Label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/notices">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Notices', href: '/notices' }, { title: 'Manage', href: '' }] };
