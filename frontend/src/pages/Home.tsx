import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/motion";
import { useIntro } from "@/lib/intro";
import { HeroScene } from "@/components/HeroScene";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { Counter } from "@/components/Counter";
import {
    products,
    stats,
    DISCORD_URL,
    FIVEM_CONNECT_URL,
} from "@/data/content";

const lineVariants: Variants = {
    hidden: { y: "115%" },
    show: (i: number) => ({
        y: 0,
        transition: { duration: 1.2, delay: 0.15 + i * 0.12, ease: EASE },
    }),
};

const fadeVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 1, delay: 0.7 + i * 0.12, ease: EASE },
    }),
};

function MaskedLine({
    children,
    index,
    className,
}: {
    children: React.ReactNode;
    index: number;
    className?: string;
}) {
    const { introDone } = useIntro();
    return (
        <span className="block overflow-hidden pb-1">
            <motion.span
                className={`block ${className ?? ""}`}
                custom={index}
                variants={lineVariants}
                initial="hidden"
                animate={introDone ? "show" : "hidden"}
            >
                {children}
            </motion.span>
        </span>
    );
}

const manifesto = [
    {
        n: "01",
        title: "ŚWIAT",
        text: "Miasto, które żyje własnym rytmem. Dynamiczna gospodarka, setki aktywności i przestrzeń, która reaguje na decyzje graczy.",
    },
    {
        n: "02",
        title: "SPOŁECZNOŚĆ",
        text: "Tysiące graczy, jedna zasada: jakość ponad wszystko. Wspólne eventy, frakcje i historie pisane przez lata.",
    },
    {
        n: "03",
        title: "JAKOŚĆ",
        text: "Autorskie skrypty, dopracowana ekonomia i administracja, która dba o immersję. Roleplay na poziomie, jakiego nie znajdziesz nigdzie indziej.",
    },
    {
        n: "04",
        title: "TWOJA HISTORIA",
        text: "Od kuriera po bossa mafii. Od mechanika po komendanta LSPD. W FluxGG Reborn każdy wybór pisze nowy rozdział.",
    },
];

