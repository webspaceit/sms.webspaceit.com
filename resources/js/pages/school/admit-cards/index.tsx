import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, Plus, Search, Trash2, IdCard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AdmitCardSummary = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
    start_time: string;
    students_count: number;
    created_at: string;
};

type AdmitCardsIndexProps = {
    admitCards: AdmitCardSummary[];
    filters: {
        search?: string;
    };
};

export default function AdmitCardsIndex({ admitCards, filters }: AdmitCardsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admit-cards', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the admit card configuration for ${name}?`)) {
            router.delete(`/admit-cards/${id}`);
        }
    };

    return (
        <>
            <Head title="Admit Card Configurations" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <IdCard className="size-6 text-emerald-500" />
                            Admit Card Configurations
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Generate and print student admit cards complete with photos, QR codes, exam instructions, and schedules.
                        </p>
                    </div>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href="/admit-cards/create">
                            <Plus className="mr-2 size-4" /> Create Admit Card Config
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
                        <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/admit-cards'); }}>
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
                                    <th className="px-4 py-3 font-medium">Start Time</th>
                                    <th className="px-4 py-3 font-medium text-center">Total Students</th>
                                    <th className="px-4 py-3 font-medium">Created At</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admitCards.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            No admit card configurations found. Create one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    admitCards.map((card) => (
                                        <tr key={card.id} className="border-t hover:bg-muted/40 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-foreground">{card.class_name}</div>
                                                <div className="text-xs text-muted-foreground">Section: {card.section}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-foreground">{card.exam_name}</div>
                                                <div className="text-xs text-muted-foreground">Year: {card.academic_year}</div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{card.start_time}</td>
                                            <td className="px-4 py-3 text-center font-medium">{card.students_count}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{card.created_at}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/admit-cards/${card.id}`}>
                                                            <Eye className="mr-1.5 size-3.5" /> Print Cards
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="size-8" asChild>
                                                        <Link href={`/admit-cards/${card.id}/edit`}>
                                                            <Edit2 className="size-3.5 text-blue-500" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() => handleDelete(card.id, `${card.class_name} (${card.section})`)}
                                                    >
                                                        <Trash2 className="size-3.5 text-red-500" />
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
