import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ruleCategories, type RuleCategory } from "@/data/content";
import { EASE } from "@/lib/motion";

function CategoryBlock({
    category,
    defaultOpen,
}: {
    category: RuleCategory;
    defaultOpen: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div
            data-testid={`rule-category-${category.id}`}
            className="border-t border-white/10"
        >
            <button
                data-testid={`rule-category-toggle-${category.id}`}
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-6 py-7 md:py-9 text-left group"
            >
                <span className="font-display text-2xl md:text-4xl font-light tracking-tight text-white/80 group-hover:text-white transition-colors duration-300">
                    {category.title}
                </span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="text-white/40 group-hover:text-white transition-colors duration-300 shrink-0"
                >
                    <ChevronDown size={20} strokeWidth={1.5} />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <div className="pb-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {category.rules.map((rule) => (
                                <div key={rule.title}>
                                    <p className="text-sm font-medium text-white tracking-wide">
                                        {rule.title}
                                    </p>
                                    <p className="mt-2 text-sm text-[#A3A3A3] leading-relaxed">
                                        {rule.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Rules() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return ruleCategories;
        return ruleCategories
            .map((category) => ({
                ...category,
                rules: category.rules.filter(
                    (rule) =>
                        rule.title.toLowerCase().includes(q) ||
                        rule.content.toLowerCase().includes(q),
                ),
            }))
            .filter(
                (category) =>
                    category.title.toLowerCase().includes(q) ||
                    category.rules.length > 0,
            );
    }, [query]);

    return (
        <div
            data-testid="rules-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Zasady gry"
                title="Regulamin"
                description="Znajomość regulaminu jest obowiązkowa dla każdego gracza. Skorzystaj z wyszukiwarki, aby szybko znaleźć interesujący Cię zapis."
            />
            <Reveal>
                <div className="relative max-w-2xl mb-16">
                    <Search
                        size={18}
                        strokeWidth={1.5}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                    />
                    <input
                        data-testid="rules-search-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Szukaj w regulaminie…"
                        className="w-full bg-[#0A0A0A] border border-white/10 focus:border-white/40 outline-none text-white placeholder:text-white/30 text-sm tracking-wide py-4 pl-13 pr-5 transition-colors duration-300"
                        style={{ paddingLeft: "3.25rem" }}
                    />
                </div>
            </Reveal>
            {filtered.length === 0 ? (
                <p
                    data-testid="rules-empty-state"
                    className="text-[#737373] text-sm py-16 border-t border-white/10"
                >
                    Brak wyników dla „{query}”.
                </p>
            ) : (
                <div className="border-b border-white/10">
                    {filtered.map((category, i) => (
                        <CategoryBlock
                            key={category.id}
                            category={category}
                            defaultOpen={query.trim().length > 0 || i === 0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
