import { BadgeCheck, Gamepad2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { SectionHeading } from "@/components/SectionHeading";

function StatusPill({
    connected,
    testId,
}: {
    connected: boolean;
    testId: string;
}) {
    return (
        <span
            data-testid={testId}
            className={`inline-flex items-center gap-2 border px-3.5 py-1.5 text-[10px] tracking-[0.2em] transition-colors duration-500 ${
                connected
                    ? "border-white/40 text-white text-glow"
                    : "border-white/10 text-white/40"
            }`}
        >
            {connected && <BadgeCheck size={12} strokeWidth={1.5} />}
            {connected ? "ZWERYFIKOWANO" : "NIEPOŁĄCZONO"}
        </span>
    );
}

interface ProviderCardProps {
    provider: "steam" | "discord";
    connected: boolean;
    connectedId: string | null;
    isDemo: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

function ProviderCard({
    provider,
    connected,
    connectedId,
    isDemo,
    onConnect,
    onDisconnect,
}: ProviderCardProps) {
    const isSteam = provider === "steam";
    const Icon = isSteam ? Gamepad2 : MessageSquare;
    const name = isSteam ? "STEAM" : "DISCORD";
    const description = isSteam
        ? "Połącz konto Steam przez oficjalne logowanie OpenID, aby potwierdzić posiadanie GTA V i odblokować wejście na serwer."
        : "Połącz konto Discord przez oficjalne OAuth, aby synchronizować rangi, powiadomienia i dostęp do społeczności.";

    return (
        <TiltCard
            testId={`verification-card-${provider}`}
            className="p-10 md:p-14 flex flex-col items-start"
        >
            <Icon size={28} strokeWidth={1} className="text-white/70" />
            <h3 className="mt-8 font-display text-3xl md:text-4xl font-light tracking-tight text-white">
                {name}
            </h3>
            <p className="mt-4 text-sm text-[#A3A3A3] leading-relaxed">
                {description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
                <StatusPill
                    connected={connected}
                    testId={`verification-status-${provider}`}
                />
                {connected && connectedId && (
                    <span className="font-mono text-xs text-white/50">
                        {connectedId}
                    </span>
                )}
            </div>
            <div className="mt-8 w-full">
                {connected ? (
                    isDemo ? (
                        <p className="text-xs text-[#737373] leading-relaxed">
                            Konto demo — odłączanie dostępne po prawdziwym
                            zalogowaniu.
                        </p>
                    ) : (
                        <button
                            data-testid={`verification-disconnect-${provider}`}
                            onClick={onDisconnect}
                            className="w-full border border-[#333] text-white/60 text-sm tracking-[0.2em] py-3.5 hover:border-white/50 hover:text-white transition-[border-color,color] duration-300"
                        >
                            ODŁĄCZ {name}
                        </button>
                    )
                ) : (
                    <button
                        data-testid={`verification-connect-${provider}`}
                        onClick={onConnect}
                        className="w-full bg-white text-black text-sm font-medium tracking-[0.2em] py-3.5 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                    >
                        POŁĄCZ {name}
                    </button>
                )}
            </div>
        </TiltCard>
    );
}

export default function Verification() {
    const {
        isAuthenticated,
        loading,
        user,
        loginWithSteam,
        loginWithDiscord,
        unlinkAccount,
    } = useAuth();

    if (loading) {
        return (
            <div
                data-testid="verification-page"
                className="min-h-screen flex items-center justify-center"
            >
                <p className="text-xs tracking-[0.25em] uppercase text-[#737373]">
                    Ładowanie…
                </p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
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
                            ZALOGUJ SIĘ w nawigacji.
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
                        connected={Boolean(user.steam_id)}
                        connectedId={user.steam_id}
                        isDemo={Boolean(user.demo)}
                        onConnect={() => void loginWithSteam()}
                        onDisconnect={() => void unlinkAccount("steam")}
                    />
                </Reveal>
                <Reveal delay={0.1}>
                    <ProviderCard
                        provider="discord"
                        connected={Boolean(user.discord_id)}
                        connectedId={user.discord_id}
                        isDemo={Boolean(user.demo)}
                        onConnect={() => void loginWithDiscord()}
                        onDisconnect={() => void unlinkAccount("discord")}
                    />
                </Reveal>
            </div>
            <Reveal delay={0.2}>
                <p className="mt-14 text-xs text-[#737373] max-w-xl leading-relaxed">
                    Połączenie odbywa się przez oficjalne OAuth 2.0 (Discord)
                    oraz OpenID (Steam) — nigdy nie prosimy o hasła.
                </p>
            </Reveal>
        </div>
    );
}
