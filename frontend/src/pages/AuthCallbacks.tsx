import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

function CallbackShell({
    error,
    testId,
}: {
    error: string | null;
    testId: string;
}) {
    return (
        <div
            data-testid={testId}
            className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center"
        >
            {error ? (
                <>
                    <p className="text-xs tracking-[0.25em] uppercase text-[#737373]">
                        Logowanie nie powiodło się
                    </p>
                    <p
                        data-testid={`${testId}-error`}
                        className="text-white text-lg max-w-md leading-relaxed"
                    >
                        {error}
                    </p>
                    <Link
                        to="/"
                        data-testid={`${testId}-home-link`}
                        className="border border-[#333] text-white text-sm tracking-[0.2em] px-8 py-3.5 hover:border-white/60 transition-colors duration-300"
                    >
                        WRÓĆ NA STRONĘ GŁÓWNĄ
                    </Link>
                </>
            ) : (
                <>
                    <Loader2
                        size={26}
                        strokeWidth={1.5}
                        className="animate-spin text-white/60"
                    />
                    <p className="text-xs tracking-[0.25em] uppercase text-[#737373]">
                        Trwa logowanie…
                    </p>
                </>
            )}
        </div>
    );
}

export function DiscordCallback() {
    const { completeDiscordLogin } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const code = searchParams.get("code");
        if (!code) {
            setError("Brak kodu autoryzacji od Discorda.");
            return;
        }
        completeDiscordLogin(code)
            .then(() => navigate("/profil", { replace: true }))
            .catch((e) =>
                setError(e instanceof Error ? e.message : "Nieznany błąd"),
            );
    }, [completeDiscordLogin, navigate, searchParams]);

    return <CallbackShell error={error} testId="discord-callback" />;
}

export function SteamCallback() {
    const { completeSteamLogin } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (key.startsWith("openid.")) params[key] = value;
        });
        if (Object.keys(params).length === 0) {
            setError("Brak danych autoryzacji od Steama.");
            return;
        }
        completeSteamLogin(params)
            .then(() => navigate("/profil", { replace: true }))
            .catch((e) =>
                setError(e instanceof Error ? e.message : "Nieznany błąd"),
            );
    }, [completeSteamLogin, navigate, searchParams]);

    return <CallbackShell error={error} testId="steam-callback" />;
}
