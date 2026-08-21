import { BadgeCheck, CalendarDays, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

function VerifiedPill({ label, testId }: { label: string; testId: string }) {
    return (
        <span
            data-testid={testId}
            className="inline-flex items-center gap-2 border border-white/30 px-3.5 py-1.5 text-[10px] tracking-[0.2em] text-white text-glow"
        >
            <BadgeCheck size={13} strokeWidth={1.5} />
            {label} — ZWERYFIKOWANY
        </span>
    );
}

export default function Profile() {
    const { user, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated || !user) {
        return (
            <div
                data-testid="profile-page"
                className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40 min-h-screen"
            >
                <SectionHeading
                    overline="Panel gracza"
                    title="Mój profil"
                    description="Zaloguj się, aby zobaczyć swój profil, historię zakupów i status weryfikacji."
                />
                <Reveal>
                    <div className="border border-white/10 bg-[#0A0A0A] p-10 md:p-16 max-w-2xl">
                        <p className="text-[#A3A3A3] text-sm leading-relaxed mb-8">
                            Panel profilu jest dostępny po zalogowaniu. Użyj
                            przycisku ZALOGUJ SIĘ w nawigacji, aby kontynuować
                            jako konto demo.
                        </p>
                        <Link
                            to="/weryfikacja"
                            data-testid="profile-goto-verification"
                            className="inline-block border border-[#333] text-white text-sm tracking-[0.2em] px-8 py-3.5 hover:border-white/60 transition-colors duration-300"
                        >
                            PRZEJDŹ DO WERYFIKACJI
                        </Link>
                    </div>
                </Reveal>
            </div>
        );
    }

    return (
        <div
            data-testid="profile-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Panel gracza"
                title="Mój profil"
                description="Twoje konto FluxGG Reborn — dane, rangi i historia zakupów w jednym miejscu."
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Reveal className="lg:col-span-5">
                    <div
                        data-testid="profile-identity-card"
                        className="h-full border border-white/10 bg-[#0A0A0A] p-8 md:p-12"
                    >
                        <div className="flex items-center gap-6">
                            <span
                                data-testid="profile-avatar"
                                aria-label="Avatar Discord"
                                className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/5 font-display text-2xl font-light tracking-wide text-white text-glow"
                            >
                                {user.username.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                                <h3
                                    data-testid="profile-username"
                                    className="font-display text-3xl tracking-tight text-white"
                                >
                                    {user.username}
                                </h3>
                                <p className="mt-1 flex items-center gap-2 text-xs text-[#737373] tracking-wide">
                                    <CalendarDays size={13} strokeWidth={1.5} />
                                    Dołączył {user.joinedAt}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <VerifiedPill
                                label="STEAM"
                                testId="profile-steam-verified-badge"
                            />
                            <VerifiedPill
                                label="DISCORD"
                                testId="profile-discord-verified-badge"
                            />
                        </div>
                        <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-[#737373]">
                                    Discord ID
                                </span>
                                <span
                                    data-testid="profile-discord-id"
                                    className="font-mono text-white/80"
                                >
                                    {user.discordId}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-[#737373]">Steam ID</span>
                                <span
                                    data-testid="profile-steam-id"
                                    className="font-mono text-white/80"
                                >
                                    {user.steamId}
                                </span>
                            </div>
                        </div>
                        <button
                            data-testid="profile-logout-button"
                            onClick={logout}
                            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300"
                        >
                            <LogOut size={14} strokeWidth={1.5} />
                            WYLOGUJ SIĘ
                        </button>
                    </div>
                </Reveal>

                <div className="lg:col-span-7 space-y-6">
                    <Reveal delay={0.1}>
                        <div
                            data-testid="profile-ranks-card"
                            className="border border-white/10 bg-[#0A0A0A] p-8 md:p-10"
                        >
                            <p className="text-xs tracking-[0.25em] text-[#737373] mb-6">
                                POSIADANE RANGI
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {user.ranks.map((rank) => (
                                    <span
                                        key={rank}
                                        data-testid={`profile-rank-${rank.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="font-display border border-white/20 bg-white/[0.03] px-5 py-2.5 text-sm tracking-[0.15em] text-white"
                                    >
                                        {rank}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.18}>
                        <div
                            data-testid="profile-purchases-card"
                            className="border border-white/10 bg-[#0A0A0A] p-8 md:p-10"
                        >
                            <p className="text-xs tracking-[0.25em] text-[#737373] mb-6">
                                HISTORIA ZAKUPÓW
                            </p>
                            <div className="divide-y divide-white/5">
                                {user.purchases.map((purchase) => (
                                    <div
                                        key={purchase.id}
                                        data-testid={`profile-purchase-${purchase.id}`}
                                        className="py-4 flex flex-wrap items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="text-sm text-white">
                                                {purchase.product}
                                            </p>
                                            <p className="text-xs text-[#737373] mt-1">
                                                {purchase.id} ·{" "}
                                                {purchase.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-white">
                                                {purchase.amount}
                                            </p>
                                            <p className="text-[10px] tracking-[0.2em] text-[#737373] mt-1">
                                                {purchase.status.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
