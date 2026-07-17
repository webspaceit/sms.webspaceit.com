import { Head, router } from '@inertiajs/react';
import { Download, IdCard, Printer } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
    classes: { id: number; name: string }[];
    teachers: { id: number; name: string; employee_id: string; designation: string | null }[];
    students: {
        id: number; student_id: string; name: string; class_name: string; section: string;
        roll_no: number; blood_group: string | null; photo: string | null;
    }[];
    school: { name: string; address: string };
};

export default function Index({ classes, teachers, students, school }: Props) {
    const [type, setType] = useState('student');
    const [classId, setClassId] = useState('');
    const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
    const printRef = useRef<HTMLDivElement>(null);

    const filteredStudents = classId
        ? students.filter((s) => {
            const cls = classes.find((c) => c.id.toString() === classId);
            return cls && s.class_name === cls.name;
        })
        : students;

    const items = type === 'teacher' ? teachers : filteredStudents;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        const cardsHtml = document.getElementById('id-cards-content')?.innerHTML ?? '';
        printWindow.document.write(`
            <html><head><title>ID Cards</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .id-cards-grid { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
                .id-card { border: 2px solid #000; border-radius: 8px; overflow: hidden; page-break-inside: avoid; }
                .id-card.horizontal { width: 320px; display: flex; padding: 12px; }
                .id-card.vertical { width: 240px; text-align: center; padding: 16px; }
                .id-card .photo { width: 80px; height: 80px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #6b7280; overflow: hidden; }
                .id-card.vertical .photo { margin: 0 auto 8px; }
                .id-card .details { flex: 1; }
                .id-card .school-name { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
                .id-card .id-label { font-size: 10px; color: #6b7280; }
                .id-card .id-value { font-size: 12px; font-weight: 600; }
                .id-card .field { margin-bottom: 2px; }
                @media print { @page { margin: 10mm; } body { -webkit-print-color-adjust: exact; } }
            </style></head><body><div class="id-cards-grid">${cardsHtml}</div>
            <script>window.print(); window.close();</script></body></html>
        `);
        printWindow.document.close();
    };

    return (
        <>
            <Head title="ID Cards" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <IdCard className="size-6 text-purple-600" /> ID Card Generation
                        </h1>
                        <p className="text-sm text-muted-foreground">Generate and print ID cards for students, teachers, and staff.</p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-1.5">
                            <Label>Card Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Students</SelectItem>
                                    <SelectItem value="teacher">Teachers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {type === 'student' && (
                            <div className="space-y-1.5">
                                <Label>Class</Label>
                                <Select value={classId} onValueChange={setClassId}>
                                    <SelectTrigger className="w-44"><SelectValue placeholder="All classes" /></SelectTrigger>
                                    <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label>Layout</Label>
                            <Select value={layout} onValueChange={(v) => setLayout(v as 'horizontal' | 'vertical')}>
                                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="horizontal">Horizontal</SelectItem>
                                    <SelectItem value="vertical">Vertical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handlePrint}><Printer className="mr-2 size-4" /> Print Cards</Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm" ref={printRef}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">{items.length} card(s) generated</p>
                    </div>
                    <div id="id-cards-content" className="flex flex-wrap gap-4 justify-center">
                        {items.length === 0 ? (
                            <p className="text-muted-foreground py-8">No records found for the selected criteria.</p>
                        ) : (
                            items.map((item: any) => (
                                layout === 'horizontal' ? (
                                    <div key={item.id} className="id-card horizontal" style={{ border: '2px solid #000', borderRadius: 8, display: 'flex', padding: 12, width: 320, pageBreakInside: 'avoid' }}>
                                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#6b7280', overflow: 'hidden', marginRight: 12, flexShrink: 0 }}>
                                            {item.photo ? <img src={`/storage/${item.photo}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
                                        </div>
                                        <div style={{ flex: 1, fontSize: 11 }}>
                                            <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{school.name}</div>
                                            <div className="field"><span className="id-label">Name: </span><span className="id-value">{item.name}</span></div>
                                            {type === 'student' && (
                                                <>
                                                    <div className="field"><span className="id-label">ID: </span><span className="id-value">{item.student_id}</span></div>
                                                    <div className="field"><span className="id-label">Class: </span><span className="id-value">{item.class_name} - {item.section}</span></div>
                                                    <div className="field"><span className="id-label">Roll: </span><span className="id-value">{item.roll_no}</span></div>
                                                </>
                                            )}
                                            {type === 'teacher' && (
                                                <>
                                                    <div className="field"><span className="id-label">ID: </span><span className="id-value">{item.employee_id}</span></div>
                                                    <div className="field"><span className="id-label">Designation: </span><span className="id-value">{item.designation ?? '-'}</span></div>
                                                </>
                                            )}
                                            {item.blood_group && <div className="field"><span className="id-label">Blood: </span><span className="id-value">{item.blood_group}</span></div>}
                                        </div>
                                    </div>
                                ) : (
                                    <div key={item.id} className="id-card vertical" style={{ border: '2px solid #000', borderRadius: 8, textAlign: 'center', padding: 16, width: 240, pageBreakInside: 'avoid' }}>
                                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#6b7280', overflow: 'hidden', margin: '0 auto 8px' }}>
                                            {item.photo ? <img src={`/storage/${item.photo}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>{school.name}</div>
                                        <div style={{ fontSize: 11, marginBottom: 2 }}>{school.address}</div>
                                        <hr style={{ margin: '6px 0' }} />
                                        <div style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</div>
                                        {type === 'student' && (
                                            <>
                                                <div style={{ fontSize: 10, color: '#6b7280' }}>{item.student_id}</div>
                                                <div style={{ fontSize: 10 }}>{item.class_name} - {item.section} | Roll: {item.roll_no}</div>
                                            </>
                                        )}
                                        {type === 'teacher' && (
                                            <>
                                                <div style={{ fontSize: 10, color: '#6b7280' }}>{item.employee_id}</div>
                                                <div style={{ fontSize: 10 }}>{item.designation ?? ''}</div>
                                            </>
                                        )}
                                        {item.blood_group && <div style={{ fontSize: 10, marginTop: 4 }}>Blood: {item.blood_group}</div>}
                                    </div>
                                )
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'ID Cards', href: '/id-cards' }] };
