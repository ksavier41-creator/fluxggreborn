import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { SectionHeading } from "@/components/SectionHeading";
import { stats, DISCORD_URL } from "@/data/content";
import { ArrowUpRight } from "lucide-react";

export default function About() {
    return (
        <div
            data-testid="about-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Kim jesteśmy"
                title="O FluxGG Reborn"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                <div className="lg:col-span-7 space-y-10">
                    <Reveal>
                        <p className="font-display text-2xl md:text-4xl font-light tracking-tight text-white leading-snug">
                            FluxGG Reborn to nowoczesny serwer GTA V FiveM RP,
                            stworzony przez graczy — dla graczy, którzy oczekują
                            czegoś więcej niż kolejnego miasta.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="text-base md:text-lg text-[#A3A3A3] leading-relaxed max-w-2xl">
                            Stawiamy na wysoką jakość roleplay, autorskie
                            skrypty i rozbudowany, żyjący świat. Nasza
                            gospodarka reaguje na decyzje graczy, frakcje toczą
                            własne historie, a każda postać ma znaczenie. Od
                            pierwszego dnia budujemy społeczność opartą na
                            wzajemnym szacunku i wspólnej pasji do odgrywania
                            ról.
                        </p>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="text-base md:text-lg text-[#A3A3A3] leading-relaxed max-w-2xl">
                            Reborn to nie przypadek w nazwie — to powrót do
                            korzeni roleplay, w wydaniu, jakiego wcześniej nie
                            było. Regularne eventy, aktywna administracja i
                            rozwój napędzany opiniami społeczności.
                        </p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="about-discord-button"
                            className="group inline-flex items-center gap-2 bg-white text-black text-sm font-medium tracking-[0.2em] px-10 py-4 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                        >
                            DOŁĄCZ NA DISCORD
                            <ArrowUpRight
                                size={15}
                                strokeWidth={1.5}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    </Reveal>
                </div>
                <div className="lg:col-span-5">
                    <div className="border border-white/10 bg-[#0A0A0A] divide-y divide-white/5">
                        {stats.map((stat, i) => (
                            <Reveal key={stat.label} delay={i * 0.08}>
                                <div
                                    data-testid={`about-stat-${i}`}
                                    className="p-8 md:p-10 flex items-end justify-between gap-6"
                                >
                                    <p className="text-[10px] md:text-xs tracking-[0.25em] text-[#737373] max-w-[8rem]">
                                        {stat.label}
                                    </p>
                                    <p className="font-display text-5xl md:text-6xl font-extralight tracking-tighter text-white tabular-nums">
                                        <Counter
                                            value={stat.value}
                                            suffix={stat.suffix}
                                        />
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                    <Reveal delay={0.2}>
                        <p className="mt-6 text-xs text-[#737373] leading-relaxed">
                            Statystyki prezentowane są poglądowo — docelowo
                            będą pobierane na żywo z API serwera.
                        </p>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
