import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { toast } from "sonner";

export type VerificationState = "none" | "pending" | "verified";

export interface Purchase {
    id: string;
    product: string;
    date: string;
    amount: string;
    status: string;
}

export interface DemoUser {
    username: string;
    avatarUrl: string;
    discordId: string;
    steamId: string;
    joinedAt: string;
    ranks: string[];
    purchases: Purchase[];
}

interface StoredAuth {
    user: DemoUser;
    steamStatus: VerificationState;
    discordStatus: VerificationState;
}

interface AuthContextValue {
    user: DemoUser | null;
    isAuthenticated: boolean;
    steamStatus: VerificationState;
    discordStatus: VerificationState;
    loginDemo: () => void;
    logout: () => void;
    connectSteam: () => void;
    connectDiscord: () => void;
    disconnect: (provider: "steam" | "discord") => void;
}

const STORAGE_KEY = "fluxgg-demo-auth-v1";

const DEMO_USER: DemoUser = {
    username: "xNova",
    avatarUrl: "",
    discordId: "482910384756102234",
    steamId: "76561198206481723",
    joinedAt: "14.03.2024",
    ranks: ["FOUNDER", "VIP GOLD", "WHITELIST"],
    purchases: [
        {
            id: "FX-2091",
            product: "VIP GOLD — 30 dni",
            date: "02.06.2026",
            amount: "99,99 zł",
            status: "Opłacone",
        },
        {
            id: "FX-1740",
            product: "Whitelist Priority",
            date: "18.04.2026",
            amount: "19,99 zł",
            status: "Opłacone",
        },
        {
            id: "FX-1203",
            product: "Flux Coins ×5 000",
            date: "03.03.2026",
            amount: "49,99 zł",
            status: "Opłacone",
        },
    ],
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): StoredAuth | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as StoredAuth) : null;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function persist(state: StoredAuth | null) {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [stored, setStored] = useState<StoredAuth | null>(() => readStored());

    const loginDemo = useCallback(() => {
        const next: StoredAuth = {
            user: DEMO_USER,
            steamStatus: "verified",
            discordStatus: "verified",
        };
        persist(next);
        setStored(next);
        toast.success("Zalogowano jako konto demo", {
            description: "Prawdziwe logowanie Discord / Steam — wkrótce.",
        });
    }, []);

    const logout = useCallback(() => {
        persist(null);
        setStored(null);
        toast("Wylogowano");
    }, []);

    const connect = useCallback(
        (provider: "steam" | "discord") => {
            setStored((prev) => {
                if (!prev) return prev;
                const key =
                    provider === "steam" ? "steamStatus" : "discordStatus";
                if (prev[key] !== "none") return prev;
                const next = { ...prev, [key]: "pending" as const };
                persist(next);
                return next;
            });
            window.setTimeout(() => {
                setStored((prev) => {
                    if (!prev) return prev;
                    const key =
                        provider === "steam" ? "steamStatus" : "discordStatus";
                    if (prev[key] !== "pending") return prev;
                    const next = { ...prev, [key]: "verified" as const };
                    persist(next);
                    return next;
                });
                toast.success(
                    provider === "steam"
                        ? "Konto Steam zweryfikowane"
                        : "Konto Discord zweryfikowane",
                    { description: "Proces demonstracyjny — OAuth wkrótce." },
                );
            }, 1800);
        },
        [],
    );

    const disconnect = useCallback((provider: "steam" | "discord") => {
        setStored((prev) => {
            if (!prev) return prev;
            const key = provider === "steam" ? "steamStatus" : "discordStatus";
            const next = { ...prev, [key]: "none" as const };
            persist(next);
            return next;
        });
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user: stored?.user ?? null,
            isAuthenticated: stored !== null,
            steamStatus: stored?.steamStatus ?? "none",
            discordStatus: stored?.discordStatus ?? "none",
            loginDemo,
            logout,
            connectSteam: () => connect("steam"),
            connectDiscord: () => connect("discord"),
            disconnect,
        }),
        [stored, loginDemo, logout, connect, disconnect],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
