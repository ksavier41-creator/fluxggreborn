import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { EASE } from "@/lib/motion";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
    const { loginDemo, loginWithDiscord, loginWithSteam } = useAuth();

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
                            Zaloguj się swoim kontem Discord lub Steam. Bez
                            haseł — autoryzacja odbywa się na oficjalnych
                            stronach dostawców.
                        </p>
                        <div className="space-y-3">
                            <button
                                data-testid="login-discord-button"
                                onClick={() => void loginWithDiscord()}
                                className="w-full bg-white text-black font-medium tracking-[0.2em] text-sm py-3.5 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                            >
                                KONTYNUUJ PRZEZ DISCORD
                            </button>
                            <button
                                data-testid="login-steam-button"
                                onClick={() => void loginWithSteam()}
                                className="w-full bg-transparent border border-[#333] text-white text-sm tracking-[0.2em] py-3.5 hover:border-white/60 active:scale-[0.98] transition-[border-color,transform] duration-200"
                            >
                                KONTYNUUJ PRZEZ STEAM
                            </button>
                            <button
                                data-testid="login-demo-button"
                                onClick={() => {
                                    loginDemo();
                                    onClose();
                                }}
                                className="w-full text-[11px] tracking-[0.25em] text-white/40 hover:text-white transition-colors duration-200 py-2"
                            >
                                PODGLĄD KONTA DEMO
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
