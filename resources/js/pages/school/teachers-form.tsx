import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchableSelect from '@/components/ui/searchable-select';

type Teacher = {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    designation: string;
    phone: string;
    email: string | null;
    address: string | null;
    district: string;
    joining_date: string;
    subjects?: { id: number; name: string }[];
};

type TeachersFormProps = {
    teacher?: Teacher;
    isEdit: boolean;
    nextEmployeeId?: string;
    subjects: string[];
    allSubjects: { id: number; name: string }[];
    designations: string[];
    districts: string[];
};

export default function TeachersForm({ teacher, isEdit, nextEmployeeId, subjects, allSubjects, designations, districts }: TeachersFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        employee_id: teacher?.employee_id ?? nextEmployeeId ?? '',
        name: teacher?.name ?? '',
        department: teacher?.department ?? '',
        designation: teacher?.designation ?? '',
        phone: teacher?.phone ?? '',
        email: teacher?.email ?? '',
        address: teacher?.address ?? '',
        district: teacher?.district ?? '',
        joining_date: teacher?.joining_date ?? '',
        subject_ids: teacher?.subjects?.map((s) => s.id) ?? [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && teacher) {
            put(`/teachers/${teacher.id}`);
        } else {
            post('/teachers');
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Teacher' : 'Create Teacher'} />
            <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto w-full">
                <section className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href="/teachers">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Teacher' : 'Create Teacher'}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit ? 'Update teacher information.' : 'Add a new teacher to the faculty.'}
                        </p>
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employee_id">Employee ID</Label>
                            <Input
                                id="employee_id"
                                value={data.employee_id}
                                onChange={(e) => setData('employee_id', e.target.value)}
                                placeholder="e.g. TCH-001"
                                readOnly={!isEdit}
                                className={!isEdit ? 'bg-muted cursor-default' : ''}
                                required
                            />
                            {errors.employee_id && <p className="text-sm text-red-500">{errors.employee_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Md. Abdul Karim"
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <SearchableSelect
                                options={subjects.map((s) => ({ value: s, label: s }))}
                                value={data.department}
                                onChange={(val) => setData('department', val)}
                                placeholder="Search department..."
                            />
                            {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <SearchableSelect
                                options={designations.map((s) => ({ value: s, label: s }))}
                                value={data.designation}
                                onChange={(val) => setData('designation', val)}
                                placeholder="Search designation..."
                            />
                            {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="e.g. 017XXXXXXXX"
                                required
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="e.g. teacher@school.edu"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <select
                                id="district"
                                value={data.district}
                                onChange={(e) => setData('district', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="">Select district</option>
                                {districts.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="joining_date">Joining Date</Label>
                            <Input
                                id="joining_date"
                                type="date"
                                value={data.joining_date}
                                onChange={(e) => setData('joining_date', e.target.value)}
                                required
                            />
                            {errors.joining_date && <p className="text-sm text-red-500">{errors.joining_date}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. House-55, Road-16, Sector-14, Uttara, Dhaka"
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Subjects They Teach</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                            {allSubjects.map((s) => (
                                <div key={s.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`subject-${s.id}`}
                                        checked={data.subject_ids.includes(s.id)}
                                        onCheckedChange={(checked) => {
                                            setData('subject_ids', checked
                                                ? [...data.subject_ids, s.id]
                                                : data.subject_ids.filter((id) => id !== s.id)
                                            );
                                        }}
                                    />
                                    <Label htmlFor={`subject-${s.id}`} className="text-sm font-normal cursor-pointer">{s.name}</Label>
                                </div>
                            ))}
                        </div>
                        {errors.subject_ids && <p className="text-sm text-red-500">{errors.subject_ids}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/teachers">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> {isEdit ? 'Update Teacher' : 'Save Teacher'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

TeachersForm.layout = {
    breadcrumbs: [
        { title: 'Teachers', href: '/teachers' },
        { title: 'Manage', href: '' },
    ],
};
