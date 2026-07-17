import { Head, router, useForm } from '@inertiajs/react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Gateway = {
    id: number; name: string; provider_key: string; api_key: string | null;
    api_secret: string | null; merchant_id: string | null; is_active: boolean;
};

type Props = { gateways: Gateway[] };

export default function Index({ gateways }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data, setData, post, put, processing, reset } = useForm({
        id: 0, name: '', provider_key: '', api_key: '', api_secret: '', merchant_id: '', is_active: false,
    });

    const isEditing = data.id > 0;

    const handleDelete = (id: number) => {
        if (confirm('Delete this payment gateway?')) router.delete(`/payment-gateways/${id}`);
    };

    const openEdit = (g: Gateway) => {
        setData({ id: g.id, name: g.name, provider_key: g.provider_key, api_key: g.api_key ?? '', api_secret: g.api_secret ?? '', merchant_id: g.merchant_id ?? '', is_active: g.is_active });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/payment-gateways/${data.id}`, { onSuccess: () => { setDialogOpen(false); reset(); setData('id', 0); } });
        } else {
            post('/payment-gateways', { onSuccess: () => { setDialogOpen(false); reset(); } });
        }
    };

    return (
        <>
            <Head title="Payment Gateways" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <CreditCard className="size-6 text-emerald-600" /> Payment Gateways
                        </h1>
                        <p className="text-sm text-muted-foreground">Configure online payment gateways for fee collection.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { reset(); setData('id', 0); }}><Plus className="mr-2 size-4" /> Add Gateway</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>{isEditing ? 'Edit Gateway' : 'Add Payment Gateway'}</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Name <span className="text-red-500">*</span></Label>
                                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. bKash, Nagad, SSLCommerz" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Provider Key <span className="text-red-500">*</span></Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={data.provider_key} onChange={(e) => setData('provider_key', e.target.value)} required>
                                        <option value="">Select</option>
                                        <option value="bkash">bKash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="rocket">Rocket</option>
                                        <option value="sslcommerz">SSLCommerz</option>
                                        <option value="stripe">Stripe</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="aamarpay">Aamarpay</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <Input value={data.api_key} onChange={(e) => setData('api_key', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>API Secret</Label>
                                        <Input type="password" value={data.api_secret} onChange={(e) => setData('api_secret', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Merchant ID</Label>
                                        <Input value={data.merchant_id} onChange={(e) => setData('merchant_id', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="size-4" id="is_active" />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                                <Button type="submit" disabled={processing}>{isEditing ? 'Update' : 'Save'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gateways.length === 0 ? (
                        <div className="col-span-full rounded-lg border bg-card p-12 text-center text-muted-foreground">
                            <CreditCard className="mx-auto size-12 mb-3 opacity-40" />
                            <p className="text-lg font-medium">No payment gateways configured</p>
                        </div>
                    ) : (
                        gateways.map((g) => (
                            <article key={g.id} className="rounded-lg border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold">{g.name}</h3>
                                        <p className="text-xs text-muted-foreground">{g.provider_key}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(g)}><Trash2 className="size-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDelete(g.id)}><Trash2 className="size-3.5 text-red-500" /></Button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Badge variant="outline" className={g.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}>
                                        {g.is_active ? 'Active' : 'Inactive'}
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

Index.layout = { breadcrumbs: [{ title: 'Payment Gateways', href: '/payment-gateways' }] };
