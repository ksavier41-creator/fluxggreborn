import { Gamepad2, Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import {
    useAuth,
    type VerificationState,
} from "@/auth/AuthContext";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { SectionHeading } from "@/components/SectionHeading";

const statusLabels: Record<VerificationState, string> = {
    none: "NIEPOŁĄCZONO",
    pending: "WERYFIKOWANIE",
    verified: "ZWERYFIKOWANO",
};

function StatusPill({
    status,
    testId,
}: {
    status: VerificationState;
    testId: string;
}) {
    return (
        <span
            data-testid={testId}
            className={`inline-flex items-center gap-2 border px-3.5 py-1.5 text-[10px] tracking-[0.2em] transition-colors duration-500 ${
                status === "verified"
                    ? "border-white/40 text-white text-glow"
                    : status === "pending"
                      ? "border-white/20 text-white/70"
                      : "border-white/10 text-white/40"
            }`}
        >
            {status === "pending" && (
                <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
            )}
            {statusLabels[status]}
        </span>
    );
}

interface ProviderCardProps {
    provider: "steam" | "discord";
    status: VerificationState;
    onConnect: () => void;
    onDisconnect: () => void;
}

function ProviderCard({
    provider,
    status,
    onConnect,
    onDisconnect,
}: ProviderCardProps) {
    const isSteam = provider === "steam";
    const Icon = isSteam ? Gamepad2 : MessageSquare;
    const name = isSteam ? "STEAM" : "DISCORD";
    const description = isSteam
        ? "Połącz konto Steam, aby potwierdzić posiadanie GTA V i odblokować wejście na serwer."
        : "Połącz konto Discord, aby synchronizować rangi, powiadomienia i dostęp do społeczności.";

    return (
        <TiltCard
            testId={`verification-card-${provider}`}
            className="p-10 md:p-14 flex flex-col items-start"
        >
            <Icon size={28} strokeWidth={1} className="text-white/70" />
            <h3 className="mt-8 font-display text-3xl md:text-4xl font-light tracking-tight text-white">
                {name}
            </h3>
            <p className="mt-4 text-sm text-[#A3A3A3] leading-relaxed flex-1">
                {description}
            </p>
            <div className="mt-8">
                <StatusPill
                    status={status}
                    testId={`verification-status-${provider}`}
                />
            </div>
            <div className="mt-8 w-full">
                {status === "verified" ? (
                    <button
                        data-testid={`verification-disconnect-${provider}`}
                        onClick={onDisconnect}
                        className="w-full border border-[#333] text-white/60 text-sm tracking-[0.2em] py-3.5 hover:border-white/50 hover:text-white transition-[border-color,color] duration-300"
                    >
                        ODŁĄCZ {name}
                    </button>
                ) : (
                    <button
                        data-testid={`verification-connect-${provider}`}
                        onClick={onConnect}
                        disabled={status === "pending"}
                        className="w-full bg-white text-black text-sm font-medium tracking-[0.2em] py-3.5 hover:bg-[#E5E5E5] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-[background-color,transform] duration-200"
                    >
                        {status === "pending"
                            ? "WERYFIKOWANIE…"
                            : `POŁĄCZ ${name}`}
                    </button>
                )}
            </div>
        </TiltCard>
    );
}

export default function Verification() {
    const {
        isAuthenticated,
        steamStatus,
        discordStatus,
        connectSteam,
        connectDiscord,
        disconnect,
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <div
                data-testid="verification-page"
                className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40 min-h-screen"
            >
                <SectionHeading
                    overline="Bezpieczeństwo konta"
                    title="Weryfikacja konta"
                    description="Zaloguj się, aby połączyć swoje konta Steam i Discord z profilem FluxGG Reborn."
                />
                <Reveal>
                    <div className="border border-white/10 bg-[#0A0A0A] p-10 md:p-16 max-w-2xl">
                        <p className="text-[#A3A3A3] text-sm leading-relaxed mb-8">
                            Weryfikacja wymaga zalogowania. Użyj przycisku
                            ZALOGUJ SIĘ w nawigacji, aby kontynuować jako konto
                            demo.
                        </p>
                        <Link
                            to="/profil"
                            data-testid="verification-goto-profile"
                            className="inline-block border border-[#333] text-white text-sm tracking-[0.2em] px-8 py-3.5 hover:border-white/60 transition-colors duration-300"
                        >
                            PRZEJDŹ DO PROFILU
                        </Link>
                    </div>
                </Reveal>
            </div>
        );
    }

    return (
        <div
            data-testid="verification-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Bezpieczeństwo konta"
                title="Weryfikacja konta"
                description="Połącz swoje konta Steam i Discord, aby odblokować pełny dostęp do serwera, rang i podań."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                <Reveal>
                    <ProviderCard
                        provider="steam"
                        status={steamStatus}
                        onConnect={connectSteam}
                        onDisconnect={() => disconnect("steam")}
                    />
                </Reveal>
                <Reveal delay={0.1}>
                    <ProviderCard
                        provider="discord"
                        status={discordStatus}
                        onConnect={connectDiscord}
                        onDisconnect={() => disconnect("discord")}
                    />
                </Reveal>
            </div>
            <Reveal delay={0.2}>
                <p className="mt-14 text-xs text-[#737373] max-w-xl leading-relaxed">
                    Obecny proces weryfikacji jest demonstracyjny. Docelowo
                    połączenie odbędzie się przez oficjalne OAuth 2.0 (Discord)
                    oraz OpenID (Steam) — bez podawania haseł.
                </p>
            </Reveal>
        </div>
    );
}
