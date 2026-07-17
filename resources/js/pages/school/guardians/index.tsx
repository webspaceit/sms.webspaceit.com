import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

type StudentInfo = {
    id: number;
    student_id: string;
    name: string;
    roll_no: number;
    class_name: string;
    section: string;
    schoolClass?: { id: number; name: string } | null;
};

type Guardian = {
    id: number;
    name: string;
    name_bn: string | null;
    phone: string;
    relation: string;
    district: string;
    students: StudentInfo[];
};

type SchoolClass = { id: number; name: string };
type SchoolSection = { id: number; name: string; class_id: number };

export default function Index({
    guardians,
    classes,
    sections,
    filters,
}: {
    guardians: Guardian[];
    classes: SchoolClass[];
    sections: SchoolSection[];
    filters?: { search?: string; class_id?: string; section_id?: string };
}) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const [sectionId, setSectionId] = useState(filters?.section_id ?? '');

    const filteredSections = useMemo(
        () => sections.filter((s) => !classId || s.class_id === Number(classId)),
        [sections, classId],
    );

    const classOptions = useMemo(
        () => classes.map((c) => ({ value: String(c.id), label: c.name })),
        [classes],
    );

    const sectionOptions = useMemo(
        () => filteredSections.map((s) => ({ value: String(s.id), label: s.name })),
        [filteredSections],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/guardians', { search, class_id: classId, section_id: sectionId }, { preserveState: true });
    };

    const handleClear = () => {
        setSearch('');
        setClassId('');
        setSectionId('');
        router.get('/guardians');
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete ${name}?`)) router.delete(`/guardians/${id}`);
    };

    const hasFilters = !!(filters?.search || filters?.class_id || filters?.section_id);

    return (
        <>
            <Head title="Guardians" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Users className="size-6 text-teal-600" /> Guardians
                        </h1>
                        <p className="text-sm text-muted-foreground">Parent and guardian directory with linked students.</p>
                    </div>
                    <Button asChild>
                        <Link href="/guardians/create"><Plus className="mr-2 size-4" /> Add Guardian</Link>
                    </Button>
                </div>

                <section className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b bg-muted/30 px-5 py-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2"><Search className="size-4" /> Search</h3>
                    </div>
                    <div className="p-5">
                        <form onSubmit={handleSearch}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>Class</Label>
                                    <SearchableSelect
                                        options={classOptions}
                                        value={classId}
                                        onChange={(v) => { setClassId(v); setSectionId(''); }}
                                        placeholder="All classes"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Section</Label>
                                    <SearchableSelect
                                        options={sectionOptions}
                                        value={sectionId}
                                        onChange={(v) => setSectionId(v)}
                                        placeholder="All sections"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="search">Search Guardian</Label>
                                    <Input
                                        id="search"
                                        placeholder="Name, phone, email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" variant="default" size="sm">
                                        <Search className="mr-1.5 size-3.5" /> Search
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Phone</th>
                                    <th className="px-4 py-3 font-medium">Relation</th>
                                    <th className="px-4 py-3 font-medium">District</th>
                                    <th className="px-4 py-3 font-medium">Linked Students</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guardians.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                            No guardians found.
                                        </td>
                                    </tr>
                                ) : guardians.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3">{item.phone}</td>
                                        <td className="px-4 py-3">{item.relation}</td>
                                        <td className="px-4 py-3">{item.district}</td>
                                        <td className="px-4 py-3">
                                            {item.students.length === 0 ? (
                                                <span className="text-muted-foreground text-xs">None</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.students.map((s) => (
                                                        <span
                                                            key={s.id}
                                                            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                        >
                                                            {(s.schoolClass?.name ?? s.class_name) || '-'}-{s.section || '-'} ({s.roll_no})
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild>
                                                    <Link href={`/guardians/${item.id}`} title="View Details">
                                                        <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                    </Link>
                                                </Button>
                                                <Button size="icon" variant="outline" className="size-8" asChild>
                                                    <Link href={`/guardians/${item.id}/edit`} title="Edit">
                                                        <Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="size-8"
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="size-3.5 text-red-600 dark:text-red-400" />
                                                </Button>
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

Index.layout = { breadcrumbs: [{ title: 'Guardians', href: '/guardians' }] };