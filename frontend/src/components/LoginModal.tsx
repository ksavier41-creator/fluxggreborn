import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { EASE } from "@/lib/motion";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
    const { loginDemo } = useAuth();

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[80] flex items-center justify-center p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                        onClick={onClose}
                    />
                    <motion.div
                        data-testid="login-modal"
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-md bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 p-8 md:p-10"
                        initial={{ opacity: 0, y: 32, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: EASE }}
                    >
                        <button
                            data-testid="login-modal-close"
                            onClick={onClose}
                            aria-label="Zamknij"
                            className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors duration-200"
                        >
                            <X size={18} strokeWidth={1.5} />
                        </button>
                        <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-4">
                            Dostęp do konta
                        </p>
                        <h3 className="font-display text-2xl md:text-3xl tracking-tight text-white mb-3">
                            Zaloguj się
                        </h3>
                        <p className="text-sm text-[#A3A3A3] leading-relaxed mb-8">
                            Logowanie przez Discord i Steam jest w trakcie
                            przygotowań. Na ten moment możesz zobaczyć panel w
                            trybie demonstracyjnym.
                        </p>
                        <div className="space-y-3">
                            <button
                                data-testid="login-demo-button"
                                onClick={() => {
                                    loginDemo();
                                    onClose();
                                }}
                                className="w-full bg-white text-black font-medium tracking-wide text-sm py-3.5 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                            >
                                KONTYNUUJ JAKO KONTO DEMO
                            </button>
                            <button
                                data-testid="login-discord-button"
                                disabled
                                className="w-full bg-transparent border border-[#262626] text-white/40 text-sm tracking-wide py-3.5 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                DISCORD
                                <span className="text-[10px] tracking-[0.2em] border border-white/15 px-2 py-0.5">
                                    WKRÓTCE
                                </span>
                            </button>
                            <button
                                data-testid="login-steam-button"
                                disabled
                                className="w-full bg-transparent border border-[#262626] text-white/40 text-sm tracking-wide py-3.5 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                STEAM
                                <span className="text-[10px] tracking-[0.2em] border border-white/15 px-2 py-0.5">
                                    WKRÓTCE
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
