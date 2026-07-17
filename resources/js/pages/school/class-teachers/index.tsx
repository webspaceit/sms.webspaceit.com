import { Head, router, useForm } from '@inertiajs/react';
import { Save, Search, UserCheck, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

type SectionItem = {
    id: number;
    class_name: string;
    name: string;
    class_teacher_id: number | null;
    class_teacher: { id: number; name: string; employee_id: string } | null;
};

type Props = {
    sections: { data: SectionItem[]; current_page: number; last_page: number; per_page: number; total: number };
    classes: { id: number; name: string }[];
    allSections: { id: number; name: string; class_id: number }[];
    subjects: { id: number; name: string; code: string }[];
    subjectTeachers: Record<string, number[]>;
    teachers: { id: number; name: string; employee_id: string; department: string }[];
    filters: { class_id?: string; section_id?: string; teacher_id?: string; search?: string; per_page?: number };
};

export default function Index({ sections, classes, allSections, subjects, subjectTeachers, teachers, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [classId, setClassId] = useState(filters?.class_id ?? '');
    const [sectionId, setSectionId] = useState(filters?.section_id ?? '');
    const [subjectId, setSubjectId] = useState(filters?.subject_id ?? '');
    const [teacherId, setTeacherId] = useState(filters?.teacher_id ?? '');
    const [perPage, setPerPage] = useState(filters?.per_page?.toString() ?? '10');

    const cleanFilters = (f: Record<string, any>) => Object.fromEntries(Object.entries(f).filter(([, v]) => v != null && v !== ''));

const filteredSections = classId
        ? allSections.filter((s) => s.class_id.toString() === classId)
        : allSections;

    const availableBarTeacherIds = subjectId ? (subjectTeachers[subjectId] ?? []) : [];
    const filteredBarTeachers = subjectId
        ? teachers.filter((t) => availableBarTeacherIds.includes(t.id))
        : teachers;

    const applyFilters = (overrides: Record<string, string> = {}) => {
        const params: Record<string, string> = {};
        const val = (v: string) => overrides[v] ?? '';
        if (val('class_id') || classId) params.class_id = val('class_id') || classId;
        if (val('section_id') || sectionId) params.section_id = val('section_id') || sectionId;
        if (val('subject_id') || subjectId) params.subject_id = val('subject_id') || subjectId;
        if (val('teacher_id') || teacherId) params.teacher_id = val('teacher_id') || teacherId;
        if (val('search') || search) params.search = val('search') || search;
        params.per_page = val('per_page') || perPage;
        router.get('/class-teachers', params, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); applyFilters(); };

    const clearFilters = () => {
        setSearch('');
        setClassId('');
        setSectionId('');
        setSubjectId('');
        setTeacherId('');
        setPerPage('10');
        router.get('/class-teachers');
    };

    const hasFilters = classId || sectionId || subjectId || teacherId || search;

    return (
        <>
            <Head title="Class Teachers" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <UserCheck className="size-6 text-emerald-600" /> Class Teachers
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Assign teachers to sections by subject.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Class</Label>
                        <SearchableSelect
                            options={classes.map((c) => ({ value: c.id.toString(), label: c.name }))}
                            value={classId}
                            onChange={(val) => { setClassId(val); setSectionId(''); }}
                            placeholder="All classes"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Section</Label>
                        <SearchableSelect
                            options={filteredSections.map((s) => ({ value: s.id.toString(), label: s.name }))}
                            value={sectionId}
                            onChange={(val) => setSectionId(val)}
                            placeholder="All sections"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Subject</Label>
                        <SearchableSelect
                            options={subjects.map((s) => ({ value: s.id.toString(), label: `${s.name} (${s.code})` }))}
                            value={subjectId}
                            onChange={(val) => { setSubjectId(val); setTeacherId(''); }}
                            placeholder="All subjects"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Class Teacher</Label>
                        <SearchableSelect
                            options={filteredBarTeachers.map((t) => ({ value: t.id.toString(), label: `${t.name} [${t.department}]` }))}
                            value={teacherId}
                            onChange={(val) => setTeacherId(val)}
                            placeholder="All teachers"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Keyword..."
                                className="pl-8 h-10 w-44"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Per page</Label>
                        <Select value={perPage} onValueChange={(val) => { setPerPage(val); applyFilters({ per_page: val }); }}>
                            <SelectTrigger className="h-10 w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {[5, 10, 15, 25, 50, 100].map((n) => (
                                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" size="sm" className="h-10"><Search className="mr-1.5 size-4" /> Filter</Button>
                    {hasFilters && (
                        <Button type="button" variant="ghost" size="sm" className="h-10" onClick={clearFilters}>
                            <X className="mr-1.5 size-4" /> Clear
                        </Button>
                    )}
                </form>

                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Class</th>
                                    <th className="px-4 py-3 font-medium">Section</th>
                                    <th className="px-4 py-3 font-medium">Current Class Teacher</th>
                                    <th className="px-4 py-3 font-medium">Subject</th>
                                    <th className="px-4 py-3 font-medium">Assign Teacher</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No sections found.
                                        </td>
                                    </tr>
                                ) : (
                                    sections.data.map((section) => (
                                        <ClassTeacherRow
                                            key={section.id}
                                            section={section}
                                            subjects={subjects}
                                            subjectTeachers={subjectTeachers}
                                            teachers={teachers}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {sections.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {sections.current_page > 1 && (
                            <Button variant="outline" size="sm" onClick={() => router.get('/class-teachers', { ...cleanFilters(filters), page: sections.current_page - 1 }, { preserveState: true })}>
                                Previous
                            </Button>
                        )}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: sections.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === sections.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    className="min-w-9"
                                    onClick={() => router.get('/class-teachers', { ...cleanFilters(filters), page }, { preserveState: true })}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        {sections.current_page < sections.last_page && (
                            <Button variant="outline" size="sm" onClick={() => router.get('/class-teachers', { ...cleanFilters(filters), page: sections.current_page + 1 }, { preserveState: true })}>
                                Next
                            </Button>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}

function ClassTeacherRow({ section, subjects, subjectTeachers, teachers }: {
    section: SectionItem;
    subjects: Props['subjects'];
    subjectTeachers: Props['subjectTeachers'];
    teachers: Props['teachers'];
}) {
    const [selectedSubjectId, setSelectedSubjectId] = useState('');

    const availableTeacherIds = selectedSubjectId ? (subjectTeachers[selectedSubjectId] ?? []) : [];
    const filteredTeachers = selectedSubjectId
        ? teachers.filter((t) => availableTeacherIds.includes(t.id))
        : [];

    const { data, setData, put, processing } = useForm({
        class_teacher_id: section.class_teacher_id?.toString() ?? '',
    });

    const handleAssign = () => {
        put(`/class-teachers/${section.id}`);
    };

    return (
        <tr className="border-t hover:bg-muted/40 transition-colors">
            <td className="px-4 py-3">{section.class_name}</td>
            <td className="px-4 py-3 font-medium">{section.name}</td>
            <td className="px-4 py-3">
                {section.class_teacher ? (
                    <span className="text-foreground">
                        {section.class_teacher.name}
                        <span className="text-muted-foreground ml-1">({section.class_teacher.employee_id})</span>
                    </span>
                ) : (
                    <span className="text-muted-foreground italic">Not assigned</span>
                )}
            </td>
            <td className="px-4 py-3 min-w-44">
                <SearchableSelect
                    options={subjects.map((s) => ({ value: s.id.toString(), label: `${s.name} (${s.code})` }))}
                    value={selectedSubjectId}
                    onChange={setSelectedSubjectId}
                    placeholder="Select subject..."
                />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <SearchableSelect
                            options={filteredTeachers.map((t) => ({ value: t.id.toString(), label: `${t.name} [${t.department}]` }))}
                            value={data.class_teacher_id}
                            onChange={(val) => setData('class_teacher_id', val)}
                            placeholder={selectedSubjectId ? 'Select teacher...' : 'Pick a subject first'}
                        />
                    </div>
                    <Button
                        size="sm"
                        onClick={handleAssign}
                        disabled={processing || !data.class_teacher_id}
                    >
                        <Save className="mr-1 size-3.5" /> Assign
                    </Button>
                </div>
            </td>
        </tr>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Class Teachers', href: '/class-teachers' }] };
