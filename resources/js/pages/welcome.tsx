import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { dashboard, login } from '@/routes';
import { BookOpen, GraduationCap, Menu, School, X } from 'lucide-react';

type Slider = {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    button_text: string | null;
    button_url: string | null;
};

type Notice = {
    id: number;
    title: string;
    content: string;
    published_date: string;
};

type Stat = {
    label: string;
    value: string;
};

export default function Welcome() {
    const { auth, sliders, settings, notices, stats } = usePage().props as {
        auth: { user: unknown | null };
        sliders: Slider[];
        settings: Record<string, string>;
        notices: Notice[];
        stats: Stat[];
    };

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!sliders.length) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [sliders.length]);

    const navLinks = [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Notices', href: '#notices' },
        { label: 'Contact', href: '#contact' },
    ];

    const schoolName = settings.school_name || 'WSIT School Management System';
    const schoolAddress = settings.school_address || 'Holding No. 00-0865, Gulshan Para, Chuadanga';
    const schoolPhone = settings.school_phone || '';
    const schoolEmail = settings.school_email || '';
    const footerText = settings.school_footer || 'Powered by: Web Space IT';
    const footerUrl = settings.school_footer_url || '';

    return (
        <>
            <Head title={schoolName} />

            {/* Navbar */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
                    <Link href="#home" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                            <School className="size-5" />
                        </div>
                        <span className={`text-lg font-semibold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            {schoolName.length > 28 ? schoolName.slice(0, 26) + '...' : schoolName}
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                                    scrolled ? 'text-gray-700' : 'text-white/90'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Login
                            </Link>
                        )}
                    </nav>

                    <button
                        className={`md:hidden ${scrolled ? 'text-gray-900' : 'text-white'}`}
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        {mobileMenu ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>

                {mobileMenu && (
                    <div className="border-t bg-white md:hidden">
                        <div className="space-y-1 px-4 py-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenu(false)}
                                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="pt-2">
                                {auth.user ? (
                                    <Link href={dashboard()} className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href={login()} className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Slider */}
            <section id="home" className="relative min-h-screen">
                {sliders.length > 0 ? (
                    <>
                        {sliders.map((slider, index) => (
                            <div
                                key={slider.id}
                                className={`absolute inset-0 transition-opacity duration-700 ${
                                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                            >
                                {slider.image ? (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${slider.image})` }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800" />
                                )}
                                <div className="absolute inset-0 bg-black/50" />
                                <div className="relative flex h-screen items-center justify-center px-4 text-center">
                                    <div className="max-w-3xl">
                                        {slider.subtitle && (
                                            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-emerald-300">
                                                {slider.subtitle}
                                            </p>
                                        )}
                                        <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                                            {slider.title}
                                        </h1>
                                        {slider.description && (
                                            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
                                                {slider.description}
                                            </p>
                                        )}
                                        {slider.button_text && slider.button_url && (
                                            <a
                                                href={slider.button_url}
                                                className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                                            >
                                                {slider.button_text}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {sliders.length > 1 && (
                            <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
                                {sliders.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-2 rounded-full transition-all ${
                                            index === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800">
                        <div className="px-4 text-center">
                            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                                Welcome to {schoolName}
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
                                {schoolAddress}
                            </p>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-700"
                                >
                                    Login to Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Stats Section */}
            <section className="relative -mt-16 px-4 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-100"
                            >
                                <p className="text-3xl font-bold text-emerald-600">{stat.value}</p>
                                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="px-4 py-20 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">About Us</p>
                            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                                Welcome to {schoolName}
                            </h2>
                            <div className="mt-4 h-1 w-20 rounded-full bg-emerald-600" />
                            <p className="mt-6 text-lg leading-relaxed text-gray-600">
                                {schoolName} is committed to providing quality education that nurtures intellectual curiosity,
                                critical thinking, and holistic development. Our dedicated faculty and modern facilities create
                                an environment where every student can thrive.
                            </p>
                            <p className="mt-4 text-lg leading-relaxed text-gray-600">
                                Located at {schoolAddress}, we offer a comprehensive curriculum from primary through higher
                                secondary levels, preparing students for a bright future.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                                        <GraduationCap className="size-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Qualified Teachers</p>
                                        <p className="text-sm text-gray-500">Dedicated educators</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                                        <BookOpen className="size-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Modern Curriculum</p>
                                        <p className="text-sm text-gray-500">Comprehensive education</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-200 to-emerald-50 shadow-xl">
                                <div className="flex h-full items-center justify-center p-8 text-center">
                                    <div>
                                        <School className="mx-auto size-16 text-emerald-400" />
                                        <p className="mt-4 text-lg font-medium text-emerald-700">{schoolName}</p>
                                        <p className="mt-1 text-sm text-emerald-600">{schoolAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notices Section */}
            <section id="notices" className="bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Notice Board</p>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Latest News & Notices</h2>
                        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-emerald-600" />
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {notices.length > 0 ? (
                            notices.map((notice) => (
                                <article
                                    key={notice.id}
                                    className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                                >
                                    <p className="text-xs font-medium text-emerald-600">{notice.published_date}</p>
                                    <h3 className="mt-2 font-semibold text-gray-900">{notice.title}</h3>
                                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                                        {notice.content}
                                    </p>
                                </article>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400">No notices published yet.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-emerald-700 px-4 py-16 md:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to Get Started?</h2>
                    <p className="mt-4 text-lg text-emerald-100">
                        Access the school management system to manage students, teachers, attendance, and more.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-white px-8 py-3 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-lg bg-white px-8 py-3 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 px-4 py-12 text-gray-300 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                    <School className="size-4" />
                                </div>
                                <span className="text-sm font-semibold text-white">{schoolName}</span>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed">
                                Providing quality education and nurturing future leaders since{' '}
                                {settings.school_established || '2000'}.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
                            <ul className="mt-4 space-y-2 text-sm">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href} className="transition-colors hover:text-emerald-400">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
                            <ul className="mt-4 space-y-2 text-sm">
                                {schoolAddress && <li>{schoolAddress}</li>}
                                {schoolPhone && <li>Phone: {schoolPhone}</li>}
                                {schoolEmail && <li>Email: {schoolEmail}</li>}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Education</h3>
                            <p className="mt-4 text-sm leading-relaxed">
                                Empowering students with knowledge, skills, and values to excel in a rapidly changing
                                world. Committed to academic excellence and holistic development.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
                        {footerUrl ? (
                            <a href={footerUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-emerald-400">
                                {footerText}
                            </a>
                        ) : (
                            footerText
                        )}
                    </div>
                </div>
            </footer>
        </>
    );
}
