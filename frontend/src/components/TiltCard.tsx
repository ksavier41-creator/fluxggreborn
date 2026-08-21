import { useRef, type ReactNode, type MouseEvent } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    testId?: string;
}

export function TiltCard({ children, className, testId }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const glowOpacity = useMotionValue(0);
    const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), {
        stiffness: 180,
        damping: 22,
    });
    const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), {
        stiffness: 180,
        damping: 22,
    });
    const glowX = useTransform(mx, (v) => `${v * 100}%`);
    const glowY = useTransform(my, (v) => `${v * 100}%`);
    const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, rgba(255,255,255,0.07), transparent 65%)`;

    const onMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
        glowOpacity.set(1);
    };

    const onLeave = () => {
        mx.set(0.5);
        my.set(0.5);
        glowOpacity.set(0);
    };

    return (
        <div style={{ perspective: 1000 }} className="h-full">
            <motion.div
                ref={ref}
                data-testid={testId}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className={`relative h-full overflow-hidden bg-[#0A0A0A] border border-[#1A1A1A] transition-colors duration-300 hover:border-white/25 ${className ?? ""}`}
            >
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: glow, opacity: glowOpacity }}
                />
                {children}
            </motion.div>
        </div>
    );
}
