import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [hovering, setHovering] = useState(false);
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const ringX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
    const ringY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });

    useEffect(() => {
        const fine = window.matchMedia("(pointer: fine)");
        setEnabled(fine.matches);
        if (!fine.matches) return;

        const move = (e: PointerEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
        const over = (e: Event) => {
            const target = e.target as HTMLElement;
            setHovering(
                Boolean(
                    target.closest(
                        "a, button, [role='button'], input, textarea, [data-cursor]",
                    ),
                ),
            );
        };
        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("mouseover", over, { passive: true });
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("mouseover", over);
        };
    }, [x, y]);

    if (!enabled) return null;

    return (
        <>
            <motion.div
                aria-hidden
                className="pointer-events-none fixed z-[90] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
                style={{ x, y, translateX: "-50%", translateY: "-50%" }}
            />
            <motion.div
                aria-hidden
                className="pointer-events-none fixed z-[90] rounded-full border border-white/60 mix-blend-difference"
                style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
                animate={{
                    width: hovering ? 44 : 24,
                    height: hovering ? 44 : 24,
                    opacity: hovering ? 1 : 0.55,
                }}
                transition={{ duration: 0.25 }}
            />
        </>
    );
}
