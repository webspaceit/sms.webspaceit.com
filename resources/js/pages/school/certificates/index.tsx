import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, ScrollText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Certificate = { id: number; student_name: string; type: string; certificate_no: string; issue_date: string };
export default function Index({ certificates, filters }: { certificates: Certificate[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/certificates', { search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this certificate?')) router.delete(`/certificates/${id}`); };

    return (
        <>
            <Head title="Certificates" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><ScrollText className="size-6 text-amber-600" /> Certificates</h1><p className="text-sm text-muted-foreground">Issue and manage student certificates.</p></div>
                    <Button asChild><Link href="/certificates/create"><Plus className="mr-2 size-4" /> Issue Certificate</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/certificates'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Certificate No</th><th className="px-4 py-3 font-medium">Issue Date</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {certificates.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No certificates found.</td></tr>
                                : certificates.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.student_name}</td>
                                        <td className="px-4 py-3">{item.type}</td>
                                        <td className="px-4 py-3 text-xs font-mono">{item.certificate_no}</td>
                                        <td className="px-4 py-3">{item.issue_date}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/certificates/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Certificates', href: '/certificates' }] };
