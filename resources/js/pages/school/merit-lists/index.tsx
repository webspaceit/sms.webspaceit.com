import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, Plus, Search, Trash2, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MeritListSummary = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
    students_count: number;
    created_at: string;
};

type MeritListsIndexProps = {
    meritLists: MeritListSummary[];
    filters: {
        search?: string;
    };
};

export default function MeritListsIndex({ meritLists, filters }: MeritListsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/merit-lists', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the merit list config for ${name}?`)) {
            router.delete(`/merit-lists/${id}`);
        }
    };

    return (
        <>
            <Head title="Section Merit Lists" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Trophy className="size-6 text-amber-500" />
                            Section Wise Merit Lists
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Generate and print ranked student merit lists sorted by total marks with grades and GPAs.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/merit-lists/create">
                            <Plus className="mr-2 size-4" /> Create Merit Config
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
                        <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/merit-lists'); }}>
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
                                    <th className="px-4 py-3 font-medium text-center">Class Strength</th>
                                    <th className="px-4 py-3 font-medium">Created At</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meritLists.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No merit list configurations found. Create one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    meritLists.map((list) => (
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
                                                    variant={list.students_count > 0 ? 'secondary' : 'outline'}
                                                    className="font-semibold px-2 py-0.5"
                                                >
                                                    {list.students_count} Students
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                {list.created_at}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/merit-lists/${list.id}`} title="View Merit List">
                                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/merit-lists/${list.id}/edit`} title="Edit Config">
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

MeritListsIndex.layout = {
    breadcrumbs: [{ title: 'Merit Lists', href: '/merit-lists' }],
};
