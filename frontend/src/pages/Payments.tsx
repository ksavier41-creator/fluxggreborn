import { Check } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { SectionHeading } from "@/components/SectionHeading";
import { products } from "@/data/content";

export default function Payments() {
    const onBuy = (name: string) =>
        toast(`Produkt: ${name}`, {
            description:
                "System płatności jest w przygotowaniu. Integracja zostanie podłączona wkrótce.",
        });

    return (
        <div
            data-testid="payments-page"
            className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-24 md:pb-40"
        >
            <SectionHeading
                overline="Sklep serwera"
                title="Płatności"
                description="Wesprzyj serwer i zyskaj dostęp do przywilejów premium. Wszystkie produkty aktywowane są automatycznie po zaksięgowaniu płatności."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, i) => (
                    <Reveal key={product.id} delay={(i % 3) * 0.08}>
                        <TiltCard
                            testId={`product-card-${product.id}`}
                            className={`p-8 md:p-10 flex flex-col ${
                                product.featured
                                    ? "border-white/25 bg-[#0D0D0D]"
                                    : ""
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-display text-2xl tracking-tight text-white">
                                    {product.name}
                                </h3>
                                {product.featured && (
                                    <span className="text-[10px] tracking-[0.25em] border border-white/25 text-white/80 px-2.5 py-1 shrink-0">
                                        POPULARNE
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 text-sm text-[#A3A3A3] leading-relaxed">
                                {product.description}
                            </p>
                            <p className="mt-8 font-display text-4xl font-extralight tracking-tight text-white">
                                {product.price}
                                {product.period && (
                                    <span className="text-sm text-[#737373]">
                                        {" "}
                                        {product.period}
                                    </span>
                                )}
                            </p>
                            <ul className="mt-8 space-y-3 flex-1">
                                {product.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 text-sm text-[#A3A3A3]"
                                    >
                                        <Check
                                            size={15}
                                            strokeWidth={1.5}
                                            className="mt-0.5 text-white/60 shrink-0"
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                data-testid={`buy-button-${product.id}`}
                                onClick={() => onBuy(product.name)}
                                className={`mt-10 w-full py-3.5 text-sm tracking-[0.2em] active:scale-[0.98] transition-[background-color,border-color,color,transform] duration-200 ${
                                    product.featured
                                        ? "bg-white text-black font-medium hover:bg-[#E5E5E5]"
                                        : "border border-[#333] text-white hover:border-white/60"
                                }`}
                            >
                                KUP TERAZ
                            </button>
                        </TiltCard>
                    </Reveal>
                ))}
            </div>
            <Reveal delay={0.2}>
                <p className="mt-16 text-xs text-[#737373] max-w-xl leading-relaxed">
                    Płatności są w pełni dobrowolne i wspierają rozwój serwera.
                    Produkty cyfrowe nie podlegają zwrotowi po aktywacji —
                    szczegóły w regulaminie, sekcja Płatności.
                </p>
            </Reveal>
        </div>
    );
}
