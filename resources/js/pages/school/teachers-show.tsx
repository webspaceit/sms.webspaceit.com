import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Teacher = {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    designation: string;
    phone: string;
    email: string | null;
    district: string;
    joining_date: string;
};

export default function TeachersShow({ teacher }: { teacher: Teacher }) {
    return (
        <>
            <Head title={`${teacher.name} - Teacher Details`} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/teachers">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">{teacher.name}</h1>
                        <p className="text-sm text-muted-foreground">{teacher.employee_id}</p>
                    </div>
                    <Button asChild>
                        <Link href={`/teachers/${teacher.id}/edit`}>
                            <Edit2 className="mr-2 size-4" /> Edit Teacher
                        </Link>
                    </Button>
                </section>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Employee ID</p>
                                <p className="font-semibold">{teacher.employee_id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-semibold">{teacher.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Department</p>
                                <Badge variant="secondary">{teacher.department}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Designation</p>
                                <p className="font-semibold">{teacher.designation}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-semibold">{teacher.phone}</p>
                            </div>
                            {teacher.email && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-semibold">{teacher.email}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">District</p>
                                <p className="font-semibold">{teacher.district}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Joining Date</p>
                                <p className="font-semibold">{teacher.joining_date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

TeachersShow.layout = {
    breadcrumbs: [
        { title: 'Teachers', href: '/teachers' },
        { title: 'Details', href: '' },
    ],
};
