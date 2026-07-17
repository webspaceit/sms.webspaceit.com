import { Head, Link, router } from '@inertiajs/react';
import { CalendarCheck, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Holiday = {
    id: number;
    title: string;
    date: string;
    description: string | null;
};

type Props = {
    holidays: Holiday[];
};

export default function Index({ holidays }: Props) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Delete holiday "${title}"?`)) router.delete(`/holidays/${id}`);
    };

    return (
        <>
            <Head title="Holidays" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <CalendarCheck className="size-6 text-emerald-600" /> Holidays
                        </h1>
                        <p className="text-sm text-muted-foreground">Manage school holidays and non-academic days.</p>
                    </div>
                    <Button asChild>
                        <Link href="/holidays/create"><Plus className="mr-2 size-4" /> Add Holiday</Link>
                    </Button>
                </div>

                <section className="rounded-lg border bg-card">
                    {holidays.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <CalendarCheck className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No holidays yet</p>
                            <p className="text-sm">Add the first holiday.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Title</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holidays.map((h) => (
                                    <tr key={h.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">{h.title}</td>
                                        <td className="px-4 py-3">{new Date(h.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{h.description ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/holidays/${h.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(h.id, h.title)} title="Delete">
                                                    <Trash2 className="size-3.5 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Holidays', href: '/holidays' }] };
