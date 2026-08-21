import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { SectionHeading } from "@/components/SectionHeading";
import {
    applicationTypes,
    applicationQuestions,
    type ApplicationType,
} from "@/data/content";
import { EASE } from "@/lib/motion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputClass =
    "w-full bg-[#050505] border border-white/10 focus:border-white/40 outline-none text-white placeholder:text-white/25 text-sm py-3 px-4 transition-colors duration-300";

const lockedClass =
    "w-full bg-[#0D0D0D] border border-white/5 text-white/50 text-sm py-3 px-4 font-mono cursor-not-allowed select-all";

function ApplicationModal({
    application,
    onClose,
}: {
    application: ApplicationType;
    onClose: () => void;
}) {
    const { user } = useAuth();
    const [sending, setSending] = useState(false);
    const questions = applicationQuestions[application.id] ?? [];

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const token = localStorage.getItem("fluxgg-auth-token");
        if (!token) {
            toast.error("Wymagane zalogowanie");
            return;
        }
        const payload = {
            type: application.id,
            nick: String(data.get("nick") ?? ""),
            discord: user?.discord_id ?? "",
            steam_id: user?.steam_id ?? "",
            answers: Object.fromEntries(
                questions.map((q) => [q.key, String(data.get(q.key) ?? "")]),
            ),
        };
        setSending(true);
        try {
            const res = await fetch(`${API}/applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                let detail = "Nie udało się wysłać podania";
                try {
                    const err = await res.json();
                    if (err?.detail) detail = err.detail;
                } catch {
                    /* keep default */
                }
                throw new Error(detail);
            }
            toast.success("Podanie wysłane", {
                description:
                    "Zgłoszenie trafiło do administracji. Decyzję otrzymasz na Discordzie.",
            });
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Błąd wysyłki");
        } finally {
            setSending(false);
        }
    };

    return (
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
                data-testid={`application-modal-${application.id}`}
                role="dialog"
                aria-modal="true"
                data-lenis-prevent
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 p-8 md:p-10"
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.5, ease: EASE }}
            >
                <button
                    data-testid="application-modal-close"
                    onClick={onClose}
                    aria-label="Zamknij"
                    className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors duration-200"
                >
                    <X size={18} strokeWidth={1.5} />
                </button>
                <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">
                    Nowe podanie
                </p>
                <h3 className="font-display text-2xl md:text-3xl tracking-tight text-white mb-8">
                    {application.name}
                </h3>
                <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
                    <div>
                        <label className="block text-xs tracking-[0.2em] text-[#737373] mb-2">
                            NICK W GRZE
                        </label>
                        <input
                            data-testid="application-field-nick"
                            name="nick"
                            required
                            minLength={2}
                            defaultValue={user?.username ?? ""}
                            placeholder="np. Jan_Kowalski"
                            className={inputClass}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#737373] mb-2">
                                <Lock size={11} strokeWidth={1.5} />
                                DISCORD ID
                            </label>
                            <input
                                data-testid="application-field-discord"
                                name="discord"
                                readOnly
                                value={user?.discord_id ?? ""}
                                className={lockedClass}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#737373] mb-2">
                                <Lock size={11} strokeWidth={1.5} />
                                STEAM ID
                            </label>
                            <input
                                data-testid="application-field-steam"
                                name="steam"
                                readOnly
                                value={user?.steam_id ?? ""}
                                className={lockedClass}
                            />
                        </div>
                    </div>
                    <p className="text-[11px] text-[#737373] leading-relaxed -mt-2">
                        Identyfikatory pobierane z Twojego konta — nie można
                        ich zmienić.
                    </p>
                    {questions.map((question) => (
                        <div key={question.key}>
                            <label
                                className={`block mb-2 ${
                                    question.textarea
                                        ? "text-xs text-[#A3A3A3] leading-relaxed"
                                        : "text-xs tracking-[0.2em] text-[#737373]"
                                }`}
                            >
                                {question.textarea
                                    ? question.label
                                    : question.label.toUpperCase()}
                            </label>
                            {question.textarea ? (
                                <textarea
                                    data-testid={`application-field-${question.key}`}
                                    name={question.key}
                                    required
                                    minLength={1}
                                    rows={4}
                                    className={`${inputClass} resize-none`}
                                />
                            ) : (
                                <input
                                    data-testid={`application-field-${question.key}`}
                                    name={question.key}
                                    required
                                    minLength={1}
                                    className={inputClass}
                                />
                            )}
                        </div>
                    ))}
                    <button
                        data-testid={`application-submit-${application.id}`}
                        type="submit"
                        disabled={sending}
                        className="w-full bg-white text-black text-sm font-medium tracking-[0.2em] py-4 hover:bg-[#E5E5E5] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-[background-color,transform] duration-200 flex items-center justify-center gap-2"
                    >
                        {sending && (
                            <Loader2
                                size={15}
                                strokeWidth={1.5}
                                className="animate-spin"
                            />
                        )}
                        {sending ? "WYSYŁANIE…" : "WYŚLIJ PODANIE"}
                    </button>
                    <p className="text-[11px] text-[#737373] leading-relaxed text-center">
                        Podanie trafia bezpośrednio do administracji serwera.
                    </p>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default function Applications() {
    const [selected, setSelected] = useState<ApplicationType | null>(null);
    const [statuses, setStatuses] = useState<Record<string, string>>({});
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        fetch(`${API}/applications/status`)
            .then((res) => (res.ok ? res.json() : {}))
            .then(setStatuses)
            .catch(() => {});
    }, []);

    const statusOf = (application: ApplicationType) =>
        statuses[application.id] ?? application.status;

    const openApplication = (application: ApplicationType) => {
        if (statusOf(application) !== "open") return;
        if (!isAuthenticated) {
            toast.error("Zaloguj się, aby złożyć podanie", {
                description: "Użyj przycisku ZALOGUJ SIĘ w nawigacji.",
            });
            return;
        }
        if (user?.demo) {
            toast.error("Konto demo nie może wysyłać podań", {
                description: "Zaloguj się przez Steam lub Discord.",
            });
            return;
        }
        if (!user?.discord_id || !user?.steam_id) {
            toast.error("Połącz konto Discord i Steam", {
                description:
                    "Oba konta muszą być zweryfikowane przed złożeniem podania.",
                action: {
                    label: "Weryfikacja",
                    onClick: () => {
                        window.location.href = "/weryfikacja";
                    },
                },
            });
            return;
        }
        setSelected(application);
    };

    return (
        <div
            data-testid="applications-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Dołącz do nas"
                title="Podania"
                description="Wybierz typ podania i dołącz do miasta. Wymagane połączone konto Discord i Steam. Każde zgłoszenie trafia bezpośrednio do administracji — decyzję otrzymasz na Discordzie."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {applicationTypes.map((application, i) => {
                    const status = statusOf(application);
                    return (
                        <Reveal key={application.id} delay={(i % 3) * 0.08}>
                            <TiltCard
                                testId={`application-card-${application.id}`}
                                className="p-8 md:p-10 flex flex-col"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span
                                        data-testid={`application-status-${application.id}`}
                                        className={`text-[10px] tracking-[0.25em] border px-2.5 py-1 ${
                                            status === "open"
                                                ? "border-white/30 text-white"
                                                : "border-white/10 text-white/35"
                                        }`}
                                    >
                                        {status === "open"
                                            ? "OTWARTE"
                                            : "WKRÓTCE"}
                                    </span>
                                    <span className="text-[10px] tracking-[0.2em] text-[#737373]">
                                        {application.note.toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="mt-8 font-display text-2xl tracking-tight text-white">
                                    {application.name}
                                </h3>
                                <p className="mt-3 text-sm text-[#A3A3A3] leading-relaxed flex-1">
                                    {application.description}
                                </p>
                                <button
                                    data-testid={`application-open-${application.id}`}
                                    onClick={() => openApplication(application)}
                                    disabled={status !== "open"}
                                    className={`mt-10 w-full py-3.5 text-sm tracking-[0.2em] transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] ${
                                        status === "open"
                                            ? "bg-white text-black font-medium hover:bg-[#E5E5E5]"
                                            : "border border-white/10 text-white/30 cursor-not-allowed"
                                    }`}
                                >
                                    {status === "open"
                                        ? "ZŁÓŻ PODANIE"
                                        : "NABÓR ZAMKNIĘTY"}
                                </button>
                            </TiltCard>
                        </Reveal>
                    );
                })}
            </div>
            <AnimatePresence>
                {selected && (
                    <ApplicationModal
                        application={selected}
                        onClose={() => setSelected(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
