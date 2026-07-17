import { Head, router, useForm } from '@inertiajs/react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Setting = {
    id: number; provider: string; api_key: string | null; api_secret: string | null;
    sender_id: string | null; api_base_url: string | null; is_active: boolean;
};

type Props = { settings: Setting[] };

export default function Index({ settings }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data, setData, post, put, processing, reset } = useForm({
        id: 0, provider: '', api_key: '', api_secret: '', sender_id: '', api_base_url: '', is_active: false,
    });

    const isEditing = data.id > 0;

    const handleDelete = (id: number) => {
        if (confirm('Delete this SMS setting?')) router.delete(`/sms-settings/${id}`);
    };

    const openEdit = (s: Setting) => {
        setData({ id: s.id, provider: s.provider, api_key: s.api_key ?? '', api_secret: s.api_secret ?? '', sender_id: s.sender_id ?? '', api_base_url: s.api_base_url ?? '', is_active: s.is_active });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/sms-settings/${data.id}`, { onSuccess: () => { setDialogOpen(false); reset(); setData('id', 0); } });
        } else {
            post('/sms-settings', { onSuccess: () => { setDialogOpen(false); reset(); } });
        }
    };

    return (
        <>
            <Head title="SMS Settings" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <MessageSquare className="size-6 text-emerald-600" /> SMS Integration
                        </h1>
                        <p className="text-sm text-muted-foreground">Configure SMS providers for notifications and alerts.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { reset(); setData('id', 0); }}><Plus className="mr-2 size-4" /> Add Provider</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>{isEditing ? 'Edit Provider' : 'Add SMS Provider'}</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Provider <span className="text-red-500">*</span></Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={data.provider} onChange={(e) => setData('provider', e.target.value)} required>
                                        <option value="">Select provider</option>
                                        <option value="twilio">Twilio</option>
                                        <option value="twilio_sms">Twilio SMS</option>
                                        <option value="textlocal">TextLocal</option>
                                        <option value="plivo">Plivo</option>
                                        <option value="vonage">Vonage (Nexmo)</option>
                                        <option value="bulksmsbd">BulkSMSBD</option>
                                        <option value="others">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <Input value={data.api_key} onChange={(e) => setData('api_key', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>API Secret</Label>
                                    <Input type="password" value={data.api_secret} onChange={(e) => setData('api_secret', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sender ID</Label>
                                        <Input value={data.sender_id} onChange={(e) => setData('sender_id', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>API Base URL</Label>
                                        <Input value={data.api_base_url} onChange={(e) => setData('api_base_url', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="size-4" id="is_active" />
                                    <Label htmlFor="is_active">Active (send SMS through this provider)</Label>
                                </div>
                                <Button type="submit" disabled={processing}>{isEditing ? 'Update' : 'Save'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {settings.length === 0 ? (
                        <div className="col-span-full rounded-lg border bg-card p-12 text-center text-muted-foreground">
                            <MessageSquare className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No SMS providers configured</p>
                        </div>
                    ) : (
                        settings.map((s) => (
                            <article key={s.id} className="rounded-lg border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold capitalize">{s.provider.replace(/_/g, ' ')}</h3>
                                        {s.sender_id && <p className="text-xs text-muted-foreground">Sender: {s.sender_id}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(s)}><Trash2 className="size-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete(s.id)}><Trash2 className="size-3.5 text-red-500" /></Button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Badge variant="outline" className={s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}>
                                        {s.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'SMS Settings', href: '/sms-settings' }] };
