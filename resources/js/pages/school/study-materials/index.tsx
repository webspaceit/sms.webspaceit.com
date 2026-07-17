import { Head, Link, router } from '@inertiajs/react';
import { Download, FileText, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Material = {
    id: number;
    title: string;
    description: string | null;
    file_path: string;
    file_type: string | null;
    class: { id: number; name: string } | null;
    subject: { id: number; name: string } | null;
    teacher: { id: number; name: string } | null;
    created_at: string;
};

type Props = {
    studyMaterials: Material[];
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
    filters: { class_id?: string; subject_id?: string };
};

export default function Index({ studyMaterials, classes, subjects, filters }: Props) {
    const [filterClass, setFilterClass] = useState(filters?.class_id ?? '');
    const [filterSubject, setFilterSubject] = useState(filters?.subject_id ?? '');

    const handleFilter = () => {
        router.get('/study-materials', { class_id: filterClass, subject_id: filterSubject }, { preserveState: true });
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Delete "${title}"?`)) router.delete(`/study-materials/${id}`);
    };

    return (
        <>
            <Head title="Study Materials" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <FileText className="size-6 text-indigo-600" /> Study Materials
                        </h1>
                        <p className="text-sm text-muted-foreground">Upload and manage study resources for classes and subjects.</p>
                    </div>
                    <Button asChild>
                        <Link href="/study-materials/create"><Upload className="mr-2 size-4" /> Upload Material</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setFilterSubject(''); }}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="All Subjects" /></SelectTrigger>
                        <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="secondary" onClick={handleFilter}><Search className="mr-1 size-4" /> Filter</Button>
                    {(filters?.class_id || filters?.subject_id) && (
                        <Button variant="ghost" onClick={() => { setFilterClass(''); setFilterSubject(''); router.get('/study-materials'); }}>Clear</Button>
                    )}
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {studyMaterials.length === 0 ? (
                        <div className="col-span-full rounded-lg border bg-card p-12 text-center text-muted-foreground">
                            <Upload className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No study materials yet</p>
                            <p className="text-sm">Upload the first material for your classes.</p>
                        </div>
                    ) : (
                        studyMaterials.map((material) => (
                            <article key={material.id} className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                            <FileText className="size-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold truncate">{material.title}</h3>
                                            {material.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{material.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={() => handleDelete(material.id, material.title)} title="Delete">
                                        <Trash2 className="size-3.5 text-red-500" />
                                    </Button>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                    {material.class && <span>{material.class.name}</span>}
                                    {material.subject && <span>{material.subject.name}</span>}
                                    {material.file_type && <span className="uppercase">.{material.file_type}</span>}
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t pt-3">
                                    <span className="text-xs text-muted-foreground">{new Date(material.created_at).toLocaleDateString()}</span>
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={`/storage/${material.file_path}`} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-1 size-3.5" /> Download
                                        </a>
                                    </Button>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Study Materials', href: '/study-materials' }] };
