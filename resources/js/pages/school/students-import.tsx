import { Head, Link, router } from '@inertiajs/react';
import { Download, FileUp, Upload, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Section = { id: number; name: string; class_id: number };
type Props = { classes: { id: number; name: string }[]; sections: Section[]; importResults?: { success: number; skipped: number; errors: string[] } | null };

const SAMPLE_CSV = `name,class_name,section_name,roll_no,gender,date_of_birth,guardian_name,guardian_phone,admission_date,nationality,national_id,mother_name,mother_phone,religion,blood_group,address,mobile_number
Md. Rahim,Six,A,1,Male,2014-01-15,Abdul Karim,01711111111,2026-01-01,Bangladeshi,1234567890,Fatima Begum,01711111112,Islam,O+,Dhaka,01711111113
Fatima Akter,Seven,B,2,Female,2013-05-20,Md. Hasan,01722222221,2026-01-15,Bangladeshi,,Ayesha Bibi,01722222222,Islam,B+,Chittagong,01722222223`;

export default function StudentsImport({ classes, sections, importResults }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleDownloadSample = () => {
        const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_import_sample.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] ?? null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        setSubmitting(true);
        const form = new FormData();
        form.append('file', selectedFile);
        router.post('/students/import', form, {
            onFinish: () => {
                setSubmitting(false);
                setSelectedFile(null);
                if (fileRef.current) fileRef.current.value = '';
            },
        });
    };

    return (
        <>
            <Head title="Import Students" />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/students"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><FileUp className="size-6 text-green-600" /> Import Students</h1><p className="text-sm text-muted-foreground">Bulk import students from a CSV file.</p></div>
                </section>

                {importResults && (
                    <section className={`rounded-lg border p-5 ${importResults.errors.length > 0 ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20' : 'border-green-200 bg-green-50 dark:bg-green-950/20'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            {importResults.errors.length > 0
                                ? <AlertCircle className="size-6 text-amber-600" />
                                : <CheckCircle className="size-6 text-green-600" />
                            }
                            <div>
                                <p className="font-semibold text-lg">{importResults.success} imported, {importResults.skipped} skipped</p>
                            </div>
                        </div>
                        {importResults.errors.length > 0 && (
                            <div className="max-h-48 overflow-y-auto space-y-1">
                                {importResults.errors.map((err, i) => (
                                    <p key={i} className="text-sm text-red-600 flex items-start gap-2">
                                        <XCircle className="size-4 mt-0.5 shrink-0" />
                                        <span>{err}</span>
                                    </p>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                <section className="rounded-lg border bg-card shadow-sm">
                    <header className="border-b px-5 py-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Upload CSV</h4>
                    </header>
                    <div className="p-5 space-y-4">
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>Upload a CSV file with student data. Required columns:</p>
                            <code className="block bg-muted p-3 rounded text-xs leading-relaxed">
                                name, class_name, section_name, roll_no, gender, date_of_birth, guardian_name, guardian_phone
                            </code>
                            <p>Optional columns: mother_name, mother_phone, religion, blood_group, address, mobile_number, nationality, caste, previous_school, email, district, name_bn, status, admission_date (defaults to today), national_id, local_id, note</p>
                        </div>

                        <Button variant="outline" size="sm" onClick={handleDownloadSample}>
                            <Download className="mr-2 size-4" /> Download Sample CSV
                        </Button>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file">Select CSV File</Label>
                                <input
                                    ref={fileRef}
                                    id="file"
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={!selectedFile || submitting}>
                                    <Upload className="mr-2 size-4" /> {submitting ? 'Importing...' : 'Import'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>

                {classes.length > 0 && (
                    <section className="rounded-lg border bg-card shadow-sm">
                        <header className="border-b px-5 py-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Reference — Available Classes &amp; Sections</h4>
                        </header>
                        <div className="p-5">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="px-3 py-2 text-left font-medium">Class</th>
                                        <th className="px-3 py-2 text-left font-medium">Sections</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map((c) => (
                                        <tr key={c.id} className="border-t">
                                            <td className="px-3 py-2 font-medium">{c.name}</td>
                                            <td className="px-3 py-2">
                                                {sections.filter((s) => s.class_id === c.id).map((s) => s.name).join(', ') || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}

StudentsImport.layout = { breadcrumbs: [{ title: 'Students', href: '/students' }, { title: 'Import', href: '' }] };
