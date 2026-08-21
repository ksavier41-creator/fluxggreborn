import { useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { applicationTypes } from "@/data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

interface MyApplication {
    id: string;
    type: string;
    status: string;
    created_at: string;
}

const statusLabels: Record<string, string> = {
    pending: "OCZEKUJE",
    accepted: "PRZYJĘTE",
    rejected: "ODRZUCONE",
};

function StatusPill({
    label,
    active,
    testId,
}: {
    label: string;
    active: boolean;
    testId: string;
}) {
    return (
        <span
            data-testid={testId}
            className={`inline-flex items-center gap-2 border px-3.5 py-1.5 text-[10px] tracking-[0.2em] ${
                active
                    ? "border-white/30 text-white text-glow"
                    : "border-white/10 text-white/35"
            }`}
        >
            {active && <BadgeCheck size={13} strokeWidth={1.5} />}
            {label} — {active ? "ZWERYFIKOWANY" : "NIEPODŁĄCZONY"}
        </span>
    );
}

export default function Profile() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const [applications, setApplications] = useState<MyApplication[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("fluxgg-auth-token");
        if (!token || !user || user.demo) return;
        fetch(`${API}/applications/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : []))
            .then(setApplications)
            .catch(() => {});
    }, [user]);

    if (loading) {
        return (
            <div
                data-testid="profile-page"
                className="min-h-screen flex items-center justify-center"
            >
                <p className="text-xs tracking-[0.25em] uppercase text-[#737373]">
                    Ładowanie profilu…
                </p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div
                data-testid="profile-page"
                className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40 min-h-screen"
            >
                <SectionHeading
                    overline="Panel gracza"
                    title="Mój profil"
                    description="Zaloguj się przez Discord lub Steam, aby zobaczyć swój profil i status weryfikacji."
                />
                <Reveal>
                    <div className="border border-white/10 bg-[#0A0A0A] p-10 md:p-16 max-w-2xl">
                        <p className="text-[#A3A3A3] text-sm leading-relaxed mb-8">
                            Panel profilu jest dostępny po zalogowaniu. Użyj
                            przycisku ZALOGUJ SIĘ w nawigacji.
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

    const joined = new Date(user.created_at).toLocaleDateString("pl-PL");

    return (
        <div
            data-testid="profile-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Panel gracza"
                title="Mój profil"
                description="Twoje konto FluxGG Reborn — dane, rangi i weryfikacja w jednym miejscu."
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Reveal className="lg:col-span-5">
                    <div
                        data-testid="profile-identity-card"
                        className="h-full border border-white/10 bg-[#0A0A0A] p-8 md:p-12"
                    >
                        <div className="flex items-center gap-6">
                            {user.avatar_url ? (
                                <img
                                    data-testid="profile-avatar"
                                    src={user.avatar_url}
                                    alt="Avatar"
                                    className="h-20 w-20 rounded-full border border-white/20 grayscale"
                                />
                            ) : (
                                <span
                                    data-testid="profile-avatar"
                                    aria-label="Avatar"
                                    className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/5 font-display text-2xl font-light tracking-wide text-white text-glow"
                                >
                                    {user.username.slice(0, 2).toUpperCase()}
                                </span>
                            )}
                            <div>
                                <h3
                                    data-testid="profile-username"
                                    className="font-display text-3xl tracking-tight text-white"
                                >
                                    {user.username}
                                </h3>
                                <p className="mt-1 flex items-center gap-2 text-xs text-[#737373] tracking-wide">
                                    <CalendarDays size={13} strokeWidth={1.5} />
                                    Dołączył {joined}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <StatusPill
                                label="STEAM"
                                active={Boolean(user.steam_id)}
                                testId="profile-steam-verified-badge"
                            />
                            <StatusPill
                                label="DISCORD"
                                active={Boolean(user.discord_id)}
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
                                    {user.discord_id ?? "—"}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-[#737373]">Steam ID</span>
                                <span
                                    data-testid="profile-steam-id"
                                    className="font-mono text-white/80"
                                >
                                    {user.steam_id ?? "—"}
                                </span>
                            </div>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center gap-6">
                            <Link
                                to="/weryfikacja"
                                data-testid="profile-manage-verification"
                                className="text-xs tracking-[0.2em] text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors duration-300"
                            >
                                ZARZĄDZAJ WERYFIKACJĄ
                            </Link>
                            <button
                                data-testid="profile-logout-button"
                                onClick={logout}
                                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300"
                            >
                                <LogOut size={14} strokeWidth={1.5} />
                                WYLOGUJ SIĘ
                            </button>
                        </div>
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
                            {user.ranks && user.ranks.length > 0 ? (
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
                            ) : (
                                <p className="text-sm text-[#737373] leading-relaxed">
                                    Brak przypisanych rang. Rangi i produkty
                                    pojawią się tutaj po uruchomieniu sklepu
                                    serwera.
                                </p>
                            )}
                        </div>
                    </Reveal>

                    <Reveal delay={0.18}>
                        <div
                            data-testid="profile-applications-card"
                            className="border border-white/10 bg-[#0A0A0A] p-8 md:p-10"
                        >
                            <p className="text-xs tracking-[0.25em] text-[#737373] mb-6">
                                MOJE PODANIA
                            </p>
                            {applications.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {applications.map((application) => {
                                        const type = applicationTypes.find(
                                            (t) => t.id === application.type,
                                        );
                                        return (
                                            <div
                                                key={application.id}
                                                data-testid={`profile-application-${application.id}`}
                                                className="py-4 flex flex-wrap items-center justify-between gap-3"
                                            >
                                                <div>
                                                    <p className="text-sm text-white">
                                                        {type?.name ??
                                                            application.type}
                                                    </p>
                                                    <p className="text-xs text-[#737373] mt-1">
                                                        {new Date(
                                                            application.created_at,
                                                        ).toLocaleDateString(
                                                            "pl-PL",
                                                        )}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] tracking-[0.2em] border border-white/20 text-white/70 px-2.5 py-1">
                                                    {statusLabels[
                                                        application.status
                                                    ] ??
                                                        application.status.toUpperCase()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-[#737373] leading-relaxed">
                                    Nie złożyłeś jeszcze żadnego podania.{" "}
                                    <Link
                                        to="/podania"
                                        data-testid="profile-goto-applications"
                                        className="text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors duration-300"
                                    >
                                        Przejdź do podań
                                    </Link>
                                </p>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
