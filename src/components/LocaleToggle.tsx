"use client";

import { useLocale } from "@/i18n/LocaleProvider";

export default function LocaleToggle() {
    const { locale, setLocale } = useLocale();

    return (
        <button
            onClick={() => setLocale(locale === "en" ? "tr" : "en")}
            className="flex items-center gap-1.5 text-xs font-semibold border border-gray-700/50 hover:border-accent/50 rounded-lg px-2.5 py-1.5 transition-colors text-gray-400 hover:text-accent"
            aria-label="Toggle language"
        >
            <span className={locale === "en" ? "text-primary" : "text-gray-600"}>EN</span>
            <span className="text-gray-600">/</span>
            <span className={locale === "tr" ? "text-primary" : "text-gray-600"}>TR</span>
        </button>
    );
}