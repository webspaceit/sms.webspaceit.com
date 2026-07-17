import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TransportStop = { id: number; route_name: string; name: string; pickup_time: string | null; drop_time: string | null; sort_order: number };
type Props = { stops: TransportStop[]; routes: { id: number; name: string }[]; filters?: { route_id?: string; search?: string } };

export default function Index({ stops, routes, filters }: Props) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [routeId, setRouteId] = useState(filters?.route_id ?? '');
    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/transport-stops', { route_id: routeId, search }, { preserveState: true }); };
    const handleDelete = (id: number) => { if (confirm('Delete this stop?')) router.delete(`/transport-stops/${id}`); };

    return (
        <>
            <Head title="Transport Stops" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h1 className="text-2xl font-semibold flex items-center gap-2"><MapPin className="size-6 text-lime-600" /> Transport Stops</h1><p className="text-sm text-muted-foreground">Manage route stop points and timings.</p></div>
                    <Button asChild><Link href="/transport-stops/create"><Plus className="mr-2 size-4" /> Add Stop</Link></Button>
                </div>
                <form onSubmit={handleSearch} className="flex max-w-xl items-center gap-2 flex-wrap">
                    <Select value={routeId} onValueChange={setRouteId}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="All Routes" /></SelectTrigger>
                        <SelectContent>{routes.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                    <Button type="submit" variant="secondary">Search</Button>
                    {(filters?.search || filters?.route_id) && <Button type="button" variant="ghost" onClick={() => { setSearch(''); setRouteId(''); router.get('/transport-stops'); }}>Clear</Button>}
                </form>
                <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/60 text-left text-muted-foreground">
                                <tr><th className="px-4 py-3 font-medium">Route</th><th className="px-4 py-3 font-medium">Stop</th><th className="px-4 py-3 font-medium">Pickup</th><th className="px-4 py-3 font-medium">Drop</th><th className="px-4 py-3 font-medium">Sort</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
                            </thead>
                            <tbody>
                                {stops.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No stops found.</td></tr>
                                : stops.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3">{item.route_name}</td>
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3">{item.pickup_time ?? '-'}</td>
                                        <td className="px-4 py-3">{item.drop_time ?? '-'}</td>
                                        <td className="px-4 py-3">{item.sort_order}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Button size="icon" variant="outline" className="size-8" asChild><Link href={`/transport-stops/${item.id}/edit`} title="Edit"><Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" /></Link></Button>
                                                <Button size="icon" variant="outline" className="size-8" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 className="size-3.5 text-red-600 dark:text-red-400" /></Button>
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

Index.layout = { breadcrumbs: [{ title: 'Transport Stops', href: '/transport-stops' }] };
