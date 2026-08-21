import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { LoginModal } from "@/components/LoginModal";
import { EASE } from "@/lib/motion";

const links = [
    { to: "/regulamin", label: "REGULAMIN", testId: "nav-link-rules" },
    { to: "/podania", label: "PODANIA", testId: "nav-link-applications" },
    { to: "/weryfikacja", label: "WERYFIKACJA", testId: "nav-link-verification" },
    { to: "/profil", label: "PROFIL", testId: "nav-link-profile" },
    { to: "/o-nas", label: "O NAS", testId: "nav-link-about" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            <header
                data-testid="navbar"
                className={`fixed top-0 inset-x-0 z-[70] transition-[background-color,border-color,backdrop-filter] duration-500 border-b ${
                    scrolled
                        ? "bg-[#050505]/85 backdrop-blur-xl border-white/10"
                        : "bg-[#050505]/40 backdrop-blur-md border-white/5"
                }`}
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
                    <Link
                        to="/"
                        data-testid="nav-logo"
                        className="font-display text-base md:text-lg font-semibold tracking-tight text-white"
                    >
                        FLUXGG
                        <span className="text-white/40 font-light">
                            {" "}
                            REBORN
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-7">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                data-testid={link.testId}
                                className={({ isActive }) =>
                                    `group relative text-xs tracking-[0.2em] transition-colors duration-300 ${
                                        isActive
                                            ? "text-white"
                                            : "text-white/50 hover:text-white"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.label}
                                        <span
                                            className={`absolute -bottom-1.5 left-0 h-px bg-white transition-transform duration-300 origin-left w-full ${
                                                isActive
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <Link
                                to="/profil"
                                data-testid="nav-profile-button"
                                className="hidden sm:flex items-center gap-3 border border-white/15 pl-1.5 pr-4 py-1.5 hover:border-white/40 transition-colors duration-300"
                            >
                                <span
                                    aria-hidden
                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/5 font-display text-[10px] font-medium tracking-wide text-white"
                                >
                                    {user.username.slice(0, 2).toUpperCase()}
                                </span>
                                <span className="text-xs tracking-[0.15em] text-white">
                                    {user.username.toUpperCase()}
                                </span>
                            </Link>
                        ) : (
                            <button
                                data-testid="nav-login-button"
                                onClick={() => setLoginOpen(true)}
                                className="hidden sm:block text-xs tracking-[0.2em] bg-white text-black px-5 py-2.5 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                            >
                                ZALOGUJ SIĘ
                            </button>
                        )}
                        <button
                            data-testid="mobile-menu-button"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Menu"
                            className="lg:hidden text-white p-2"
                        >
                            {menuOpen ? (
                                <X size={22} strokeWidth={1.5} />
                            ) : (
                                <Menu size={22} strokeWidth={1.5} />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        data-testid="mobile-menu"
                        className="fixed inset-0 z-[65] bg-[#050505]/97 backdrop-blur-2xl flex flex-col justify-center px-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <nav className="space-y-2">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.to}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.08 + i * 0.06,
                                        duration: 0.6,
                                        ease: EASE,
                                    }}
                                >
                                    <NavLink
                                        to={link.to}
                                        data-testid={link.testId}
                                        className={({ isActive }) =>
                                            `block font-display text-4xl font-light tracking-tight py-2 ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-white/50"
                                            }`
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </nav>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12"
                        >
                            {isAuthenticated ? (
                                <Link
                                    to="/profil"
                                    data-testid="mobile-nav-profile-button"
                                    className="inline-block bg-white text-black text-sm tracking-[0.2em] px-8 py-4"
                                >
                                    MÓJ PROFIL
                                </Link>
                            ) : (
                                <button
                                    data-testid="mobile-nav-login-button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setLoginOpen(true);
                                    }}
                                    className="bg-white text-black text-sm tracking-[0.2em] px-8 py-4"
                                >
                                    ZALOGUJ SIĘ
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
    );
}
