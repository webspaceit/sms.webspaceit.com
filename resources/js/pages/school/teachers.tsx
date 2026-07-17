import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, Plus, Search, Trash2, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Teacher = {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    designation: string;
    phone: string;
    email?: string;
    district: string;
    joining_date: string;
};

export default function Teachers({ teachers, filters }: { teachers: Teacher[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/teachers', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/teachers/${id}`);
        }
    };

    return (
        <>
            <Head title="Teachers" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <UsersRound className="size-6 text-blue-600" />
                            Teachers
                        </h1>
                        <p className="text-sm text-muted-foreground">Faculty directory by department, designation, and contact channel.</p>
                    </div>
                    <Button asChild>
                        <Link href="/teachers/create">
                            <Plus className="mr-2 size-4" /> Add Teacher
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, ID, department, phone or district..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && (
                        <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/teachers'); }}>
                            Clear
                        </Button>
                    )}
                </form>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {teachers.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No teachers found. Add one to get started!
                        </div>
                    ) : (
                        teachers.map((teacher) => (
                            <article key={teacher.id} className="rounded-lg border bg-card p-4 shadow-sm relative">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-semibold">{teacher.name}</h2>
                                        <p className="text-sm text-muted-foreground">{teacher.employee_id}</p>
                                    </div>
                                    <Badge variant="secondary">{teacher.department}</Badge>
                                </div>
                                <dl className="mt-4 grid gap-2 text-sm">
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Role</dt><dd>{teacher.designation}</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Phone</dt><dd>{teacher.phone}</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">District</dt><dd>{teacher.district}</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Joined</dt><dd>{teacher.joining_date}</dd></div>
                                </dl>
                                <div className="mt-3 flex justify-end gap-1.5 border-t pt-3">
                                    <Button size="icon" variant="outline" className="size-7" asChild>
                                        <Link href={`/teachers/${teacher.id}`} title="View Details">
                                            <Eye className="size-3 text-blue-600 dark:text-blue-400" />
                                        </Link>
                                    </Button>
                                    <Button size="icon" variant="outline" className="size-7" asChild>
                                        <Link href={`/teachers/${teacher.id}/edit`} title="Edit Teacher">
                                            <Edit2 className="size-3 text-amber-600 dark:text-amber-400" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="size-7"
                                        onClick={() => handleDelete(teacher.id, teacher.name)}
                                        title="Delete Teacher"
                                    >
                                        <Trash2 className="size-3 text-red-600 dark:text-red-400" />
                                    </Button>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}

Teachers.layout = {
    breadcrumbs: [{ title: 'Teachers', href: '/teachers' }],
};
