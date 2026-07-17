import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calculator, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchableSelect from '@/components/ui/searchable-select';

type Student = {
    id: number;
    student_id: string;
    name: string;
    class_name: string;
    class_id: number;
    section: string;
    section_id: number;
    roll_no: number;
};

type SectionItem = { id: number; name: string; class_id: number };

type MarkInput = {
    subject_name: string;
    full_marks: number;
    highest_marks: number;
    written_marks: number | '';
    mcq_marks: number | '';
    practical_marks: number | '';
    ca_marks: number | '';
};

type AcademicReport = {
    id: number;
    student_id: number;
    exam_name: string;
    academic_year: string;
    class_position: number | null;
    working_days: number;
    present_days: number;
    absent_days: number;
    moral_evaluation: string | null;
    co_curricular: string[] | null;
    comments: string | null;
    marks: MarkInput[];
};

type ReportsFormProps = {
    students: Student[];
    classes: { id: number; name: string }[];
    sections: SectionItem[];
    defaultSubjects?: MarkInput[];
    report?: AcademicReport;
    isEdit: boolean;
};

const moralOptions = ['Excellent', 'Good', 'Average', 'Poor'];
const coCurricularOptions = ['Sports', 'Cultural Function', 'Scout/BNCC', 'Math Olympiad'];

