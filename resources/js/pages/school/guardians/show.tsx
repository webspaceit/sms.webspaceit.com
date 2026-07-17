import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit2, GraduationCap, Phone, MapPin, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type StudentInfo = {
    id: number;
    student_id: string;
    name: string;
    roll_no: number;
    class_name: string;
    section: string;
    schoolClass?: { id: number; name: string } | null;
};

type Guardian = {
    id: number;
    name: string;
    name_bn: string | null;
    phone: string;
    email: string | null;
    occupation: string | null;
    relation: string;
    address: string | null;
    district: string;
    nid: string | null;
    students: StudentInfo[];
};

export default function Show({ guardian }: { guardian: Guardian }) {
    return (
        <>
            <Head title={`${guardian.name} - Guardian Details`} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/guardians"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">{guardian.name}</h1>
                        <p className="text-sm text-muted-foreground">{guardian.relation}</p>
                    </div>
                    <Button asChild>
                        <Link href={`/guardians/${guardian.id}/edit`}>
                            <Edit2 className="mr-2 size-4" /> Edit Guardian
                        </Link>
                    </Button>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border bg-card shadow-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Personal Information</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Name (English)</p>
                                <p className="font-medium">{guardian.name}</p>
                            </div>
                            {guardian.name_bn && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Name (Bangla)</p>
                                    <p className="font-medium">{guardian.name_bn}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="size-3" /> Phone</p>
                                <p className="font-medium">{guardian.phone}</p>
                            </div>
                            {guardian.email && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{guardian.email}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">Relation</p>
                                <Badge variant="outline">{guardian.relation}</Badge>
                            </div>
                            {guardian.occupation && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Occupation</p>
                                    <p className="font-medium">{guardian.occupation}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="size-3" /> District</p>
                                <p className="font-medium">{guardian.district}</p>
                            </div>
                            {guardian.nid && (
                                <div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><FileText className="size-3" /> NID</p>
                                    <p className="font-medium">{guardian.nid}</p>
                                </div>
                            )}
                            {guardian.address && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Address</p>
                                    <p className="font-medium">{guardian.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card shadow-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <GraduationCap className="size-5" /> Linked Students
                        </h2>
                        {guardian.students.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No students linked to this guardian.</p>
                        ) : (
                            <div className="space-y-3">
                                {guardian.students.map((s) => (
                                    <div key={s.id} className="rounded-lg border bg-muted/30 p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Link
                                                    href={`/students/${s.id}`}
                                                    className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                                >
                                                    {s.name}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">ID: {s.student_id}</p>
                                            </div>
                                            <Badge>{(s.schoolClass?.name ?? s.class_name) || '-'} - {s.section || '-'}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Roll No: {s.roll_no}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Guardians', href: '/guardians' },
        { title: 'Details', href: '' },
    ],
};