import { createContext, useContext, useState, type ReactNode } from "react";

interface IntroContextValue {
    introDone: boolean;
    setIntroDone: (v: boolean) => void;
}

const IntroContext = createContext<IntroContextValue>({
    introDone: false,
    setIntroDone: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
    const [introDone, setIntroDone] = useState(false);
    return (
        <IntroContext.Provider value={{ introDone, setIntroDone }}>
            {children}
        </IntroContext.Provider>
    );
}

export const useIntro = () => useContext(IntroContext);
