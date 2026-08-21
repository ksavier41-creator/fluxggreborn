import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { SectionHeading } from "@/components/SectionHeading";
import { applicationTypes, type ApplicationType } from "@/data/content";
import { EASE } from "@/lib/motion";

function ApplicationModal({
    application,
    onClose,
}: {
    application: ApplicationType;
    onClose: () => void;
}) {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.success("Podanie przygotowane", {
            description:
                "Formularz działa w trybie demonstracyjnym — wysyłka zostanie podłączona do backendu.",
        });
        onClose();
    };

    const inputClass =
        "w-full bg-[#050505] border border-white/10 focus:border-white/40 outline-none text-white placeholder:text-white/25 text-sm py-3 px-4 transition-colors duration-300";

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
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 p-8 md:p-10"
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
                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs tracking-[0.2em] text-[#737373] mb-2">
                            NICK W GRZE
                        </label>
                        <input
                            data-testid="application-field-nick"
                            required
                            placeholder="np. Jan_Kowalski"
                            className={inputClass}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs tracking-[0.2em] text-[#737373] mb-2">
                                DISCORD
                            </label>
                            <input
                                data-testid="application-field-discord"
                                required
                                placeholder="np. xnova"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-[0.2em] text-[#737373] mb-2">
                                STEAM ID
                            </label>
                            <input
                                data-testid="application-field-steam"
                                required
                                placeholder="7656119…"
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs tracking-[0.2em] text-[#737373] mb-2">
                            DLACZEGO TY?
                        </label>
                        <textarea
                            data-testid="application-field-motivation"
                            required
                            rows={5}
                            placeholder="Opowiedz krótko o sobie, swoim doświadczeniu w RP i motywacji…"
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                    <button
                        data-testid={`application-submit-${application.id}`}
                        type="submit"
                        className="w-full bg-white text-black text-sm font-medium tracking-[0.2em] py-4 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                    >
                        WYŚLIJ PODANIE
                    </button>
                    <p className="text-[11px] text-[#737373] leading-relaxed text-center">
                        Formularz demonstracyjny — zapis do bazy zostanie
                        dodany wraz z backendem.
                    </p>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default function Applications() {
    const [selected, setSelected] = useState<ApplicationType | null>(null);

    return (
        <div
            data-testid="applications-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Dołącz do nas"
                title="Podania"
                description="Wybierz typ podania i dołącz do miasta. Każde zgłoszenie rozpatruje zespół rekrutacyjny — decyzję otrzymasz na Discordzie."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {applicationTypes.map((application, i) => (
                    <Reveal key={application.id} delay={(i % 3) * 0.08}>
                        <TiltCard
                            testId={`application-card-${application.id}`}
                            className="p-8 md:p-10 flex flex-col"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <span
                                    data-testid={`application-status-${application.id}`}
                                    className={`text-[10px] tracking-[0.25em] border px-2.5 py-1 ${
                                        application.status === "open"
                                            ? "border-white/30 text-white"
                                            : "border-white/10 text-white/35"
                                    }`}
                                >
                                    {application.status === "open"
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
                                onClick={() =>
                                    application.status === "open" &&
                                    setSelected(application)
                                }
                                disabled={application.status !== "open"}
                                className={`mt-10 w-full py-3.5 text-sm tracking-[0.2em] transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] ${
                                    application.status === "open"
                                        ? "bg-white text-black font-medium hover:bg-[#E5E5E5]"
                                        : "border border-white/10 text-white/30 cursor-not-allowed"
                                }`}
                            >
                                {application.status === "open"
                                    ? "ZŁÓŻ PODANIE"
                                    : "NABÓR ZAMKNIĘTY"}
                            </button>
                        </TiltCard>
                    </Reveal>
                ))}
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
