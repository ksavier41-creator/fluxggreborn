import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { DISCORD_URL } from "@/data/content";

const columns = [
    {
        title: "NAWIGACJA",
        links: [
            { to: "/platnosci", label: "Płatności" },
            { to: "/regulamin", label: "Regulamin" },
            { to: "/o-nas", label: "O nas" },
        ],
    },
    {
        title: "KONTO",
        links: [
            { to: "/profil", label: "Mój profil" },
            { to: "/weryfikacja", label: "Weryfikacja" },
            { to: "/podania", label: "Podania" },
        ],
    },
];

export function Footer() {
    return (
        <footer
            data-testid="footer"
            className="border-t border-white/5 bg-[#050505]"
        >
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-6">
                        <p className="font-display text-2xl font-semibold tracking-tight text-white">
                            FLUXGG
                            <span className="text-white/40 font-light">
                                {" "}
                                REBORN
                            </span>
                        </p>
                        <p className="mt-5 max-w-sm text-sm text-[#737373] leading-relaxed">
                            Nowoczesny serwer GTA V FiveM RP. Wysoka jakość
                            roleplay, żywa społeczność i świat, który nie
                            zasypia.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href={DISCORD_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="footer-discord-link"
                                className="group inline-flex items-center gap-2 border border-white/15 px-5 py-2.5 text-xs tracking-[0.2em] text-white/70 hover:text-white hover:border-white/40 transition-colors duration-300"
                            >
                                DISCORD
                                <ArrowUpRight
                                    size={14}
                                    strokeWidth={1.5}
                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                            <a
                                href="https://steamcommunity.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="footer-steam-link"
                                className="group inline-flex items-center gap-2 border border-white/15 px-5 py-2.5 text-xs tracking-[0.2em] text-white/70 hover:text-white hover:border-white/40 transition-colors duration-300"
                            >
                                STEAM
                                <ArrowUpRight
                                    size={14}
                                    strokeWidth={1.5}
                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                        </div>
                    </div>
                    {columns.map((col) => (
                        <div key={col.title} className="md:col-span-3">
                            <p className="text-xs tracking-[0.25em] text-[#737373] mb-6">
                                {col.title}
                            </p>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4">
                    <p className="text-xs text-[#737373]">
                        © 2026 FluxGG Reborn. Wszelkie prawa zastrzeżone.
                    </p>
                    <p className="text-xs text-[#737373]">
                        Nie jesteśmy powiązani z Rockstar Games ani Take-Two
                        Interactive.
                    </p>
                </div>
            </div>
        </footer>
    );
}
