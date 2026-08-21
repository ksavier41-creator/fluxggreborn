import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
    overline: string;
    title: string;
    description?: string;
}

export function SectionHeading({
    overline,
    title,
    description,
}: SectionHeadingProps) {
    return (
        <div className="mb-14 md:mb-20 max-w-3xl">
            <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#737373] font-medium mb-5">
                    {overline}
                </p>
            </Reveal>
            <Reveal delay={0.08}>
                <h2 className="font-display text-4xl md:text-5xl tracking-tight font-medium text-white">
                    {title}
                </h2>
            </Reveal>
            {description && (
                <Reveal delay={0.16}>
                    <p className="mt-6 text-base md:text-lg text-[#A3A3A3] leading-relaxed">
                        {description}
                    </p>
                </Reveal>
            )}
        </div>
    );
}
