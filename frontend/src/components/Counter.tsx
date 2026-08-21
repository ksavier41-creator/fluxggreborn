import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CounterProps {
    value: number;
    suffix?: string;
}

export function Counter({ value, suffix = "" }: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const mv = useMotionValue(0);
    const spring = useSpring(mv, { duration: 2200, bounce: 0 });
    const inView = useInView(ref, { once: true, margin: "-60px" });

    useEffect(() => {
        if (inView) mv.set(value);
    }, [inView, value, mv]);

    useEffect(
        () =>
            spring.on("change", (v) => {
                if (ref.current) {
                    ref.current.textContent =
                        new Intl.NumberFormat("pl-PL").format(Math.round(v)) +
                        suffix;
                }
            }),
        [spring, suffix],
    );

    return <span ref={ref}>0{suffix}</span>;
}
