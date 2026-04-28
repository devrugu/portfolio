"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, Locale } from "./translations";

type Translation = typeof translations.en;

interface LocaleContextType {
    locale: Locale;
    t: Translation;
    setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
    locale: "en",
    t: translations.en as Translation,
    setLocale: () => { },
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");

    useEffect(() => {
        const saved = localStorage.getItem("locale") as Locale | null;
        if (saved === "tr" || saved === "en") {
            setLocaleState(saved);
        }
    }, []);

    function setLocale(l: Locale) {
        setLocaleState(l);
        localStorage.setItem("locale", l);
    }

    return (
        <LocaleContext.Provider value={{ locale, t: translations[locale] as Translation, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}