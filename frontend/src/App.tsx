import { useEffect, useRef, type ReactNode } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { AuthProvider } from "@/auth/AuthContext";
import { IntroProvider, useIntro } from "@/lib/intro";
import { EASE } from "@/lib/motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import Home from "@/pages/Home";
import Rules from "@/pages/Rules";
import Profile from "@/pages/Profile";
import About from "@/pages/About";
import Verification from "@/pages/Verification";
import Applications from "@/pages/Applications";
import { DiscordCallback, SteamCallback } from "@/pages/AuthCallbacks";

function ScrollManager() {
    const location = useLocation();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) =>
                Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        lenisRef.current = lenis;
        let raf = 0;
        const loop = (time: number) => {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
    }, [location.pathname]);

    return null;
}

function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.main
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: EASE }}
        >
            {children}
        </motion.main>
    );
}

function AppShell() {
    const { introDone, setIntroDone } = useIntro();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="noise-overlay" aria-hidden />
            <AnimatePresence>
                {!introDone && (
                    <PageLoader
                        key="page-loader"
                        onComplete={() => setIntroDone(true)}
                    />
                )}
            </AnimatePresence>
            <Navbar />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                    <Route path="/regulamin" element={<PageTransition><Rules /></PageTransition>} />
                    <Route path="/profil" element={<PageTransition><Profile /></PageTransition>} />
                    <Route path="/o-nas" element={<PageTransition><About /></PageTransition>} />
                    <Route path="/weryfikacja" element={<PageTransition><Verification /></PageTransition>} />
                    <Route path="/podania" element={<PageTransition><Applications /></PageTransition>} />
                    <Route path="/auth/discord/callback" element={<DiscordCallback />} />
                    <Route path="/auth/steam/callback" element={<SteamCallback />} />
                    <Route path="*" element={<PageTransition><Home /></PageTransition>} />
                </Routes>
            </AnimatePresence>
            <Footer />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#0A0A0A",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        borderRadius: 0,
                    },
                }}
            />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <IntroProvider>
                <AuthProvider>
                    <ScrollManager />
                    <AppShell />
                </AuthProvider>
            </IntroProvider>
        </BrowserRouter>
    );
}
