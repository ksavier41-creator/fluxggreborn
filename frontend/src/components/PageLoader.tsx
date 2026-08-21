import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

export function PageLoader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = performance.now();
        const duration = 1400;
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(Math.round(eased * 100));
            if (t < 1) raf = requestAnimationFrame(tick);
            else window.setTimeout(onComplete, 250);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [onComplete]);

    return (
        <motion.div
            data-testid="page-loader"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: EASE }}
        >
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="font-display text-xs tracking-[0.4em] uppercase text-white/40 mb-8"
            >
                FluxGG Reborn
            </motion.p>
            <div className="font-display text-7xl md:text-8xl font-extralight tracking-tighter text-white tabular-nums">
                {progress}
                <span className="text-white/30 text-4xl align-top">%</span>
            </div>
            <div className="mt-10 h-px w-48 bg-white/10 overflow-hidden">
                <div
                    className="h-full bg-white transition-[width] duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </motion.div>
    );
}
