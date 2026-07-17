import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, Bus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TransportRoute = { id: number; name: string; driver_name: string; driver_phone: string; vehicle_no: string; fare: number };
export default function Index({ routes, filters }: { routes: TransportRoute[]; filters?: { search?: string } }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/transport-routes', { search }, { preserveState: true }); };
    const handleDelete = (id: number, name: string) => { if (confirm(`Delete ${name}?`)) router.delete(`/transport-routes/${id}`); };

    return (
        <>
            <Head title="Transport Routes" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><Bus className="size-6 text-yellow-600" /> Transport Routes</h1><p className="text-sm text-muted-foreground">Manage school transport routes, drivers, and fares.</p></div>
                    <Button asChild><Link href="/transport-routes/create"><Plus className="mr-2 size-4" /> Add Route</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {filters?.search && <Button type="button" variant="ghost" onClick={() => { setSearch(''); router.get('/transport-routes'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Route</th><th className="px-4 py-3 font-medium">Driver</th><th className="px-4 py-3 font-medium">Vehicle</th><th className="px-4 py-3 font-medium">Fare (BDT)</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {routes.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No routes found.</td></tr>
                                : routes.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3">{item.driver_name}<br /><span className="text-xs text-muted-foreground">{item.driver_phone}</span></td>
                                        <td className="px-4 py-3">{item.vehicle_no}</td>
                                        <td className="px-4 py-3">BDT {Number(item.fare).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/transport-routes/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id, item.name)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Transport Routes', href: '/transport-routes' }] };
