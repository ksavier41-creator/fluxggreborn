import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { toast } from "sonner";

export interface User {
    id: string;
    username: string;
    avatar_url: string | null;
    discord_id: string | null;
    steam_id: string | null;
    created_at: string;
    is_admin?: boolean;
    ranks?: string[];
    demo?: boolean;
}

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    loginWithDiscord: () => Promise<void>;
    loginWithSteam: () => Promise<void>;
    completeDiscordLogin: (code: string) => Promise<void>;
    completeSteamLogin: (params: Record<string, string>) => Promise<void>;
    unlinkAccount: (provider: "discord" | "steam") => Promise<void>;
    loginDemo: () => void;
    logout: () => void;
}

const TOKEN_KEY = "fluxgg-auth-token";
const DEMO_KEY = "fluxgg-demo-user";
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEMO_USER: User = {
    id: "demo",
    username: "xNova",
    avatar_url: null,
    discord_id: "482910384756102234",
    steam_id: "76561198206481723",
    created_at: "2024-03-14T00:00:00.000Z",
    ranks: ["FOUNDER", "VIP GOLD", "WHITELIST"],
    demo: true,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

async function parseError(res: Response): Promise<never> {
    let detail = "Wystąpił błąd";
    try {
        const data = await res.json();
        if (data?.detail) detail = data.detail;
    } catch {
        /* keep default */
    }
    throw new Error(detail);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const demoRaw = localStorage.getItem(DEMO_KEY);
        if (demoRaw) {
            try {
                setUser(JSON.parse(demoRaw) as User);
            } catch {
                localStorage.removeItem(DEMO_KEY);
            }
            setLoading(false);
            return;
        }
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        fetch(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    localStorage.removeItem(TOKEN_KEY);
                    return;
                }
                setUser((await res.json()) as User);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const startOAuth = useCallback(
        async (path: string, providerName: string) => {
            try {
                const res = await fetch(`${API}${path}`);
                if (!res.ok) await parseError(res);
                const { url } = await res.json();
                window.location.assign(url);
            } catch (e) {
                toast.error(
                    e instanceof Error
                        ? e.message
                        : `Logowanie ${providerName} nie powiodło się`,
                );
            }
        },
        [],
    );

    const loginWithDiscord = useCallback(
        () => startOAuth("/auth/discord/start", "Discord"),
        [startOAuth],
    );
    const loginWithSteam = useCallback(
        () => startOAuth("/auth/steam/start", "Steam"),
        [startOAuth],
    );

    const completeDiscordLogin = useCallback(async (code: string) => {
        const token = getToken();
        const res = await fetch(`${API}/auth/discord/exchange`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ code }),
        });
        if (!res.ok) await parseError(res);
        const data = await res.json();
        localStorage.removeItem(DEMO_KEY);
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setUser(data.user as User);
        toast.success("Zalogowano przez Discord");
    }, []);

    const completeSteamLogin = useCallback(
        async (params: Record<string, string>) => {
            const token = getToken();
            const res = await fetch(`${API}/auth/steam/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(params),
            });
            if (!res.ok) await parseError(res);
            const data = await res.json();
            localStorage.removeItem(DEMO_KEY);
            localStorage.setItem(TOKEN_KEY, data.access_token);
            setUser(data.user as User);
            toast.success("Konto Steam połączone");
        },
        [],
    );

    const unlinkAccount = useCallback(
        async (provider: "discord" | "steam") => {
            const token = getToken();
            if (!token) return;
            const res = await fetch(`${API}/auth/unlink/${provider}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) await parseError(res);
            setUser((await res.json()) as User);
            toast.success("Odłączono konto");
        },
        [],
    );

    const loginDemo = useCallback(() => {
        localStorage.setItem(DEMO_KEY, JSON.stringify(DEMO_USER));
        setUser(DEMO_USER);
        toast.success("Włączono podgląd konta demo", {
            description: "To nie jest prawdziwe logowanie.",
        });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(DEMO_KEY);
        setUser(null);
        toast("Wylogowano");
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            loading,
            loginWithDiscord,
            loginWithSteam,
            completeDiscordLogin,
            completeSteamLogin,
            unlinkAccount,
            loginDemo,
            logout,
        }),
        [
            user,
            loading,
            loginWithDiscord,
            loginWithSteam,
            completeDiscordLogin,
            completeSteamLogin,
            unlinkAccount,
            loginDemo,
            logout,
        ],
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
