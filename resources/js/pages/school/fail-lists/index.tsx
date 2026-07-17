import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, Plus, Search, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FailListSummary = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
    failed_students_count: number;
    created_at: string;
};

type FailListsIndexProps = {
    failLists: FailListSummary[];
    filters: {
        search?: string;
    };
};

export default function FailListsIndex({ failLists, filters }: FailListsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/fail-lists', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the fail list for ${name}?`)) {
            router.delete(`/fail-lists/${id}`);
        }
    };

    return (
        <>
            <Head title="Fail List Summaries" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <AlertTriangle className="size-6 text-amber-500" />
                            Fail List Summaries
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Generate and print consolidated fail list summary reports by class, section, and exam.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/fail-lists/create">
                            <Plus className="mr-2 size-4" /> Create Fail List Config
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by class, section, exam, or year..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters.search && (
                        <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/fail-lists'); }}>
                            Clear
                        </Button>
                    )}
                </form>

                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Class & Section</th>
                                    <th className="px-4 py-3 font-medium">Exam & Year</th>
                                    <th className="px-4 py-3 font-medium text-center">Failed Students</th>
                                    <th className="px-4 py-3 font-medium">Created At</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {failLists.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No fail list configurations found. Create one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    failLists.map((list) => (
                                        <tr key={list.id} className="border-t hover:bg-muted/40 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-foreground">{list.class_name}</p>
                                                <p className="text-xs text-muted-foreground">Section: {list.section}</p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                <p className="font-medium text-foreground">{list.exam_name}</p>
                                                <p className="text-xs">{list.academic_year}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge
                                                    variant={list.failed_students_count > 0 ? 'destructive' : 'secondary'}
                                                    className="font-semibold px-2 py-0.5"
                                                >
                                                    {list.failed_students_count} Failed
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                {list.created_at}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/fail-lists/${list.id}`} title="View Printable Summary">
                                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/fail-lists/${list.id}/edit`} title="Edit Config">
                                                            <Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="size-8"
                                                        onClick={() => handleDelete(list.id, `${list.class_name} - ${list.section}`)}
                                                        title="Delete Config"
                                                    >
                                                        <Trash2 className="size-3.5 text-red-600 dark:text-red-400" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

FailListsIndex.layout = {
    breadcrumbs: [{ title: 'Fail Lists', href: '/fail-lists' }],
};
