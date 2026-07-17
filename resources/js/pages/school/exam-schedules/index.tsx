import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Printer, Search, Trash2, Timer } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ExamSchedule = { id: number; exam_name: string; class_name: string; subject_name: string; date: string; start_time: string; end_time: string; hall_name: string | null };
type Props = { schedules: ExamSchedule[]; exams: { id: number; name: string }[]; filters?: { exam_id?: string; search?: string } };

export default function Index({ schedules, exams, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [examId, setExamId] = useState(filters?.exam_id ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/exam-schedules', { exam_id: examId, search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this schedule?')) router.delete(`/exam-schedules/${id}`); };

    const handlePrint = () => window.print();

    return (
        <>
            <Head title="Exam Schedules" />
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th { background: #1e40af !important; color: #fff !important; padding: 8px 12px; text-align: left; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    td { padding: 6px 12px; border-bottom: 1px solid #ddd; }
                }
            `}</style>
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between no-print">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Timer className="size-6 text-pink-600" /> Exam Schedules</h1><p className="text-sm text-muted-foreground">Schedule subjects for exams.</p></div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 size-4" /> PDF / Print</Button>
                        <Button asChild><Link href="/exam-schedules/create"><Plus className="mr-2 size-4" /> Add Schedule</Link></Button>
                    </div>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2 flex-wrap no-print">
                    <Select value={examId} onValueChange={setExamId}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="All Exams" /></SelectTrigger>
                        <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {(filters?.search || filters?.exam_id) && <Button type="button" variant="ghost" onClick={() => { setSearch(''); setExamId(''); router.get('/exam-schedules'); }}>Clear</Button>}
                </form>
                <div id="print-area">
                    <h2 className="text-lg font-semibold mb-2 hidden print:block">Exam Schedule</h2>
                    <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left text-muted-foreground">
                                    <tr><th className="px-4 py-3 font-medium">Exam</th><th className="px-4 py-3 font-medium">Class</th><th className="px-4 py-3 font-medium">Subject</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Time</th><th className="px-4 py-3 font-medium">Hall</th><th className="px-4 py-3 font-medium text-right no-print">Actions</th></tr>
                                </thead>
                                <tbody>
                                     {schedules.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No schedules found.</td></tr>
                                     : schedules.map((item) => (
                                         <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                             <td className="px-4 py-3">{item.exam_name}</td>
                                             <td className="px-4 py-3">{item.class_name}</td>
                                             <td className="px-4 py-3 font-medium">{item.subject_name}</td>
                                            <td className="px-4 py-3">{item.date}</td>
                                            <td className="px-4 py-3">{item.start_time} - {item.end_time}</td>
                                            <td className="px-4 py-3">{item.hall_name ?? '-'}</td>
                                            <td className="px-4 py-3 text-right no-print">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/exam-schedules/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                    <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Exam Schedules', href: '/exam-schedules' }] };