export default function Home() {
    const { introDone } = useIntro();

    return (
        <div data-testid="home-page">
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <HeroScene />
                <div className="hero-vignette absolute inset-0 z-[1] pointer-events-none" />
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full pt-32 pb-24">
                    <MaskedLine index={0}>
                        <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/50 font-medium">
                            Nowa era roleplay.
                        </span>
                    </MaskedLine>
                    <h1 className="mt-6 font-display font-extralight leading-[0.88] tracking-[-0.04em]">
                        <MaskedLine
                            index={1}
                            className="text-[clamp(3.8rem,13vw,11rem)] text-white"
                        >
                            FLUXGG
                        </MaskedLine>
                        <MaskedLine
                            index={2}
                            className="text-[clamp(3.8rem,13vw,11rem)] text-outline"
                        >
                            REBORN
                        </MaskedLine>
                    </h1>
                    <motion.p
                        custom={0}
                        variants={fadeVariants}
                        initial="hidden"
                        animate={introDone ? "show" : "hidden"}
                        className="mt-10 max-w-md text-base md:text-lg text-[#A3A3A3] leading-relaxed"
                    >
                        Wkrocz do świata FluxGG Reborn i napisz własną
                        historię.
                    </motion.p>
                    <motion.div
                        custom={1}
                        variants={fadeVariants}
                        initial="hidden"
                        animate={introDone ? "show" : "hidden"}
                        className="mt-10 flex flex-wrap items-center gap-4"
                    >
                        <a
                            href={FIVEM_CONNECT_URL}
                            data-testid="hero-play-button"
                            className="bg-white text-black text-sm font-medium tracking-[0.2em] px-10 py-4 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                        >
                            GRAJ TERAZ
                        </a>
                        <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="hero-discord-button"
                            className="group inline-flex items-center gap-2 border border-[#333] text-white text-sm tracking-[0.2em] px-10 py-4 hover:border-white/60 active:scale-[0.98] transition-[border-color,transform] duration-200"
                        >
                            DISCORD
                            <ArrowUpRight
                                size={15}
                                strokeWidth={1.5}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: introDone ? 1 : 0 }}
                    transition={{ delay: 1.6, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-white/30"
                >
                    <span className="text-[10px] tracking-[0.35em] uppercase">
                        Przewiń
                    </span>
                    <motion.span
                        animate={{ y: [0, 8, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <ArrowDown size={14} strokeWidth={1.5} />
                    </motion.span>
                </motion.div>
            </section>

            <Marquee />

            <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-40">
                <Reveal>
                    <p className="text-xs tracking-[0.25em] uppercase text-[#737373] font-medium mb-16">
                        Manifest
                    </p>
                </Reveal>
                <div>
                    {manifesto.map((chapter, i) => (
                        <Reveal key={chapter.n} delay={i * 0.05}>
                            <div className="group grid grid-cols-12 gap-6 items-start border-t border-white/10 py-10 md:py-14 transition-colors duration-500 hover:border-white/30">
                                <span className="col-span-3 md:col-span-2 font-display text-sm text-white/30 tracking-[0.2em] pt-2">
                                    {chapter.n}
                                </span>
                                <h3 className="col-span-9 md:col-span-4 font-display text-3xl md:text-5xl font-light tracking-tight text-white transition-transform duration-500 group-hover:translate-x-2">
                                    {chapter.title}
                                </h3>
                                <p className="col-span-12 md:col-span-5 md:col-start-8 text-sm md:text-base text-[#A3A3A3] leading-relaxed">
                                    {chapter.text}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-24 md:pb-40">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
                    <Reveal>
                        <div>
                            <p className="text-xs tracking-[0.25em] uppercase text-[#737373] font-medium mb-5">
                                Sklep
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl tracking-tight font-medium text-white">
                                Wybrane produkty
                            </h2>
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <Link
                            to="/platnosci"
                            data-testid="home-all-products-link"
                            className="group inline-flex items-center gap-2 text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 border-b border-white/20 hover:border-white pb-1"
                        >
                            WSZYSTKIE PRODUKTY
                            <ArrowUpRight
                                size={14}
                                strokeWidth={1.5}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </Link>
                    </Reveal>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products
                        .filter((p) => p.featured)
                        .concat(products.filter((p) => !p.featured))
                        .slice(0, 3)
                        .map((product, i) => (
                            <Reveal key={product.id} delay={i * 0.1}>
                                <TiltCard
                                    testId={`home-product-card-${product.id}`}
                                    className="p-8 md:p-10 flex flex-col"
                                >
                                    <p className="text-xs tracking-[0.25em] text-[#737373]">
                                        {product.period
                                            ? "PAKIET"
                                            : "JEDNORAZOWO"}
                                    </p>
                                    <h3 className="mt-4 font-display text-2xl tracking-tight text-white">
                                        {product.name}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#A3A3A3] leading-relaxed flex-1">
                                        {product.description}
                                    </p>
                                    <p className="mt-8 font-display text-3xl font-light text-white">
                                        {product.price}
                                        {product.period && (
                                            <span className="text-sm text-[#737373]">
                                                {" "}
                                                {product.period}
                                            </span>
                                        )}
                                    </p>
                                </TiltCard>
                            </Reveal>
                        ))}
                </div>
            </section>

            <section className="border-y border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat, i) => (
                        <Reveal key={stat.label} delay={i * 0.08}>
                            <div data-testid={`home-stat-${i}`}>
                                <p className="font-display text-4xl md:text-6xl font-extralight tracking-tighter text-white tabular-nums">
                                    <Counter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                    />
                                </p>
                                <p className="mt-3 text-[10px] md:text-xs tracking-[0.25em] text-[#737373]">
                                    {stat.label}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-40">
                <Reveal>
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tighter text-white leading-[1.05] max-w-4xl">
                        Gotowy, by napisać{" "}
                        <span className="text-glow">swoją historię?</span>
                    </h2>
                </Reveal>
                <Reveal delay={0.15}>
                    <div className="mt-12 flex flex-wrap gap-4">
                        <a
                            href={FIVEM_CONNECT_URL}
                            data-testid="cta-play-button"
                            className="bg-white text-black text-sm font-medium tracking-[0.2em] px-10 py-4 hover:bg-[#E5E5E5] active:scale-[0.98] transition-[background-color,transform] duration-200"
                        >
                            GRAJ TERAZ
                        </a>
                        <Link
                            to="/podania"
                            data-testid="cta-applications-button"
                            className="border border-[#333] text-white text-sm tracking-[0.2em] px-10 py-4 hover:border-white/60 active:scale-[0.98] transition-[border-color,transform] duration-200"
                        >
                            ZŁÓŻ PODANIE
                        </Link>
                    </div>
                </Reveal>
            </section>
        </div>
    );
}
