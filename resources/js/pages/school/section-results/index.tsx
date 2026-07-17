import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, Plus, Search, Trash2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SectionResultSummary = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
    reports_count: number;
    created_at: string;
};

type SectionResultsIndexProps = {
    sectionResults: SectionResultSummary[];
    filters: {
        search?: string;
    };
};

export default function SectionResultsIndex({ sectionResults, filters }: SectionResultsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/section-results', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the section results config for ${name}?`)) {
            router.delete(`/section-results/${id}`);
        }
    };

    return (
        <>
            <Head title="Section Results" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <BookOpen className="size-6 text-indigo-500" />
                            Section Results
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Generate and print consolidated section-wide results sheets showing GPAs, total marks, and grades.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/section-results/create">
                            <Plus className="mr-2 size-4" /> Create Section Results Config
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
                        <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/section-results'); }}>
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
                                    <th className="px-4 py-3 font-medium text-center">Reports Found</th>
                                    <th className="px-4 py-3 font-medium">Created At</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectionResults.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No section results configurations found. Create one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    sectionResults.map((list) => (
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
                                                    variant={list.reports_count > 0 ? 'secondary' : 'outline'}
                                                    className="font-semibold px-2 py-0.5"
                                                >
                                                    {list.reports_count} Reports
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                {list.created_at}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/section-results/${list.id}`} title="View Section Wise Result">
                                                            <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="icon" variant="outline" className="size-8" asChild>
                                                        <Link href={`/section-results/${list.id}/edit`} title="Edit Config">
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

SectionResultsIndex.layout = {
    breadcrumbs: [{ title: 'Section Results', href: '/section-results' }],
};
