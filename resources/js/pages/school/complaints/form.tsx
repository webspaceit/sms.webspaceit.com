import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

type Props = {
    complaint?: {
        id: number; complainant_name: string; complainant_phone: string | null;
        description: string; type: string; status: string;
        resolution_notes: string | null; resolver: { id: number; name: string } | null;
    };
    isEdit: boolean;
};

const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    investigating: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-800',
};

export default function Form({ complaint, isEdit }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        complainant_name: complaint?.complainant_name ?? '',
        complainant_phone: complaint?.complainant_phone ?? '',
        description: complaint?.description ?? '',
        type: complaint?.type ?? 'other',
        status: complaint?.status ?? 'pending',
        resolution_notes: complaint?.resolution_notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && complaint) {
            put(`/complaints/${complaint.id}`);
        } else {
            post('/complaints');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Complaint' : 'Add Complaint'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/complaints"><ArrowLeft className="size-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Complaint' : 'Add Complaint'}</h1>
                        <p className="text-sm text-muted-foreground">{isEdit ? 'Update complaint details and status.' : 'Submit a new complaint.'}</p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="complainant_name">Complainant Name <span className="text-red-500">*</span></Label>
                            <Input id="complainant_name" value={data.complainant_name} onChange={(e) => setData('complainant_name', e.target.value)} placeholder="Full name" required />
                            {errors.complainant_name && <p className="text-sm text-red-500">{errors.complainant_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="complainant_phone">Phone</Label>
                            <Input id="complainant_phone" value={data.complainant_phone} onChange={(e) => setData('complainant_phone', e.target.value)} placeholder="Phone number" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
                        <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                            <SelectTrigger id="type"><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Describe the complaint in detail..." rows={4} required />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {isEdit && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="investigating">Investigating</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="dismissed">Dismissed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resolution_notes">Resolution Notes</Label>
                                <Textarea id="resolution_notes" value={data.resolution_notes} onChange={(e) => setData('resolution_notes', e.target.value)} placeholder="Notes about resolution..." rows={3} />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild><Link href="/complaints">Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

Form.layout = { breadcrumbs: [{ title: 'Complaints', href: '/complaints' }, { title: 'Form', href: '' }] };
