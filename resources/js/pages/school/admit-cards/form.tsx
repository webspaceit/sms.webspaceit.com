import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

type AdmitCard = {
    id: number;
    class_name: string;
    section: string;
    exam_name: string;
    academic_year: string;
    start_time: string;
    instructions: string[] | null;
    routine: Record<string, string> | null; // subject_name -> date_string
};

type AdmitCardsFormProps = {
    admitCard?: AdmitCard;
    classes: string[];
    sections: string[];
    exams: string[];
    years: string[];
    subjects: string[];
    isEdit: boolean;
    defaultInstructions?: string[];
};

type RoutineItem = {
    subject: string;
    date: string;
};

export default function AdmitCardsForm({
    admitCard,
    classes,
    sections,
    exams,
    years,
    subjects,
    isEdit,
    defaultInstructions = []
}: AdmitCardsFormProps) {
    // Parse instructions
    const initialInstructions = admitCard?.instructions ?? defaultInstructions;

    // Parse routine dictionary into list of {subject, date}
    const initialRoutineList: RoutineItem[] = [];
    if (admitCard?.routine) {
        Object.entries(admitCard.routine).forEach(([sub, date]) => {
            initialRoutineList.push({ subject: sub, date });
        });
    } else {
        // Seed initial empty row
        initialRoutineList.push({ subject: '', date: '' });
    }

    const [instructions, setInstructions] = useState<string[]>(initialInstructions);
    const [routineList, setRoutineList] = useState<RoutineItem[]>(initialRoutineList);

    const { data, setData, post, put, processing, errors } = useForm({
        class_name: admitCard?.class_name ?? '',
        section: admitCard?.section ?? '',
        exam_name: admitCard?.exam_name ?? '',
        academic_year: admitCard?.academic_year ?? '2026',
        start_time: admitCard?.start_time ?? '09:00 AM',
        instructions: [] as string[],
        routine: {} as Record<string, string>,
    });

    // Keep form data instructions & routine synced when state changes
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            instructions: instructions.filter(i => i.trim() !== ''),
            routine: routineList.reduce((acc, item) => {
                if (item.subject.trim() !== '') {
                    acc[item.subject] = item.date;
                }
                return acc;
            }, {} as Record<string, string>)
        }));
    }, [instructions, routineList]);

    const [customClass, setCustomClass] = useState(classes.length === 0 || (isEdit && !classes.includes(data.class_name)));
    const [customSection, setCustomSection] = useState(sections.length === 0 || (isEdit && !sections.includes(data.section)));
    const [customExam, setCustomExam] = useState(exams.length === 0 || (isEdit && !exams.includes(data.exam_name)));
    const [customYear, setCustomYear] = useState(years.length === 0 || (isEdit && !years.includes(data.academic_year)));

    // Instructions management
    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleRemoveInstruction = (index: number) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const handleInstructionChange = (index: number, val: string) => {
        const updated = [...instructions];
        updated[index] = val;
        setInstructions(updated);
    };

    // Routine management
    const handleAddRoutineRow = () => {
        setRoutineList([...routineList, { subject: '', date: '' }]);
    };

    const handleRemoveRoutineRow = (index: number) => {
        setRoutineList(routineList.filter((_, i) => i !== index));
    };

    const handleRoutineChange = (index: number, field: keyof RoutineItem, val: string) => {
        const updated = [...routineList];
        updated[index][field] = val;
        setRoutineList(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final verification of routine mapping
        const finalRoutine = routineList.reduce((acc, item) => {
            if (item.subject.trim() !== '') {
                acc[item.subject] = item.date;
            }
            return acc;
        }, {} as Record<string, string>);

        const payload = {
            ...data,
            instructions: instructions.filter(i => i.trim() !== ''),
            routine: finalRoutine
        };

        if (isEdit && admitCard) {
            put(`/admit-cards/${admitCard.id}`);
        } else {
            post('/admit-cards');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Admit Card Config' : 'Create Admit Card Config'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/admit-cards">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Admit Card Configuration' : 'Create Admit Card Configuration'}</h1>
                        <p className="text-sm text-muted-foreground">
                            Configure standard details, instructions, and dates for exam admit cards.
                        </p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Settings */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold border-b pb-2">1. Target Class & Exam Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                {errors.class_name && <p className="text-xs text-red-500">{errors.class_name}</p>}
                            </div>

                            {/* Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="section">Section</Label>
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
                                        placeholder="e.g. A"
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
                                {errors.section && <p className="text-xs text-red-500">{errors.section}</p>}
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
                                {errors.exam_name && <p className="text-xs text-red-500">{errors.exam_name}</p>}
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
                                {errors.academic_year && <p className="text-xs text-red-500">{errors.academic_year}</p>}
                            </div>

                            {/* Start Time */}
                            <div className="space-y-2">
                                <Label htmlFor="start_time">Exam Start Time</Label>
                                <Input
                                    id="start_time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    placeholder="e.g. 09:00 AM"
                                    required
                                />
                                {errors.start_time && <p className="text-xs text-red-500">{errors.start_time}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Routine Schedule */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">2. Exam Routine</h2>
                            <Button type="button" size="sm" variant="outline" onClick={handleAddRoutineRow} className="text-xs">
                                <Plus className="mr-1 size-3.5" /> Add Exam Row
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {routineList.map((row, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Subject Name</Label>
                                            <Select
                                                value={row.subject}
                                                onValueChange={(val) => handleRoutineChange(index, 'subject', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Subject..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map((sub) => (
                                                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Exam Date & Day</Label>
                                            <Input
                                                value={row.date}
                                                onChange={(e) => handleRoutineChange(index, 'date', e.target.value)}
                                                placeholder="e.g. 01/07/2026 [Wed]"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="mt-5 text-red-500 hover:text-red-700 size-8"
                                        onClick={() => handleRemoveRoutineRow(index)}
                                        disabled={routineList.length === 1}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">3. Candidate Instructions</h2>
                            <Button type="button" size="sm" variant="outline" onClick={handleAddInstruction} className="text-xs">
                                <Plus className="mr-1 size-3.5" /> Add Instruction
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {instructions.map((inst, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-muted-foreground w-6">{index + 1}.</span>
                                    <Input
                                        value={inst}
                                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                                        placeholder={`Instruction ${index + 1}`}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 size-8"
                                        onClick={() => handleRemoveInstruction(index)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/admit-cards">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update Configuration' : 'Save Configuration'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
