import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Question = {
    id: number; question: string; type: string; options: string[] | null; correct_answer: string | null; marks: number;
};

type Props = {
    onlineExam: {
        id: number; title: string; total_marks: number; status: string;
        questions: Question[];
    };
};

export default function Questions({ onlineExam }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        question: '',
        type: 'mcq',
        options: ['', '', '', ''],
        correct_answer: '',
        marks: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = data.type === 'mcq' ? data.options.filter((o) => o.trim() !== '') : null;
        post(`/online-exams/${onlineExam.id}/questions`, {
            ...data,
            options,
        } as any, {
            onSuccess: () => { setDialogOpen(false); reset(); setData('options', ['', '', '', '']); },
        });
    };

    const deleteQuestion = (questionId: number) => {
        if (confirm('Delete this question?')) router.delete(`/online-exams/${onlineExam.id}/questions/${questionId}`);
    };

    const updateOption = (index: number, value: string) => {
        const opts = [...data.options];
        opts[index] = value;
        setData('options', opts);
    };

    return (
        <>
            <Head title={`Questions - ${onlineExam.title}`} />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/online-exams"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">{onlineExam.title}</h1>
                        <p className="text-sm text-muted-foreground">Total Marks: {onlineExam.total_marks} | Questions: {onlineExam.questions.length}</p>
                    </div>
                    {onlineExam.status === 'draft' && (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild><Button><Plus className="mr-2 size-4" /> Add Question</Button></DialogTrigger>
                            <DialogContent className="max-w-xl">
                                <DialogHeader><DialogTitle>Add Question</DialogTitle></DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Question <span className="text-red-500">*</span></Label>
                                        <Textarea value={data.question} onChange={(e) => setData('question', e.target.value)} rows={3} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                                <option value="mcq">MCQ</option>
                                                <option value="written">Written</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Marks <span className="text-red-500">*</span></Label>
                                            <Input type="number" min="1" value={data.marks} onChange={(e) => setData('marks', e.target.value)} required />
                                        </div>
                                    </div>
                                    {data.type === 'mcq' && (
                                        <div className="space-y-3">
                                            <Label>Options</Label>
                                            {data.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <Input value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                                                    <input type="radio" name="correct" checked={data.correct_answer === (i + 1).toString()} onChange={() => setData('correct_answer', (i + 1).toString())} className="size-4" title="Mark as correct" />
                                                </div>
                                            ))}
                                            <p className="text-xs text-muted-foreground">Select radio button for the correct answer</p>
                                        </div>
                                    )}
                                    <Button type="submit" disabled={processing}>Add Question</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <section className="space-y-3">
                    {onlineExam.questions.length === 0 ? (
                        <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
                            <HelpCircle className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No questions yet</p>
                            <p className="text-sm">Add questions to this exam.</p>
                        </div>
                    ) : (
                        onlineExam.questions.map((q, idx) => (
                            <div key={q.id} className="rounded-lg border bg-card p-4">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-muted-foreground">Q{idx + 1}.</span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">{q.type}</span>
                                            <span className="text-xs text-muted-foreground">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{q.question}</p>
                                        {q.options && q.options.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {q.options.map((opt, oi) => (
                                                    <li key={oi} className={`text-sm flex items-center gap-2 ${q.correct_answer === (oi + 1).toString() ? 'text-emerald-600 font-medium' : ''}`}>
                                                        <span className="size-5 rounded-full border inline-flex items-center justify-center text-xs">{String.fromCharCode(65 + oi)}</span>
                                                        {opt} {q.correct_answer === (oi + 1).toString() && '✓'}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {q.type === 'written' && q.correct_answer && (
                                            <p className="text-xs text-emerald-600 mt-1">Answer: {q.correct_answer}</p>
                                        )}
                                    </div>
                                    {onlineExam.status === 'draft' && (
                                        <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={() => deleteQuestion(q.id)} title="Delete">
                                            <Trash2 className="size-3.5 text-red-500" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}

Questions.layout = { breadcrumbs: [{ title: 'Online Exams', href: '/online-exams' }, { title: 'Questions', href: '' }] };
