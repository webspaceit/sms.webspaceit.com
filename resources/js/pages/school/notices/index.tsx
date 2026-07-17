import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Bell } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Notice = { id: number; title: string; type: string; published_date: string; expires_date: string | null; is_published: boolean };
export default function Index({ notices, filters }: { notices: Notice[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/notices', { search }, { preserveState: true }); };
    const handleDelete = (id: number, title: string) => { if (confirm(`Delete "${title}"?`)) router.delete(`/notices/${id}`); };

    return (
        <>
            <Head title="Notices" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Bell className="size-6 text-red-600" /> Notices</h1><p className="text-sm text-muted-foreground">Publish and manage school notices.</p></div>
                    <Button asChild><Link href="/notices/create"><Plus className="mr-2 size-4" /> Add Notice</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/notices'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Title</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Published</th><th className="px-4 py-3 font-medium">Expires</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {notices.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No notices found.</td></tr>
                                : notices.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.title}</td>
                                        <td className="px-4 py-3"><Badge variant="secondary">{item.type}</Badge></td>
                                        <td className="px-4 py-3">{item.published_date}</td>
                                        <td className="px-4 py-3">{item.expires_date ?? '-'}</td>
                                        <td className="px-4 py-3">{item.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/notices/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id, item.title)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Notices', href: '/notices' }] };