export default function ReportsForm({ students, classes = [], sections = [], defaultSubjects = [], report, isEdit }: ReportsFormProps) {
    const initialMarks = isEdit && report ? report.marks.map((m) => ({
        subject_name: m.subject_name,
        full_marks: m.full_marks,
        highest_marks: m.highest_marks,
        written_marks: m.written_marks ?? '',
        mcq_marks: m.mcq_marks ?? '',
        practical_marks: m.practical_marks ?? '',
        ca_marks: m.ca_marks ?? '',
    })) : defaultSubjects;

    const [filterClass, setFilterClass] = useState('');
    const [filterSection, setFilterSection] = useState('');

    const filteredSections = sections.filter((s) => s.class_id.toString() === filterClass);

    const filteredStudents = students.filter((s) => {
        if (filterClass && s.class_id?.toString() !== filterClass) return false;
        if (filterSection && s.section_id?.toString() !== filterSection) return false;
        return true;
    });

    const { data, setData, post, put, processing, errors } = useForm({
        student_id: report?.student_id?.toString() ?? '',
        exam_name: report?.exam_name ?? 'Half Yearly Exam',
        academic_year: report?.academic_year ?? '2026',
        class_position: report?.class_position?.toString() ?? '',
        working_days: report?.working_days ?? 0,
        present_days: report?.present_days ?? 0,
        absent_days: report?.absent_days ?? 0,
        moral_evaluation: report?.moral_evaluation ?? 'Excellent',
        co_curricular: report?.co_curricular ?? [] as string[],
        comments: report?.comments ?? '',
        marks: initialMarks,
    });

    // Auto-calculate absent days: working_days - present_days
    useEffect(() => {
        const working = Number(data.working_days) || 0;
        const present = Number(data.present_days) || 0;
        const absent = Math.max(0, working - present);
        if (data.absent_days !== absent) {
            setData('absent_days', absent);
        }
    }, [data.working_days, data.present_days]);

    const handleMarkChange = (index: number, field: keyof MarkInput, value: string) => {
        const updatedMarks = [...data.marks];
        const numericValue = value === '' ? '' : Math.max(0, Number(value));
        
        updatedMarks[index] = {
            ...updatedMarks[index],
            [field]: numericValue,
        };
        setData('marks', updatedMarks);
    };

    const handleCoCurricularChange = (option: string, checked: boolean) => {
        const current = [...data.co_curricular];
        if (checked) {
            setData('co_curricular', [...current, option]);
        } else {
            setData('co_curricular', current.filter((item) => item !== option));
        }
    };

    const calculateRowTotal = (mark: MarkInput) => {
        return (Number(mark.written_marks) || 0) +
               (Number(mark.mcq_marks) || 0) +
               (Number(mark.practical_marks) || 0) +
               (Number(mark.ca_marks) || 0);
    };

    const calculateTotalMarks = () =>
        data.marks.reduce((sum, m) => sum + (Number(m.written_marks) || 0) + (Number(m.mcq_marks) || 0) + (Number(m.practical_marks) || 0) + (Number(m.ca_marks) || 0), 0);

    const [calculating, setCalculating] = useState(false);

    const handleCalculatePosition = async () => {
        if (!data.student_id) return;
        setCalculating(true);
        try {
            const params = new URLSearchParams({
                student_id: data.student_id,
                exam_name: data.exam_name,
                academic_year: data.academic_year,
                total_marks: calculateTotalMarks().toString(),
            });
            if (report?.id) params.set('exclude_report_id', report.id.toString());
            const res = await fetch(`/reports/calculate-position?${params}`);
            const json = await res.json();
            setData('class_position', json.position.toString());
        } catch {
            // ignore
        } finally {
            setCalculating(false);
        }
    };

    const calculateRowGradeAndGP = (total: number) => {
        if (total >= 80) return { grade: 'A+', gp: 5.0 };
        if (total >= 70) return { grade: 'A', gp: 4.0 };
        if (total >= 60) return { grade: 'A-', gp: 3.5 };
        if (total >= 50) return { grade: 'B', gp: 3.0 };
        if (total >= 40) return { grade: 'C', gp: 2.0 };
        if (total >= 33) return { grade: 'D', gp: 1.0 };
        return { grade: 'F', gp: 0.0 };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...data,
            student_id: Number(data.student_id),
            class_position: data.class_position === '' ? null : Number(data.class_position),
            working_days: Number(data.working_days),
            present_days: Number(data.present_days),
            absent_days: Number(data.absent_days),
            marks: data.marks.map((m) => ({
                ...m,
                written_marks: m.written_marks === '' ? null : Number(m.written_marks),
                mcq_marks: m.mcq_marks === '' ? null : Number(m.mcq_marks),
                practical_marks: m.practical_marks === '' ? null : Number(m.practical_marks),
                ca_marks: m.ca_marks === '' ? null : Number(m.ca_marks),
            })),
        };

        if (isEdit && report) {
            router.post(`/reports/${report.id}`, {
                _method: 'PUT',
                ...payload,
            });
        } else {
            post('/reports');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Academic Report' : 'Create Academic Report'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/reports">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Academic Report' : 'Create Academic Report'}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit ? 'Modify marks and attendance for this student.' : 'Select a student and record their academic exam marks.'}
                        </p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_1.8fr]">
                    {/* Left Column: Metadata */}
                    <div className="space-y-6">
                        <article className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
                            <h2 className="font-semibold text-lg border-b pb-2">Student & Exam Info</h2>
                            
                            {!isEdit && (
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    <div className="space-y-2">
                                        <Label>Class</Label>
                                        <Select value={filterClass} onValueChange={(val) => { setFilterClass(val); setFilterSection(''); setData('student_id', ''); }}>
                                            <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
                                            <SelectContent>
                                                {classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Section</Label>
                                        <Select value={filterSection} onValueChange={(val) => { setFilterSection(val); setData('student_id', ''); }}>
                                            <SelectTrigger><SelectValue placeholder="All sections" /></SelectTrigger>
                                            <SelectContent>
                                                {filteredSections.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="student_id">Select Student</Label>
                                {isEdit && report ? (
                                    <Input
                                        disabled
                                        value={students.find((s) => s.id === report.student_id)?.name ?? ''}
                                        className="bg-muted"
                                    />
                                ) : (
                                    <SearchableSelect
                                        options={filteredStudents.map((s) => ({ value: s.id.toString(), label: `${s.name} · Roll ${s.roll_no}` }))}
                                        value={data.student_id}
                                        onChange={(val) => setData('student_id', val)}
                                        placeholder={filterClass ? 'Search student...' : 'Select a class first'}
                                        disabled={!filterClass}
                                    />
                                )}
                                {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="exam_name">Exam Name</Label>
                                    <Input
                                        id="exam_name"
                                        value={data.exam_name}
                                        onChange={(e) => setData('exam_name', e.target.value)}
                                        placeholder="e.g. Half Yearly Exam"
                                    />
                                    {errors.exam_name && <p className="text-sm text-red-500">{errors.exam_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="academic_year">Academic Year</Label>
                                    <Input
                                        id="academic_year"
                                        value={data.academic_year}
                                        onChange={(e) => setData('academic_year', e.target.value)}
                                        placeholder="e.g. 2026"
                                    />
                                    {errors.academic_year && <p className="text-sm text-red-500">{errors.academic_year}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="class_position">Class Position (Optional)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="class_position"
                                        type="number"
                                        value={data.class_position}
                                        onChange={(e) => setData('class_position', e.target.value)}
                                        placeholder="e.g. 4"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={calculating || !data.student_id}
                                        onClick={handleCalculatePosition}
                                        title="Calculate from marks"
                                    >
                                        <Calculator className="size-4" />
                                    </Button>
                                </div>
                                {errors.class_position && <p className="text-sm text-red-500">{errors.class_position}</p>}
                            </div>
                        </article>

                        <article className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
                            <h2 className="font-semibold text-lg border-b pb-2">Attendance & Evaluation</h2>
                            
                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="working_days">Working Days</Label>
                                    <Input
                                        id="working_days"
                                        type="number"
                                        value={data.working_days}
                                        onChange={(e) => setData('working_days', e.target.value === '' ? 0 : Number(e.target.value))}
                                    />
                                    {errors.working_days && <p className="text-sm text-red-500">{errors.working_days}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="present_days">Present Days</Label>
                                    <Input
                                        id="present_days"
                                        type="number"
                                        value={data.present_days}
                                        onChange={(e) => setData('present_days', e.target.value === '' ? 0 : Number(e.target.value))}
                                    />
                                    {errors.present_days && <p className="text-sm text-red-500">{errors.present_days}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="absent_days">Absent Days</Label>
                                    <Input
                                        id="absent_days"
                                        type="number"
                                        disabled
                                        value={data.absent_days}
                                        className="bg-muted font-medium text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="moral_evaluation">Moral & Behavior Evaluation</Label>
                                <Select
                                    value={data.moral_evaluation ?? 'Excellent'}
                                    onValueChange={(val) => setData('moral_evaluation', val)}
                                >
                                    <SelectTrigger id="moral_evaluation">
                                        <SelectValue placeholder="Select behavior..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {moralOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Co-Curricular Activities</Label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    {coCurricularOptions.map((opt) => (
                                        <div key={opt} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`co-${opt}`}
                                                checked={data.co_curricular.includes(opt)}
                                                onCheckedChange={(checked) => handleCoCurricularChange(opt, !!checked)}
                                            />
                                            <Label htmlFor={`co-${opt}`} className="font-normal text-sm cursor-pointer">
                                                {opt}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comments">Teacher Comments</Label>
                                <Input
                                    id="comments"
                                    value={data.comments}
                                    onChange={(e) => setData('comments', e.target.value)}
                                    placeholder="Enter comments about student's performance..."
                                />
                            </div>
                        </article>
                    </div>

                    {/* Right Column: Subject Marks */}
                    <div className="space-y-6">
                        <article className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
                            <h2 className="font-semibold text-lg border-b pb-2">Subject Marks Entry</h2>
                            {errors.marks && <p className="text-sm text-red-500 mb-2">{errors.marks}</p>}

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                                        <tr>
                                            <th className="px-3 py-2.5 font-semibold w-1/3">Subject Name</th>
                                            <th className="px-3 py-2.5 font-semibold text-center w-12">Full</th>
                                            <th className="px-3 py-2.5 font-semibold text-center w-12">Highest</th>
                                            <th className="px-2 py-2.5 font-semibold text-center w-12">Written</th>
                                            <th className="px-2 py-2.5 font-semibold text-center w-12">MCQ</th>
                                            <th className="px-2 py-2.5 font-semibold text-center w-12">Prac.</th>
                                            <th className="px-2 py-2.5 font-semibold text-center w-12">CA</th>
                                            <th className="px-3 py-2.5 font-semibold text-center w-14">Total</th>
                                            <th className="px-3 py-2.5 font-semibold text-center w-10">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {data.marks.map((mark, index) => {
                                            const total = calculateRowTotal(mark);
                                            const { grade, gp } = calculateRowGradeAndGP(total);

                                            return (
                                                <tr key={index} className="hover:bg-muted/30">
                                                    <td className="px-3 py-2 font-medium text-foreground">
                                                        {mark.subject_name}
                                                    </td>
                                                    <td className="px-2 py-2 text-center font-medium">
                                                        {mark.full_marks}
                                                    </td>
                                                    <td className="px-2 py-2">
                                                        <Input
                                                            type="number"
                                                            value={mark.highest_marks}
                                                            onChange={(e) => handleMarkChange(index, 'highest_marks', e.target.value)}
                                                            className="h-8 px-1 text-center text-xs font-semibold"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-2">
                                                        <Input
                                                            type="number"
                                                            value={mark.written_marks}
                                                            onChange={(e) => handleMarkChange(index, 'written_marks', e.target.value)}
                                                            className="h-8 px-1 text-center text-xs"
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-2">
                                                        <Input
                                                            type="number"
                                                            value={mark.mcq_marks}
                                                            onChange={(e) => handleMarkChange(index, 'mcq_marks', e.target.value)}
                                                            className="h-8 px-1 text-center text-xs"
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-2">
                                                        <Input
                                                            type="number"
                                                            value={mark.practical_marks}
                                                            onChange={(e) => handleMarkChange(index, 'practical_marks', e.target.value)}
                                                            className="h-8 px-1 text-center text-xs"
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-2">
                                                        <Input
                                                            type="number"
                                                            value={mark.ca_marks}
                                                            onChange={(e) => handleMarkChange(index, 'ca_marks', e.target.value)}
                                                            className="h-8 px-1 text-center text-xs"
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-center font-bold text-foreground">
                                                        {total}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                                            grade === 'F' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                                                            grade === 'A+' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                                            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                                        }`}>
                                                            {grade} ({gp.toFixed(1)})
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4 mt-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/reports">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="px-5">
                                    <Save className="mr-2 size-4" /> {isEdit ? 'Update Report' : 'Save Report'}
                                </Button>
                            </div>
                        </article>
                    </div>
                </form>
            </main>
        </>
    );
}

ReportsForm.layout = {
    breadcrumbs: [
        { title: 'Reports', href: '/reports' },
        { title: 'Manage', href: '' }
    ],
};
