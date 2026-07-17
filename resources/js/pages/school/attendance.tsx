import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CalendarCheck, Edit2, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Attendance', href: '/attendance' }];

type AttendanceRow = {
    id: number; name: string; class_name: string; section: string;
    roll_no: number | string; date: string; status: string; marked_by: string;
};

type PaginatedAttendance = {
    data: AttendanceRow[];
    current_page: number; last_page: number; per_page: number;
    total: number; from: number | null; to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};

type SchoolClass = { id: number; name: string };
type SchoolSection = { id: number; name: string; class_id: number };

type Filters = {
    class_id?: string; section_id?: string;
    date?: string; date_from?: string; date_to?: string;
    status?: string; search?: string; per_page?: number;
};

const perPageOptions = [
    { value: '20', label: '20 / page' },
    { value: '50', label: '50 / page' },
    { value: '100', label: '100 / page' },
];

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'leave', label: 'Leave' },
];

function statusVariant(s: string): 'default' | 'destructive' | 'outline' | 'secondary' {
    if (s === 'present') return 'default';
    if (s === 'absent') return 'destructive';
    if (s === 'late') return 'outline';
    return 'secondary';
}

export default function Attendance({
    attendance, classes, sections, filters,
}: {
    attendance: PaginatedAttendance;
    classes: SchoolClass[];
    sections: SchoolSection[];
    filters: Filters;
}) {
    const [form, setForm] = useState({
        class_id: filters.class_id ?? '',
        section_id: filters.section_id ?? '',
        date: filters.date ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
        status: filters.status ?? '',
        search: filters.search ?? '',
        per_page: String(filters.per_page ?? 20),
    });

    const filteredSections = sections.filter(
        (s) => !form.class_id || s.class_id === Number(form.class_id)
    );

    const classOptions = classes.map((c) => ({ value: String(c.id), label: c.name }));
    const sectionOptions = filteredSections.map((s) => ({ value: String(s.id), label: s.name }));

    const apply = (overrides: Partial<typeof form> = {}) => {
        const params = { ...form, ...overrides };
        // strip empty
        const clean: Record<string, string> = {};
        Object.entries(params).forEach(([k, v]) => { if (v) clean[k] = v; });
        router.get('/attendance', clean, { preserveState: true, replace: true });
    };

    const reset = () => {
        const empty = { class_id: '', section_id: '', date: '', date_from: '', date_to: '', status: '', search: '', per_page: '20' };
        setForm(empty);
        router.get('/attendance', {}, { preserveState: false });
    };

    const hasFilters = !!(form.class_id || form.section_id || form.date || form.date_from || form.date_to || form.status || form.search);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete attendance for ${name}?`)) router.delete(`/attendance/${id}`);
    };

    return (
        <>
            <Head title="Attendance" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">

                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <CalendarCheck className="size-6 text-purple-600" /> Attendance
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {attendance.total.toLocaleString()} records total
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/attendance/create">
                            <Plus className="mr-2 size-4" /> Mark Attendance
                        </Link>
                    </Button>
                </div>

                {/* Filter bar */}
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* Class */}
                        <div>
                            <Label className="text-xs mb-1 block">Class</Label>
                            <SearchableSelect
                                options={[{ value: '', label: 'All Classes' }, ...classOptions]}
                                value={form.class_id}
                                onChange={(v) => {
                                    const updated = { ...form, class_id: v, section_id: '' };
                                    setForm(updated);
                                    apply(updated);
                                }}
                                placeholder="All Classes"
                            />
                        </div>
                        {/* Section */}
                        <div>
                            <Label className="text-xs mb-1 block">Section</Label>
                            <SearchableSelect
                                options={[{ value: '', label: 'All Sections' }, ...sectionOptions]}
                                value={form.section_id}
                                onChange={(v) => { const u = { ...form, section_id: v }; setForm(u); apply(u); }}
                                placeholder="All Sections"
                            />
                        </div>
                        {/* Date */}
                        <div>
                            <Label className="text-xs mb-1 block">Date</Label>
                            <Input type="date" value={form.date}
                                onChange={(e) => { const u = { ...form, date: e.target.value, date_from: '', date_to: '' }; setForm(u); apply(u); }}
                            />
                        </div>
                        {/* Status */}
                        <div>
                            <Label className="text-xs mb-1 block">Status</Label>
                            <SearchableSelect
                                options={statusOptions}
                                value={form.status}
                                onChange={(v) => { const u = { ...form, status: v }; setForm(u); apply(u); }}
                                placeholder="All Statuses"
                            />
                        </div>
                        {/* Search */}
                        <div>
                            <Label className="text-xs mb-1 block">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Name or ID…"
                                    value={form.search}
                                    className="pl-8"
                                    onChange={(e) => setForm({ ...form, search: e.target.value })}
                                    onKeyDown={(e) => { if (e.key === 'Enter') apply(); }}
                                />
                            </div>
                        </div>
                        {/* Per page + clear */}
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs mb-1 block">Per page</Label>
                            <div className="flex gap-1">
                                <SearchableSelect
                                    options={perPageOptions}
                                    value={form.per_page}
                                    onChange={(v) => { const u = { ...form, per_page: v }; setForm(u); apply(u); }}
                                    placeholder="20"
                                />
                                {hasFilters && (
                                    <Button variant="ghost" size="icon" className="shrink-0" onClick={reset} title="Clear filters">
                                        <X className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">#</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Student</th>
                                    <th className="px-4 py-3 font-medium">Class / Section</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Marked By</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                            No records found. Try adjusting your filters.
                                        </td>
                                    </tr>
                                ) : attendance.data.map((row, i) => (
                                    <tr key={row.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-2.5 text-muted-foreground text-xs">
                                            {(attendance.from ?? 0) + i}
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap">{row.date}</td>
                                        <td className="px-4 py-2.5">
                                            <p className="font-medium">{row.name}</p>
                                            <p className="text-xs text-muted-foreground">Roll {row.roll_no}</p>
                                        </td>
                                        <td className="px-4 py-2.5">{row.class_name} {row.section}</td>
                                        <td className="px-4 py-2.5">
                                            <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                                        </td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{row.marked_by}</td>
                                        <td className="px-4 py-2.5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild>
                                                    <Link href={`/attendance/${row.id}/edit`} title="Edit">
                                                        <Edit2 className="size-3.5 text-amber-600" />
                                                    </Link>
                                                </Button>
                                                <Button size="icon" variant="outline" className="size-8"
                                                    onClick={() => handleDelete(row.id, row.name)} title="Delete">
                                                    <Trash2 className="size-3.5 text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    {attendance.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
                            <p className="text-muted-foreground">
                                Showing <span className="font-medium">{attendance.from}</span>–<span className="font-medium">{attendance.to}</span> of{' '}
                                <span className="font-medium">{attendance.total.toLocaleString()}</span>
                            </p>
                            <div className="flex items-center gap-1 flex-wrap">
                                {attendance.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`min-w-[2rem] h-8 px-2 rounded text-xs border transition-colors ${link.active
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : link.url
                                                    ? 'hover:bg-muted border-border'
                                                    : 'opacity-40 cursor-not-allowed border-border'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

Attendance.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
