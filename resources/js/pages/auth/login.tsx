import { Head, Link, usePage, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { home } from '@/routes';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

const roleCredentials: Record<string, { email: string; password: string }> = {
    'Super Admin':  { email: 'superadmin@school.test', password: 'password' },
    Admin:          { email: 'admin@school.test',      password: 'password' },
    Teacher:        { email: 'teacher@school.test',    password: 'password' },
    Accountant:     { email: 'accountant@school.test', password: 'password' },
    Receptionist:   { email: 'receptionist@school.test',password: 'password' },
    Librarian:      { email: 'librarian@school.test',  password: 'password' },
};

const newsItems = [
    {
        title: 'National Level Workshop for Science Teachers Teaching in Class X to XII (Online)',
        date: '22nd November, 2022',
        excerpt:
            'A two-day capacity building programme was...',
    },
    {
        title: 'New Books Added to Library',
        date: '15th November, 2022',
        excerpt:
            'The school library has added new educational and...',
    },
    {
        title: 'Unit Test Schedule Released',
        date: '10th November, 2022',
        excerpt:
            'The schedule for the upcoming unit test has been...',
    },
    {
        title: 'The Junior Red Cross',
        date: '5th November, 2022',
        excerpt:
            '"Happiness doesn\'t result from what we get, but...',
    },
    {
        title: "Parents and Guardians Teacher's Meeting",
        date: '28th October, 2022',
        excerpt:
            'Dear parents and guardians, There...',
    },
];

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { name } = usePage().props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setLoginErrors({});
        router.post(store.url(), { email, password, remember }, {
            onError: (err) => {
                setLoginErrors(err);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    }

    function fillRole(role: string) {
        const creds = roleCredentials[role];
        setEmail(creds.email);
        setPassword(creds.password);
    }

    return (
        <>
            <Head title="Log in" />

            <div className="flex h-dvh bg-gradient-to-br from-emerald-600 to-teal-500">
                <div className="flex h-dvh w-full max-w-[1200px] flex-col overflow-hidden bg-white shadow-2xl md:mx-auto md:flex-row">
                    <div className="flex flex-col items-center overflow-y-auto p-8 md:w-1/2 md:p-10">
                        <div className="mb-6 flex flex-col items-center gap-3">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600">
                                    <AppLogoIcon className="size-10 fill-white" />
                                </div>
                            </Link>
                            <h2 className="text-xl font-bold text-gray-800">
                                Admin Login
                            </h2>
                            <p className="text-sm text-gray-500">Sign In</p>
                        </div>

                        <div className="mb-6 flex flex-wrap justify-center gap-2">
                            {Object.keys(roleCredentials).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => fillRole(role)}
                                    className="cursor-pointer rounded-full border border-emerald-600 bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <p className="mb-6 text-center text-xs text-gray-400">
                            *Note: Click a role above to auto-fill credentials,
                            then click Sign In.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="flex w-full flex-col gap-5"
                        >
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Enter Your Email"
                                        className="h-11 rounded-lg border-gray-300 text-black"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    <InputError message={loginErrors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter Your Password"
                                        className="h-11 rounded-lg border-gray-300 text-black"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <InputError message={loginErrors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        tabIndex={3}
                                        className="text-emerald-600"
                                        checked={remember}
                                        onCheckedChange={(checked) =>
                                            setRemember(checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-gray-600"
                                    >
                                        Remember Me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full rounded-lg bg-emerald-600 text-base font-semibold hover:bg-emerald-700"
                                    tabIndex={4}
                                    disabled={submitting}
                                    data-test="login-button"
                                >
                                    {submitting && <Spinner />}
                                    Sign In
                                </Button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <Link
                                    href={register()}
                                    className="text-emerald-600 hover:text-emerald-700 hover:underline"
                                >
                                    User Login
                                </Link>
                                <Link
                                    href={home()}
                                    className="text-emerald-600 hover:text-emerald-700 hover:underline"
                                >
                                    Front Site
                                </Link>
                            </div>

                            {canResetPassword && (
                                <div className="text-center">
                                    <Link
                                        href={request()}
                                        className="text-sm text-red-500 hover:text-red-600 hover:underline"
                                        tabIndex={5}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}
                        </form>

                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto bg-gray-50 p-8 md:w-1/2 md:p-10">
                        <h3 className="mb-6 text-lg font-bold text-gray-800">
                            What's New In {name}
                        </h3>
                        <div className="space-y-5">
                            {newsItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                                >
                                    <p className="mb-1 text-xs text-gray-400">
                                        {item.date}
                                    </p>
                                    <h4 className="mb-1 text-sm font-semibold text-gray-800">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {item.excerpt}{' '}
                                        <Link
                                            href="#"
                                            className="text-emerald-600 hover:underline"
                                        >
                                            Read More
                                        </Link>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = function PassThrough({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
};
