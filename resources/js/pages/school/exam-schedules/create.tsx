import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Filter, PlusCircle, Save, Timer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

type Section = { id: number; class_id: number; name: string; room_no: string | null; class_name?: string };
type Props = {
    exams: { id: number; name: string }[];
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string; code: string }[];
    classSubjects: Record<string, number[]>;
    branches: { id: number; name: string }[];
    sections: Section[];
};

type TimetableEntry = {
    subject_id: string;
    subject_name: string;
    date: string;
    time_start: string;
    time_end: string;
    hall_id: string;
};

export default function Create({ exams, classes, subjects, classSubjects, branches, sections }: Props) {
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [filtered, setFiltered] = useState(false);

    const [qStartDate, setQStartDate] = useState('');
    const [qStartTime, setQStartTime] = useState('');
    const [qDuration, setQDuration] = useState('');
    const [qHallId, setQHallId] = useState('');

    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [saving, setSaving] = useState(false);

    const filteredSections = useMemo(
        () => sections.filter((s) => !selectedClassId || s.class_id.toString() === selectedClassId),
        [sections, selectedClassId]
    );

    const halls = useMemo(
        () => sections.map((s) => ({ value: s.id.toString(), label: s.room_no ? `${s.name} (Room ${s.room_no})` : s.name })),
        [sections]
    );

    const handleFilter = () => {
        if (!selectedClassId) return;
        const availableIds = classSubjects[selectedClassId] ?? [];
        const newEntries: TimetableEntry[] = availableIds.map((sid) => {
            const sub = subjects.find((s) => s.id === sid);
            return {
                subject_id: sid.toString(),
                subject_name: sub ? `${sub.name} (${sub.code})` : '',
                date: '',
                time_start: '',
                time_end: '',
                hall_id: '',
            };
        });
        setEntries(newEntries);
        setFiltered(true);
    };

    const addMinutes = (time: string, mins: number): string => {
        const [h, m] = time.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m + mins);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const handleApplyQuick = () => {
        if (!qStartDate || !qStartTime || !qDuration) return;
        setEntries((prev) =>
            prev.map((entry, idx) => ({
                ...entry,
                date: (() => {
                    const d = new Date(qStartDate);
                    d.setDate(d.getDate() + idx);
                    return d.toISOString().split('T')[0];
                })(),
                time_start: qStartTime,
                time_end: addMinutes(qStartTime, parseInt(qDuration) || 0),
                hall_id: qHallId,
            }))
        );
    };

    const updateEntry = (idx: number, field: keyof TimetableEntry, value: string) => {
        setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
    };

    const handleSave = () => {
        if (!selectedExamId || !selectedClassId || entries.length === 0) return;
        setSaving(true);
        router.post(
            '/exam-schedules/bulk',
            {
                exam_id: selectedExamId,
                class_id: selectedClassId,
                section_id: selectedSectionId || null,
                branch_id: selectedBranchId || null,
                timetable: entries.map((e) => ({
                    subject_id: e.subject_id,
                    date: e.date,
                    time_start: e.time_start,
                    time_end: e.time_end,
                    hall_id: e.hall_id || null,
                })),
            },
            {
                onFinish: () => setSaving(false),
            }
        );
    };

    return (
        <>
            <Head title="Create Exam Schedule" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/exam-schedules"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Timer className="size-6 text-pink-600" /> Add Schedule</h1><p className="text-sm text-muted-foreground">Set up exam timetable for a class.</p></div>
                </section>

                <section className="rounded-lg border bg-card shadow-sm">
                    <header className="border-b px-5 py-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Select Ground</h4>
                    </header>
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Branch</Label>
                                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {branches.map((b) => (
                                            <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Exam Name <span className="text-red-500">*</span></Label>
                                <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {exams.map((e) => (
                                            <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Class <span className="text-red-500">*</span></Label>
                                <SearchableSelect
                                    options={classes.map((c) => ({ value: c.id.toString(), label: c.name }))}
                                    value={selectedClassId}
                                    onChange={(val) => { setSelectedClassId(val); setSelectedSectionId(''); setFiltered(false); setEntries([]); }}
                                    placeholder="Select"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Section</Label>
                                <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {filteredSections.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <footer className="border-t px-5 py-3 flex justify-end">
                        <Button onClick={handleFilter} disabled={!selectedExamId || !selectedClassId}>
                            <Filter className="mr-2 size-4" /> Filter
                        </Button>
                    </footer>
                </section>

                {filtered && (
                    <section className="rounded-lg border bg-card shadow-sm appear-animation">
                        <header className="border-b px-5 py-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide"><Timer className="inline size-4 mr-1" /> Add Schedule</h4>
                        </header>
                        <div className="p-5 space-y-5">
                            <div className="rounded-lg border bg-muted/20 p-4">
                                <h5 className="font-medium text-sm mb-3">Set Parameters To Quickly Create Schedule</h5>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-muted-foreground">
                                                <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Starting Date <span className="text-red-500">*</span></th>
                                                <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Starting Time <span className="text-red-500">*</span></th>
                                                <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Exam Duration (Minutes) <span className="text-red-500">*</span></th>
                                                <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Hall Room</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-3 py-2"><Input type="date" value={qStartDate} onChange={(e) => setQStartDate(e.target.value)} /></td>
                                                <td className="px-3 py-2"><Input type="time" value={qStartTime} onChange={(e) => setQStartTime(e.target.value)} /></td>
                                                <td className="px-3 py-2"><Input type="number" min="1" placeholder="e.g. 120" value={qDuration} onChange={(e) => setQDuration(e.target.value)} /></td>
                                                <td className="px-3 py-2">
                                                    <Select value={qHallId} onValueChange={setQHallId}>
                                                        <SelectTrigger><SelectValue placeholder="Not Selected" /></SelectTrigger>
                                                        <SelectContent>
                                                            {halls.map((h) => (
                                                                <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <Button variant="secondary" size="sm" onClick={handleApplyQuick}>
                                        <PlusCircle className="mr-2 size-4" /> Apply
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="px-3 py-2 text-left font-medium">Subject <span className="text-red-500">*</span></th>
                                            <th className="px-3 py-2 text-left font-medium">Date <span className="text-red-500">*</span></th>
                                            <th className="px-3 py-2 text-left font-medium">Starting Time <span className="text-red-500">*</span></th>
                                            <th className="px-3 py-2 text-left font-medium">Ending Time <span className="text-red-500">*</span></th>
                                            <th className="px-3 py-2 text-left font-medium">Hall Room</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.length === 0 ? (
                                            <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No subjects found for this class. Click Filter to load subjects.</td></tr>
                                        ) : (
                                            entries.map((entry, idx) => (
                                                <tr key={entry.subject_id} className="border-t hover:bg-muted/30 transition-colors">
                                                    <td className="px-3 py-2 font-medium whitespace-nowrap">{entry.subject_name}</td>
                                                    <td className="px-3 py-2 min-w-[140px]">
                                                        <Input type="date" value={entry.date} onChange={(e) => updateEntry(idx, 'date', e.target.value)} required />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[130px]">
                                                        <Input type="time" value={entry.time_start} onChange={(e) => updateEntry(idx, 'time_start', e.target.value)} required />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[130px]">
                                                        <Input type="time" value={entry.time_end} onChange={(e) => updateEntry(idx, 'time_end', e.target.value)} required />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[160px]">
                                                        <Select value={entry.hall_id} onValueChange={(val) => updateEntry(idx, 'hall_id', val)}>
                                                            <SelectTrigger><SelectValue placeholder="Not Selected" /></SelectTrigger>
                                                            <SelectContent>
                                                                {halls.map((h) => (
                                                                    <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <footer className="border-t px-5 py-3 flex justify-end">
                            <Button onClick={handleSave} disabled={saving || entries.length === 0}>
                                <Save className="mr-2 size-4" /> {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </footer>
                    </section>
                )}
            </main>
        </>
    );
}

Create.layout = { breadcrumbs: [{ title: 'Exam Schedules', href: '/exam-schedules' }, { title: 'Add Schedule', href: '' }] };
