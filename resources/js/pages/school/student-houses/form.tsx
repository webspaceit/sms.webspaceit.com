import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Languages, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type StudentHouse = { id: number; name: string; name_bn: string | null; color: string | null; description: string | null };
type Props = { studentHouse?: StudentHouse; isEdit: boolean };

export default function Form({ studentHouse, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: studentHouse?.name ?? '',
        name_bn: studentHouse?.name_bn ?? '',
        color: studentHouse?.color ?? '',
        description: studentHouse?.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && studentHouse) put(`/student-houses/${studentHouse.id}`);
        else post('/student-houses');
    };

    const handleTranslate = async () => {
        if (!data.name) return;
        try {
            const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(data.name)}`
            );
            const json = await res.json();
            const translated = json[0]?.[0]?.[0];
            if (translated) setData('name_bn', translated);
        } catch {
            setData('name_bn', data.name);
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit House' : 'Create House'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild><Link href="/student-houses"><ArrowLeft className="size-4" /></Link></Button>
                    <div><h1 className="text-2xl font-semibold">{isEdit ? 'Edit House' : 'Create House'}</h1><p className="text-sm text-muted-foreground">{isEdit ? 'Update student house.' : 'Add a new student house/group.'}</p></div>
                </section>
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="name">Name (English)</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Blue House" required />{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}</div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="name_bn">Name (Bangla)</Label>
                                {data.name && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button type="button" onClick={handleTranslate} className="text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                                                <Languages className="size-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">Translate from English</p></TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                            <Input id="name_bn" value={data.name_bn} onChange={(e) => setData('name_bn', e.target.value)} placeholder="e.g. ব্লু হাউস" />
                            {errors.name_bn && <p className="text-sm text-red-500">{errors.name_bn}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="color">Color</Label><div className="flex gap-2"><Input id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} placeholder="e.g. #3B82F6" /><input type="color" value={data.color || '#3B82F6'} onChange={(e) => setData('color', e.target.value)} className="size-10 cursor-pointer rounded border" /></div>{errors.color && <p className="text-sm text-red-500">{errors.color}</p>}</div>
                        <div className="space-y-2"><Label htmlFor="description">Description</Label><Input id="description" value={data.description ?? ''} onChange={(e) => setData('description', e.target.value)} placeholder="Optional description" /></div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/student-houses">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}><Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Student Houses', href: '/student-houses' }, { title: 'Manage', href: '' }] };
