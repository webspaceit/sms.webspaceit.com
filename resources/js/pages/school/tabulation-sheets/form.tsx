import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

type TabulationSheet = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
};

type TabulationSheetsFormProps = {
    tabulationSheet?: TabulationSheet;
    classes: string[];
    sections: string[];
    exams: string[];
    years: string[];
    isEdit: boolean;
};

export default function TabulationSheetsForm({ tabulationSheet, classes, sections, exams, years, isEdit }: TabulationSheetsFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        class_name: tabulationSheet?.class_name ?? '',
        section: tabulationSheet?.section ?? '',
        exam_name: tabulationSheet?.exam_name ?? '',
        academic_year: tabulationSheet?.academic_year ?? '2026',
    });

    const [customClass, setCustomClass] = useState(classes.length === 0 || (isEdit && !classes.includes(data.class_name)));
    const [customSection, setCustomSection] = useState(sections.length === 0 || (isEdit && !sections.includes(data.section)));
    const [customExam, setCustomExam] = useState(exams.length === 0 || (isEdit && !exams.includes(data.exam_name)));
    const [customYear, setCustomYear] = useState(years.length === 0 || (isEdit && !years.includes(data.academic_year)));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && tabulationSheet) {
            put(`/tabulation-sheets/${tabulationSheet.id}`);
        } else {
            post('/tabulation-sheets');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Tabulation Config' : 'Create Tabulation Config'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-2xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/tabulation-sheets">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Tabulation Configuration' : 'Create Tabulation Configuration'}</h1>
                        <p className="text-sm text-muted-foreground">
                            Specify the student class, section, exam, and year parameters to generate a tabulation report.
                        </p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    {/* Class Name */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="class_name">Class Name</Label>
                            {classes.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => { setCustomClass(!customClass); setData('class_name', ''); }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {customClass ? 'Select from list' : 'Type custom value'}
                                </button>
                            )}
                        </div>
                        {customClass ? (
                            <Input
                                id="class_name"
                                value={data.class_name}
                                onChange={(e) => setData('class_name', e.target.value)}
                                placeholder="e.g. Class 6"
                                required
                            />
                        ) : (
                            <Select
                                value={data.class_name}
                                onValueChange={(val) => setData('class_name', val)}
                            >
                                <SelectTrigger id="class_name">
                                    <SelectValue placeholder="Select Class..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.class_name && <p className="text-sm text-red-500">{errors.class_name}</p>}
                    </div>

                    {/* Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="section">Section / Department</Label>
                            {sections.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => { setCustomSection(!customSection); setData('section', ''); }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {customSection ? 'Select from list' : 'Type custom value'}
                                </button>
                            )}
                        </div>
                        {customSection ? (
                            <Input
                                id="section"
                                value={data.section}
                                onChange={(e) => setData('section', e.target.value)}
                                placeholder="e.g. A, B, Science, etc."
                                required
                            />
                        ) : (
                            <Select
                                value={data.section}
                                onValueChange={(val) => setData('section', val)}
                            >
                                <SelectTrigger id="section">
                                    <SelectValue placeholder="Select Section..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((sec) => (
                                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.section && <p className="text-sm text-red-500">{errors.section}</p>}
                    </div>

                    {/* Exam Name */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="exam_name">Exam Name</Label>
                            {exams.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => { setCustomExam(!customExam); setData('exam_name', ''); }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {customExam ? 'Select from list' : 'Type custom value'}
                                </button>
                            )}
                        </div>
                        {customExam ? (
                            <Input
                                id="exam_name"
                                value={data.exam_name}
                                onChange={(e) => setData('exam_name', e.target.value)}
                                placeholder="e.g. Half Yearly Exam"
                                required
                            />
                        ) : (
                            <Select
                                value={data.exam_name}
                                onValueChange={(val) => setData('exam_name', val)}
                            >
                                <SelectTrigger id="exam_name">
                                    <SelectValue placeholder="Select Exam..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {exams.map((ex) => (
                                        <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.exam_name && <p className="text-sm text-red-500">{errors.exam_name}</p>}
                    </div>

                    {/* Academic Year */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="academic_year">Academic Year</Label>
                            {years.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => { setCustomYear(!customYear); setData('academic_year', ''); }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {customYear ? 'Select from list' : 'Type custom value'}
                                </button>
                            )}
                        </div>
                        {customYear ? (
                            <Input
                                id="academic_year"
                                value={data.academic_year}
                                onChange={(e) => setData('academic_year', e.target.value)}
                                placeholder="e.g. 2026"
                                required
                            />
                        ) : (
                            <Select
                                value={data.academic_year}
                                onValueChange={(val) => setData('academic_year', val)}
                            >
                                <SelectTrigger id="academic_year">
                                    <SelectValue placeholder="Select Year..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((yr) => (
                                        <SelectItem key={yr} value={yr}>{yr}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.academic_year && <p className="text-sm text-red-500">{errors.academic_year}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/tabulation-sheets">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="flex items-center gap-2">
                            <Save className="size-4" />
                            {isEdit ? 'Update Configuration' : 'Save Configuration'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

TabulationSheetsForm.layout = {
    breadcrumbs: [{ title: 'Tabulation Sheets', href: '/tabulation-sheets' }],
};
