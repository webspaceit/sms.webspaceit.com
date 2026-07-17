import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Edit2, Eye, GraduationCap, Plus, Search, Trash2, List, Newspaper } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

type Student = {
    id: number;
    student_id: string;
    name: string;
    roll_no: number;
    date_of_birth: string;
    gender: string;
    guardian_name: string;
    guardian_phone: string;
    mother_name?: string;
    mother_phone?: string;
    religion?: string;
    blood_group?: string;
    status: string;
    school_class?: { id: number; name: string };
    section?: { id: number; name: string } | null;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

type SchoolClass = { id: number; name: string };
type SchoolSection = { id: number; name: string; class_id: number };

export default function Students({
    students,
    classes,
    sections,
    filters,
}: {
    students: PaginatedData<Student>;
    classes: SchoolClass[];
    sections: SchoolSection[];
    filters?: { class_id?: string; section_id?: string; search_text?: string; per_page?: string };
}) {
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const [sectionId, setSectionId] = useState(filters?.section_id ?? '');
    const [searchText, setSearchText] = useState(filters?.search_text ?? '');
    const [perPage, setPerPage] = useState(String(filters?.per_page ?? '20'));
    const [activeTab, setActiveTab] = useState<'list' | 'details'>('list');

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

    const hasFilters = !!(filters?.class_id || filters?.section_id || filters?.search_text);

    const handleSearch = () => {
        router.get('/students', { class_id: classId, section_id: sectionId, search_text: searchText, per_page: perPage, page: 1 }, { preserveState: true });
    };

    const handleClear = () => {
        setClassId('');
        setSectionId('');
        setSearchText('');
        setPerPage('20');
        router.get('/students', { page: 1 });
    };

    const handlePage = (url: string | null) => {
        if (!url) return;
        const qs = url.includes('?') ? url.split('?')[1] : '';
        const params = new URLSearchParams(qs);
        router.get('/students', {
            class_id: classId,
            section_id: sectionId,
            search_text: searchText,
            per_page: perPage,
            page: params.get('page') || '1',
        }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(`/students/${id}`);
        }
    };

    return (
        <>
            <Head title="Students" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <GraduationCap className="size-6 text-emerald-600" />
                            Students
                        </h1>
                        <p className="text-sm text-muted-foreground">Admissions, class placement, guardian contacts, and district records.</p>
                    </div>
                    <Button asChild>
                        <Link href="/students/create">
                            <Plus className="mr-2 size-4" /> Add Student
                        </Link>
                    </Button>
                </div>

                <section className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b bg-muted/30 px-5 py-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Search className="size-4" /> Select Criteria
                        </h3>
                    </div>
                    <div className="p-5">
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>Class <span className="text-red-500">*</span></Label>
                                    <SearchableSelect
                                        options={classOptions}
                                        value={classId}
                                        onChange={(v) => {
                                            setClassId(v);
                                            setSectionId('');
                                        }}
                                        placeholder="Search class..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Section</Label>
                                    <SearchableSelect
                                        options={sectionOptions}
                                        value={sectionId}
                                        onChange={(v) => {
                                            setSectionId(v);
                                        }}
                                        placeholder="Search section..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="search_text">Search By Keyword</Label>
                                    <Input
                                        id="search_text"
                                        placeholder="Student Name, Roll No, Admission No..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Show</Label>
                                    <select
                                        value={perPage}
                                        onChange={(e) => setPerPage(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" name="search" value="search_all" variant="default" size="sm">
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

                <section className="rounded-lg border bg-card shadow-sm">
                    <div className="border-b px-5">
                        <div className="flex gap-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab('list')}
                                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'list'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <List className="size-4" /> List View
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Newspaper className="size-4" /> Details View
                            </button>
                        </div>
                    </div>

                    {activeTab === 'list' && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/60 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Admission No</th>
                                            <th className="px-4 py-3 font-medium">Student Name</th>
                                            <th className="px-4 py-3 font-medium">Roll No.</th>
                                            <th className="px-4 py-3 font-medium">Class</th>
                                            <th className="px-4 py-3 font-medium">Father Name</th>
                                            <th className="px-4 py-3 font-medium">Date Of Birth</th>
                                            <th className="px-4 py-3 font-medium">Gender</th>
                                            <th className="px-4 py-3 font-medium">Religion</th>
                                            <th className="px-4 py-3 font-medium">Mobile Number</th>
                                            <th className="px-4 py-3 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="text-6xl">📋</div>
                                                        <p className="text-base font-medium">No data available in table</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            <span className="text-emerald-600 font-medium">&larr; Add new record or search with different criteria.</span>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            students.data.map((student) => (
                                                <tr key={student.id} className="border-t hover:bg-muted/40 transition-colors">
                                                    <td className="px-4 py-3">{student.student_id}</td>
                                                    <td className="px-4 py-3 font-medium">
                                                        <Link href={`/students/${student.id}`} className="hover:text-blue-600 transition-colors">{student.name}</Link>
                                                    </td>
                                                    <td className="px-4 py-3">{student.roll_no}</td>
                                                    <td className="px-4 py-3">
                                                        {student.school_class?.name ?? '-'}
                                                        {student.section ? ` (${student.section.name})` : ''}
                                                    </td>
                                                    <td className="px-4 py-3">{student.guardian_name}</td>
                                                    <td className="px-4 py-3">{student.date_of_birth}</td>
                                                    <td className="px-4 py-3">{student.gender}</td>
                                                    <td className="px-4 py-3">{student.religion ?? '-'}</td>
                                                    <td className="px-4 py-3">{student.guardian_phone}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            <Button size="icon" variant="outline" className="size-8" asChild>
                                                                <Link href={`/students/${student.id}`} title="View Details">
                                                                    <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                                </Link>
                                                            </Button>
                                                            <Button size="icon" variant="outline" className="size-8" asChild>
                                                                <Link href={`/students/${student.id}/edit`} title="Edit Student">
                                                                    <Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="size-8"
                                                                onClick={() => handleDelete(student.id, student.name)}
                                                                title="Delete Student"
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
                            {students.last_page > 1 && (
                                <div className="flex items-center justify-between border-t px-4 py-3">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {students.data.length} of {students.total} entries
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
                        </>
                    )}

                    {activeTab === 'details' && (
                        <div className="p-5">
                            {students.data.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
                                    <div className="text-6xl">📋</div>
                                    <p className="text-base font-medium">No Record Found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {students.data.map((student) => (
                                        <div key={student.id} className="rounded-lg border p-4 hover:bg-muted/40 transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm dark:bg-emerald-900 dark:text-emerald-300">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link href={`/students/${student.id}`} className="font-medium hover:text-blue-600 transition-colors">{student.name}</Link>
                                                    <p className="text-xs text-muted-foreground">{student.student_id}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                                                <span className="text-muted-foreground">Roll No.</span>
                                                <span>{student.roll_no}</span>
                                                <span className="text-muted-foreground">Class</span>
                                                <span>{student.school_class?.name ?? '-'} {student.section?.name ?? ''}</span>
                                                <span className="text-muted-foreground">Father Name</span>
                                                <span>{student.guardian_name}</span>
                                                <span className="text-muted-foreground">DOB</span>
                                                <span>{student.date_of_birth}</span>
                                                <span className="text-muted-foreground">Gender</span>
                                                <span>{student.gender}</span>
                                                <span className="text-muted-foreground">Religion</span>
                                                <span>{student.religion ?? '-'}</span>
                                                <span className="text-muted-foreground">Mobile</span>
                                                <span>{student.guardian_phone}</span>
                                            </div>
                                            <div className="flex justify-end gap-1.5 mt-3 pt-3 border-t">
                                                <Button size="icon" variant="outline" className="size-7" asChild>
                                                    <Link href={`/students/${student.id}`} title="View Details">
                                                        <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                    </Link>
                                                </Button>
                                                <Button size="icon" variant="outline" className="size-7" asChild>
                                                    <Link href={`/students/${student.id}/edit`} title="Edit Student">
                                                        <Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="size-7"
                                                    onClick={() => handleDelete(student.id, student.name)}
                                                    title="Delete Student"
                                                >
                                                    <Trash2 className="size-3.5 text-red-600 dark:text-red-400" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {students.last_page > 1 && (
                                <div className="flex items-center justify-between border-t pt-4 mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {students.data.length} of {students.total} entries
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
                    )}
                </section>
            </main>
        </>
    );
}

Students.layout = {
    breadcrumbs: [{ title: 'Students', href: '/students' }],
};
