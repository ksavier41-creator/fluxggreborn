import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { applicationTypes, whitelistQuestionLabels } from "@/data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

interface AdminApplication {
    id: string;
    username: string;
    type: string;
    nick: string;
    discord: string;
    steam_id: string;
    motivation: string;
    answers?: Record<string, string> | null;
    status: string;
    created_at: string;
}

interface AdminEntry {
    discord_id: string;
    added_at: string;
}

const statusLabels: Record<string, string> = {
    pending: "OCZEKUJE",
    accepted: "PRZYJĘTE",
    rejected: "ODRZUCONE",
};

function ApplicationStatusPill({ status }: { status: string }) {
    return (
        <span
            data-testid={`admin-application-status-${status}`}
            className={`text-[10px] tracking-[0.2em] border px-2.5 py-1 ${
                status === "accepted"
                    ? "border-white/40 text-white text-glow"
                    : status === "rejected"
                      ? "border-white/10 text-white/35 line-through"
                      : "border-white/20 text-white/70"
            }`}
        >
            {statusLabels[status] ?? status.toUpperCase()}
        </span>
    );
}

function CenteredNote({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <p className="text-xs tracking-[0.25em] uppercase text-[#737373]">
                {children}
            </p>
        </div>
    );
}

export default function Admin() {
    const { user, isAuthenticated, loading } = useAuth();
    const [applications, setApplications] = useState<AdminApplication[]>([]);
    const [admins, setAdmins] = useState<AdminEntry[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [newAdminId, setNewAdminId] = useState("");
    const [bootId, setBootId] = useState("");
    const [bootKey, setBootKey] = useState("");
    const [booting, setBooting] = useState(false);

    const authHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("fluxgg-auth-token") ?? ""}`,
    });

    const load = useCallback(async () => {
        if (!user?.is_admin) return;
        setDataLoading(true);
        try {
            const [appsRes, adminsRes] = await Promise.all([
                fetch(`${API}/admin/applications`, { headers: authHeaders() }),
                fetch(`${API}/admin/admins`, { headers: authHeaders() }),
            ]);
            if (appsRes.ok) setApplications(await appsRes.json());
            if (adminsRes.ok) setAdmins(await adminsRes.json());
        } catch {
            toast.error("Nie udało się pobrać danych");
        } finally {
            setDataLoading(false);
        }
    }, [user?.is_admin]);

    useEffect(() => {
        void load();
    }, [load]);

    const setStatus = async (id: string, status: "accepted" | "rejected") => {
        setBusyId(id);
        try {
            const res = await fetch(`${API}/admin/applications/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Błąd aktualizacji");
            const updated = (await res.json()) as AdminApplication;
            setApplications((prev) =>
                prev.map((a) => (a.id === id ? updated : a)),
            );
            toast.success(
                status === "accepted"
                    ? "Podanie przyjęte"
                    : "Podanie odrzucone",
            );
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Błąd");
        } finally {
            setBusyId(null);
        }
    };

    const addAdmin = async () => {
        const id = newAdminId.trim();
        if (!id) return;
        try {
            const res = await fetch(`${API}/admin/admins`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body: JSON.stringify({ discord_id: id }),
            });
            if (!res.ok) throw new Error("Nie udało się dodać administratora");
            const added = (await res.json()) as AdminEntry;
            setAdmins((prev) =>
                prev.some((a) => a.discord_id === added.discord_id)
                    ? prev
                    : [...prev, added],
            );
            setNewAdminId("");
            toast.success("Administrator dodany");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Błąd");
        }
    };

    const removeAdmin = async (discordId: string) => {
        try {
            const res = await fetch(`${API}/admin/admins/${discordId}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.detail ?? "Nie udało się usunąć");
            }
            setAdmins((prev) =>
                prev.filter((a) => a.discord_id !== discordId),
            );
            toast.success("Administrator usunięty");
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Błąd");
        }
    };

    const claimAccess = async () => {
        setBooting(true);
        try {
            const res = await fetch(`${API}/admin/bootstrap`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-key": bootKey.trim(),
                },
                body: JSON.stringify({
                    discord_id: (bootId || user?.discord_id || "").trim(),
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.detail ?? "Aktywacja nie powiodła się");
            }
            toast.success("Dostęp administratora aktywowany");
            window.setTimeout(() => window.location.reload(), 800);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Błąd");
            setBooting(false);
        }
    };

    if (loading) return <CenteredNote>Ładowanie…</CenteredNote>;

    if (!isAuthenticated || !user) {
        return (
            <div
                data-testid="admin-page"
                className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 min-h-screen"
            >
                <SectionHeading
                    overline="Strefa administracji"
                    title="Panel administracji"
                    description="Dostęp mają wyłącznie administratorzy z połączonym kontem Discord."
                />
                <Reveal>
                    <p className="text-[#A3A3A3] text-sm">
                        Użyj przycisku ZALOGUJ SIĘ w nawigacji.
                    </p>
                </Reveal>
            </div>
        );
    }

    if (!user.is_admin) {
        return (
            <div
                data-testid="admin-page"
                className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 min-h-screen"
            >
                <SectionHeading
                    overline="Strefa administracji"
                    title="Brak dostępu"
                    description="Twoje konto nie ma uprawnień administratora. Jeśli zakładasz panel po raz pierwszy, aktywuj dostęp kluczem administracyjnym."
                />
                <Reveal>
                    <div className="border border-white/10 bg-[#0A0A0A] p-8 md:p-12 max-w-xl">
                        <p className="text-xs tracking-[0.25em] text-[#737373] mb-6">
                            AKTYWACJA PIERWSZEGO ADMINISTRATORA
                        </p>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs tracking-[0.2em] text-[#737373] mb-2">
                                    DISCORD ID
                                </label>
                                <input
                                    data-testid="admin-bootstrap-id"
                                    value={bootId || user.discord_id || ""}
                                    onChange={(e) => setBootId(e.target.value)}
                                    placeholder="Twoje Discord ID"
                                    className="w-full bg-[#050505] border border-white/10 focus:border-white/40 outline-none text-white text-sm py-3 px-4 transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-xs tracking-[0.2em] text-[#737373] mb-2">
                                    KLUCZ ADMINISTRACYJNY
                                </label>
                                <input
                                    data-testid="admin-bootstrap-key"
                                    type="password"
                                    value={bootKey}
                                    onChange={(e) => setBootKey(e.target.value)}
                                    placeholder="Klucz z konfiguracji serwera"
                                    className="w-full bg-[#050505] border border-white/10 focus:border-white/40 outline-none text-white text-sm py-3 px-4 transition-colors duration-300"
                                />
                            </div>
                            <button
                                data-testid="admin-bootstrap-submit"
                                onClick={() => void claimAccess()}
                                disabled={booting}
                                className="w-full bg-white text-black text-sm font-medium tracking-[0.2em] py-3.5 hover:bg-[#E5E5E5] disabled:opacity-40 disabled:pointer-events-none transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {booting && (
                                    <Loader2
                                        size={15}
                                        strokeWidth={1.5}
                                        className="animate-spin"
                                    />
                                )}
                                AKTYWUJ DOSTĘP
                            </button>
                            {!user.discord_id && (
                                <p className="text-[11px] text-[#737373] leading-relaxed">
                                    Twoje konto nie ma połączonego Discorda —
                                    najpierw połącz je na stronie Weryfikacji.
                                </p>
                            )}
                        </div>
                    </div>
                </Reveal>
            </div>
        );
    }

    const pendingCount = applications.filter(
        (a) => a.status === "pending",
    ).length;

    return (
        <div
            data-testid="admin-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Strefa administracji"
                title="Panel administracji"
                description={`${applications.length} podań · ${pendingCount} oczekujących · ${admins.length} administratorów`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <Reveal>
                        <div className="border border-white/10 bg-[#0A0A0A] p-8 md:p-10">
                            <p className="text-xs tracking-[0.25em] text-[#737373] mb-8">
                                PODANIA GRACZY
                            </p>
                            {dataLoading ? (
                                <p className="text-sm text-[#737373]">
                                    Ładowanie…
                                </p>
                            ) : applications.length === 0 ? (
                                <p className="text-sm text-[#737373]">
                                    Brak podań.
                                </p>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {applications.map((application) => {
                                        const type = applicationTypes.find(
                                            (t) => t.id === application.type,
                                        );
                                        return (
                                            <div
                                                key={application.id}
                                                data-testid={`admin-application-${application.id}`}
                                                className="py-6 first:pt-0 last:pb-0"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm text-white font-medium">
                                                            {type?.name ??
                                                                application.type}
                                                        </p>
                                                        <p className="text-xs text-[#737373] mt-1">
                                                            {application.username}{" "}
                                                            ·{" "}
                                                            {new Date(
                                                                application.created_at,
                                                            ).toLocaleDateString(
                                                                "pl-PL",
                                                            )}
                                                        </p>
                                                    </div>
                                                    <ApplicationStatusPill
                                                        status={
                                                            application.status
                                                        }
                                                    />
                                                </div>
                                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                    <p className="text-[#A3A3A3]">
                                                        <span className="text-[#737373]">
                                                            Nick:{" "}
                                                        </span>
                                                        {application.nick}
                                                    </p>
                                                    <p className="text-[#A3A3A3] font-mono">
                                                        <span className="text-[#737373] font-body">
                                                            Discord:{" "}
                                                        </span>
                                                        {application.discord}
                                                    </p>
                                                    <p className="text-[#A3A3A3] font-mono">
                                                        <span className="text-[#737373] font-body">
                                                            Steam:{" "}
                                                        </span>
                                                        {application.steam_id}
                                                    </p>
                                                </div>
                                                {application.answers ? (
                                                    <div
                                                        data-testid={`admin-answers-${application.id}`}
                                                        className="mt-4 space-y-4 border-t border-white/5 pt-4"
                                                    >
                                                        {Object.entries(
                                                            application.answers,
                                                        ).map(
                                                            ([key, value]) => (
                                                                <div key={key}>
                                                                    <p className="text-[10px] tracking-[0.2em] text-[#737373] leading-relaxed">
                                                                        {(
                                                                            whitelistQuestionLabels[
                                                                                key
                                                                            ] ??
                                                                            key
                                                                        ).toUpperCase()}
                                                                    </p>
                                                                    <p className="mt-1.5 text-sm text-[#A3A3A3] leading-relaxed">
                                                                        {value}
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="mt-3 text-sm text-[#A3A3A3] leading-relaxed">
                                                        {application.motivation}
                                                    </p>
                                                )}
                                                {application.status ===
                                                    "pending" && (
                                                    <div className="mt-5 flex gap-3">
                                                        <button
                                                            data-testid={`admin-accept-${application.id}`}
                                                            onClick={() =>
                                                                void setStatus(
                                                                    application.id,
                                                                    "accepted",
                                                                )
                                                            }
                                                            disabled={
                                                                busyId ===
                                                                application.id
                                                            }
                                                            className="inline-flex items-center gap-2 bg-white text-black text-xs font-medium tracking-[0.2em] px-6 py-2.5 hover:bg-[#E5E5E5] disabled:opacity-40 transition-colors duration-200"
                                                        >
                                                            <Check
                                                                size={13}
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                            PRZYJMIJ
                                                        </button>
                                                        <button
                                                            data-testid={`admin-reject-${application.id}`}
                                                            onClick={() =>
                                                                void setStatus(
                                                                    application.id,
                                                                    "rejected",
                                                                )
                                                            }
                                                            disabled={
                                                                busyId ===
                                                                application.id
                                                            }
                                                            className="inline-flex items-center gap-2 border border-[#333] text-white/70 text-xs tracking-[0.2em] px-6 py-2.5 hover:border-white/50 hover:text-white disabled:opacity-40 transition-colors duration-200"
                                                        >
                                                            <X
                                                                size={13}
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            />
                                                            ODRZUĆ
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Reveal>
                </div>

                <div className="lg:col-span-4">
                    <Reveal delay={0.1}>
                        <div
                            data-testid="admin-admins-card"
                            className="border border-white/10 bg-[#0A0A0A] p-8 md:p-10"
                        >
                            <p className="text-xs tracking-[0.25em] text-[#737373] mb-8 flex items-center gap-2">
                                <ShieldCheck size={14} strokeWidth={1.5} />
                                ADMINISTRATORZY
                            </p>
                            <div className="flex gap-3">
                                <input
                                    data-testid="admin-add-input"
                                    value={newAdminId}
                                    onChange={(e) =>
                                        setNewAdminId(e.target.value)
                                    }
                                    placeholder="Discord ID"
                                    className="flex-1 min-w-0 bg-[#050505] border border-white/10 focus:border-white/40 outline-none text-white placeholder:text-white/25 text-sm py-3 px-4 transition-colors duration-300"
                                />
                                <button
                                    data-testid="admin-add-button"
                                    onClick={() => void addAdmin()}
                                    className="shrink-0 bg-white text-black px-4 hover:bg-[#E5E5E5] transition-colors duration-200"
                                    aria-label="Dodaj administratora"
                                >
                                    <Plus size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                            <div className="mt-6 divide-y divide-white/5">
                                {admins.map((admin) => (
                                    <div
                                        key={admin.discord_id}
                                        data-testid={`admin-entry-${admin.discord_id}`}
                                        className="py-3.5 flex items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="font-mono text-sm text-white/80">
                                                {admin.discord_id}
                                            </p>
                                            <p className="text-[10px] text-[#737373] mt-0.5">
                                                od{" "}
                                                {new Date(
                                                    admin.added_at,
                                                ).toLocaleDateString("pl-PL")}
                                            </p>
                                        </div>
                                        <button
                                            data-testid={`admin-remove-${admin.discord_id}`}
                                            onClick={() =>
                                                void removeAdmin(
                                                    admin.discord_id,
                                                )
                                            }
                                            aria-label="Usuń administratora"
                                            className="text-white/30 hover:text-white transition-colors duration-200 p-1.5"
                                        >
                                            <Trash2 size={15} strokeWidth={1.5} />
                                        </button>
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
