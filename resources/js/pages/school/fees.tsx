import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search, Users, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

type Student = {
    id: number;
    admission_no: string;
    name: string;
    class_name: string;
    section_name: string | null;
    guardian_name: string | null;
    date_of_birth: string | null;
    mobile_number: string | null;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type Cls = { id: number; name: string };
type Sec = { id: number; name: string; class_id: number };

type FeesPageProps = {
    students: PaginatedData<Student>;
    classes: Cls[];
    allSections: Sec[];
    filters: { class_id?: string; section_id?: string; search_text?: string; per_page?: string };
};

export default function Fees({ students, classes, allSections, filters }: FeesPageProps) {
    const [localClassId, setLocalClassId] = useState(filters?.class_id ?? '');
    const [localSectionId, setLocalSectionId] = useState(filters?.section_id ?? '');
    const [localSearchText, setLocalSearchText] = useState(filters?.search_text ?? '');
    const [perPage, setPerPage] = useState(filters?.per_page ?? '20');

    const filteredSections = useMemo(() => {
        if (!localClassId) return [];
        return allSections.filter((s) => String(s.class_id) === localClassId);
    }, [allSections, localClassId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/fees', {
            class_id: localClassId,
            section_id: localSectionId,
            per_page: perPage,
        });
    };

    const handleKeywordSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/fees', { search_text: localSearchText, per_page: perPage });
    };

    const clearFilters = () => {
        setLocalClassId('');
        setLocalSectionId('');
        setLocalSearchText('');
        setPerPage('20');
        router.get('/fees');
    };

    const handlePage = (url: string | null) => {
        if (!url) return;
        const qs = url.includes('?') ? url.split('?')[1] : '';
        const params = new URLSearchParams(qs);
        router.get('/fees', {
            class_id: localClassId,
            section_id: localSectionId,
            search_text: localSearchText,
            per_page: perPage,
            page: params.get('page') || '1',
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Fees" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                        <span className="size-7 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center text-base">💰</span>
                        Fees
                    </h1>
                    <Button asChild>
                        <Link href="/fees/create">
                            <Plus className="mr-2 size-4" /> Collect Fee
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b bg-muted/30 px-5 py-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Search className="size-4 text-muted-foreground" />
                            Select Criteria
                        </h3>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form onSubmit={handleSearch} className="flex items-end gap-3">
                                <div className="space-y-1 min-w-0 flex-1">
                                    <Label>
                                        Class <span className="text-red-500">*</span>
                                    </Label>
                                    <SearchableSelect
                                        options={classes.map((c) => ({ value: String(c.id), label: c.name }))}
                                        value={localClassId}
                                        onChange={(val) => { setLocalClassId(val); setLocalSectionId(''); }}
                                        placeholder="Select class..."
                                    />
                                </div>
                                <div className="space-y-1 min-w-0 flex-1">
                                    <Label>Section</Label>
                                    <SearchableSelect
                                        options={filteredSections.map((s) => ({ value: String(s.id), label: s.name }))}
                                        value={localSectionId}
                                        onChange={setLocalSectionId}
                                        placeholder={localClassId ? 'Select section...' : 'Select class first...'}
                                        disabled={!localClassId}
                                    />
                                </div>
                                {localClassId && (
                                    <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                                        Clear
                                    </Button>
                                )}
                                <Button type="submit" size="sm">
                                    <Search className="size-4" /> Search
                                </Button>
                            </form>

                            <form onSubmit={handleKeywordSearch} className="flex items-end gap-3">
                                <div className="space-y-1 min-w-0 flex-[2]">
                                    <Label>Search By Keyword</Label>
                                    <Input
                                        value={localSearchText}
                                        onChange={(e) => setLocalSearchText(e.target.value)}
                                        placeholder="Student Name, Roll Number, Admission No..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Show</Label>
                                    <select
                                        value={perPage}
                                        onChange={(e) => setPerPage(e.target.value)}
                                        className="flex h-9 w-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <Button type="submit" size="sm">
                                    <Search className="size-4" /> Search
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b bg-muted/30 px-5 py-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Users className="size-4 text-muted-foreground" />
                            Student List
                        </h3>
                    </div>
                    <div className="overflow-x-auto p-0">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Class</th>
                                    <th className="px-4 py-3 font-medium">Section</th>
                                    <th className="px-4 py-3 font-medium">Admission No</th>
                                    <th className="px-4 py-3 font-medium">Student Name</th>
                                    <th className="px-4 py-3 font-medium">Father Name</th>
                                    <th className="px-4 py-3 font-medium">Date Of Birth</th>
                                    <th className="px-4 py-3 font-medium">Mobile No.</th>
                                    <th className="px-4 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    students.data.map((student) => (
                                        <tr key={student.id} className="border-t hover:bg-muted/40 transition-colors">
                                            <td className="px-4 py-3">{student.class_name}</td>
                                            <td className="px-4 py-3">{student.section_name}</td>
                                            <td className="px-4 py-3">{student.admission_no}</td>
                                            <td className="px-4 py-3 font-medium">{student.name}</td>
                                            <td className="px-4 py-3">{student.guardian_name}</td>
                                            <td className="px-4 py-3">{student.date_of_birth}</td>
                                            <td className="px-4 py-3">{student.mobile_number}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Button size="sm" variant="secondary" asChild>
                                                    <Link href={`/fees/create?student_id=${student.id}`}>
                                                        Collect Fees
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {students.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
                            <p className="text-muted-foreground">
                                Showing <span className="font-medium">{students.from}</span>–<span className="font-medium">{students.to}</span> of{' '}
                                <span className="font-medium">{students.total.toLocaleString()}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                {students.links.map((link, i) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => handlePage(link.url)}
                                            >
                                                <ChevronLeft className="size-4" />
                                            </Button>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => handlePage(link.url)}
                                            >
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => handlePage(link.url)}
                                        >
                                            {link.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

Fees.layout = {
    breadcrumbs: [{ title: 'Fees', href: '/fees' }],
};