"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const total = docHeight - windowHeight;
            const pct = total > 0 ? Math.min((scrollTop / total) * 100, 100) : 0;
            setProgress(pct);
        }

        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[200] h-0.5 bg-transparent pointer-events-none">
            <div
                className="h-full bg-accent transition-none"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}