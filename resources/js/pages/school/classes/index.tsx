import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit2, Plus, Search, Trash2, LayoutGrid, Check, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type SectionItem = { id: number; name: string };
type ClassItem = { id: number; name: string; shift?: string; sections: SectionItem[] };

export default function Index({
    classes,
    sectionOptions,
    filters,
}: {
    classes: ClassItem[];
    sectionOptions: string[];
    filters?: { search?: string };
}) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        shift: 'Morning',
        sections: [] as string[],
    });

    const toggleSection = (name: string) => {
        setData(
            'sections',
            data.sections.includes(name)
                ? data.sections.filter((s) => s !== name)
                : [...data.sections, name]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/classes', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/classes', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete ${name}? This will also delete all students under this class.`))
            router.delete(`/classes/${id}`);
    };

    return (
        <>
            <Head title="Classes" />
            <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <LayoutGrid className="size-6 text-orange-600" /> Classes
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage class levels and sections.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="border-b px-5 py-3.5">
                                <h3 className="font-semibold text-base">Add Class</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Class <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Class 5"
                                        required
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="add-shift">Shift</Label>
                                    <select
                                        id="add-shift"
                                        value={data.shift}
                                        onChange={(e) => setData('shift', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="Morning">Morning</option>
                                        <option value="Day">Day</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Sections <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="space-y-1.5 pt-1">
                                        {sectionOptions.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No sections available.
                                            </p>
                                        ) : (
                                            sectionOptions.map((name) => (
                                                <div key={name} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`section-${name}`}
                                                        checked={data.sections.includes(name)}
                                                        onCheckedChange={() => toggleSection(name)}
                                                    />
                                                    <Label
                                                        htmlFor={`section-${name}`}
                                                        className="text-sm font-normal cursor-pointer"
                                                    >
                                                        {name}
                                                    </Label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {errors.sections && (
                                        <p className="text-sm text-red-500">
                                            {errors.sections}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full"
                                    >
                                        <Save className="mr-2 size-4" /> Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="border-b px-5 py-3.5">
                                <h3 className="font-semibold text-base">Class List</h3>
                            </div>

                            <div className="p-3 border-b">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex items-center gap-2"
                                >
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button type="submit" variant="secondary" size="sm">
                                        Search
                                    </Button>
                                    {filters?.search && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearch('');
                                                router.get('/classes');
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </form>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/60 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Class</th>
                                            <th className="px-4 py-3 font-medium">Shift</th>
                                            <th className="px-4 py-3 font-medium">Sections</th>
                                            <th className="px-4 py-3 font-medium text-right">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-8 text-center text-muted-foreground"
                                                >
                                                    No classes found.
                                                </td>
                                            </tr>
                                        ) : (
                                            classes.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-t hover:bg-muted/40 transition-colors"
                                                >
                                                    <td className="px-4 py-3 font-medium">
                                                        {item.name}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {item.shift ?? 'Morning'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.sections.length > 0
                                                            ? item.sections.map((s) => (
                                                                  <div key={s.id}>{s.name}</div>
                                                              ))
                                                            : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="size-8"
                                                                asChild
                                                                title="Edit"
                                                            >
                                                                <Link
                                                                    href={`/classes/${item.id}/edit`}
                                                                >
                                                                    <Edit2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="size-8"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id,
                                                                        item.name
                                                                    )
                                                                }
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="size-3.5 text-red-600 dark:text-red-400" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Classes', href: '/classes' }] };
