import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Complaint = {
    id: number;
    complainant_name: string;
    complainant_phone: string | null;
    description: string;
    type: string;
    status: string;
    resolution_notes: string | null;
    resolver: { id: number; name: string } | null;
    created_at: string;
};

type Props = {
    complaints: Complaint[];
};

const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    investigating: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const typeColor: Record<string, string> = {
    student: 'bg-purple-100 text-purple-800',
    staff: 'bg-cyan-100 text-cyan-800',
    other: 'bg-gray-100 text-gray-800',
};

export default function Index({ complaints }: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete complaint from "${name}"?`)) router.delete(`/complaints/${id}`);
    };

    return (
        <>
            <Head title="Complaints" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <AlertTriangle className="size-6 text-orange-600" /> Complaints
                        </h1>
                        <p className="text-sm text-muted-foreground">Manage complaints from students, staff, and others.</p>
                    </div>
                    <Button asChild>
                        <Link href="/complaints/create"><Plus className="mr-2 size-4" /> Add Complaint</Link>
                    </Button>
                </div>

                <section className="rounded-lg border bg-card">
                    {complaints.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <AlertTriangle className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No complaints yet</p>
                            <p className="text-sm">All complaints will appear here.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Complainant</th>
                                    <th className="px-4 py-3 font-medium">Type</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((c) => (
                                    <tr key={c.id} className="border-b last:border-0">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{c.complainant_name}</p>
                                            {c.complainant_phone && <p className="text-xs text-muted-foreground">{c.complainant_phone}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={typeColor[c.type]}>{c.type}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={statusColor[c.status]}>{c.status}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/complaints/${c.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(c.id, c.complainant_name)} title="Delete">
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

Index.layout = { breadcrumbs: [{ title: 'Complaints', href: '/complaints' }] };
