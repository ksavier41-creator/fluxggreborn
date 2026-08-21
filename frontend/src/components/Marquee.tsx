import { marqueeItems } from "@/data/content";

export function Marquee() {
    const row = [...marqueeItems, ...marqueeItems];
    return (
        <div
            className="relative overflow-hidden border-y border-white/5 py-6 md:py-8 select-none"
            aria-hidden
        >
            <div className="animate-marquee flex w-max items-center whitespace-nowrap">
                {[0, 1].map((half) => (
                    <div key={half} className="flex items-center">
                        {row.map((item, i) => (
                            <span
                                key={`${half}-${i}`}
                                className="flex items-center font-display text-2xl md:text-4xl font-extralight tracking-[0.15em] text-white/25"
                            >
                                <span className="px-8 md:px-12">{item}</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
