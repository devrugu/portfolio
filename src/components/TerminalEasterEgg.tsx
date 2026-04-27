"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRIGGER_SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

type LineType = "input" | "output" | "error" | "system" | "matrix" | "snake" | "clock" | "hack" | "ascii";
type Line = { type: LineType; text: string; id?: number };

const BOOT_LINES: Line[] = [
    { type: "system", text: "ugurcanyilmaz.com terminal v2.0.0" },
    { type: "system", text: "Type 'help' for available commands." },
    { type: "system", text: "" },
];

const ASCII_FONT: Record<string, string[]> = {
    "A": ["▄▀█", "█▀█"], "B": ["█▄▄", "█▄▄"], "C": ["█▀▀", "█▄▄"], "D": ["█▀▄", "█▄▀"],
    "E": ["█▀▀", "█▄▄"], "F": ["█▀▀", "█░░"], "G": ["█▀▀", "█▄█"], "H": ["█░█", "█▀█"],
    "I": ["█", "█"], "J": ["░█", "█▄█"], "K": ["█▀▄", "█▄▀"], "L": ["█░░", "█▄▄"],
    "M": ["█▄█", "█░█"], "N": ["█▄░█", "█░▀█"], "O": ["█▀█", "█▄█"], "P": ["█▀▀", "█░░"],
    "Q": ["█▀█", "▀▀█"], "R": ["█▀█", "█▀▄"], "S": ["▄▀", "▀▄"], "T": ["▀█▀", "░█░"],
    "U": ["█░█", "█▄█"], "V": ["▀▄▀", "░▀░"], "W": ["█░█", "▀▄▀"], "X": ["▀▄▀", "▄▀▄"],
    "Y": ["▀▄▀", "░█░"], "Z": ["▀▀█", "█▄▄"], " ": ["░", "░"],
    "0": ["█▀█", "█▄█"], "1": ["░█", "░█"], "2": ["▀▀█", "█▄▄"], "3": ["▀▀█", "▄▄█"],
    "4": ["█░█", "▀▀█"], "5": ["█▀▀", "▄▄█"], "6": ["█▀▀", "█▄█"], "7": ["▀▀█", "░░█"],
    "8": ["█▀█", "█▄█"], "9": ["█▀█", "▄▄█"], "!": ["█", "▄"], ".": ["░", "█"],
};

function renderAscii(text: string): string[] {
    const upper = text.toUpperCase();
    const row0 = upper.split("").map(c => ASCII_FONT[c]?.[0] ?? "?").join(" ");
    const row1 = upper.split("").map(c => ASCII_FONT[c]?.[1] ?? "?").join(" ");
    return [row0, row1];
}

// Snake game state
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pos = { x: number; y: number };
const COLS = 70, ROWS = 18;

function initSnake() {
    return {
        snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }] as Pos[],
        food: { x: 15, y: 5 } as Pos,
        dir: "RIGHT" as Dir,
        score: 0,
        alive: true,
    };
}

function renderSnake(state: ReturnType<typeof initSnake>): string[] {
    const grid: string[][] = Array.from({ length: ROWS }, () => Array(COLS).fill("."));
    state.snake.forEach((p, i) => {
        if (p.x >= 0 && p.x < COLS && p.y >= 0 && p.y < ROWS)
            grid[p.y][p.x] = i === 0 ? "O" : "o";
    });
    if (state.food.x >= 0 && state.food.x < COLS && state.food.y >= 0 && state.food.y < ROWS)
        grid[state.food.y][state.food.x] = "*";
    const border = "+" + "-".repeat(COLS) + "+";
    const bottom = "+" + "-".repeat(COLS) + "+";
    const rows = grid.map(r => "|" + r.join("") + "|");
    return [border, ...rows, bottom, `Score: ${state.score}  [WASD to move, Q to quit]`];
}

function stepSnake(state: ReturnType<typeof initSnake>, dir: Dir): ReturnType<typeof initSnake> {
    if (!state.alive) return state;
    const head = { ...state.snake[0] };
    if (dir === "UP") head.y--;
    if (dir === "DOWN") head.y++;
    if (dir === "LEFT") head.x--;
    if (dir === "RIGHT") head.x++;

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)
        return { ...state, alive: false };
    // Self collision
    if (state.snake.some(p => p.x === head.x && p.y === head.y))
        return { ...state, alive: false };

    const ateFood = head.x === state.food.x && head.y === state.food.y;
    const newSnake = [head, ...state.snake.slice(0, ateFood ? undefined : -1)];
    const newFood = ateFood
        ? { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
        : state.food;
    return { ...state, snake: newSnake, food: newFood, dir, score: state.score + (ateFood ? 10 : 0) };
}

const QUOTES = [
    "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" — Martin Fowler",
    "\"First, solve the problem. Then, write the code.\" — John Johnson",
    "\"Code is like humor. When you have to explain it, it's bad.\" — Cory House",
    "\"Programming isn't about what you know; it's about what you can figure out.\" — Chris Pine",
    "\"The best error message is the one that never shows up.\" — Thomas Fuchs",
    "\"Debugging is twice as hard as writing the code. Therefore, if you write code as cleverly as possible, you are, by definition, not smart enough to debug it.\" — Brian Kernighan",
    "\"Real-time is not about being fast. It's about being on time.\" — Unknown",
    "\"C++ is history repeated as tragedy. Python is history repeated as farce.\" — Scott Meyers",
];

const JOKES = [
    ["Why do programmers prefer dark mode?", "Because light attracts bugs! 🐛"],
    ["How many programmers does it take to change a light bulb?", "None, that's a hardware problem."],
    ["Why do Java developers wear glasses?", "Because they don't C#! 👓"],
    ["A SQL query walks into a bar...", "...walks up to two tables and asks: 'Can I join you?'"],
    ["Why did the programmer quit his job?", "Because he didn't get arrays! 💸"],
    ["What's a computer's favorite snack?", "Microchips! 🍟"],
    ["Why was the JavaScript developer sad?", "Because he didn't Node how to Express himself."],
    ["!false", "...it's funny because it's true. 😄"],
];

export default function TerminalEasterEgg() {
    const [open, setOpen] = useState(false);
    const [lines, setLines] = useState<Line[]>(BOOT_LINES);
    const [input, setInput] = useState("");
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    // Modes
    const [matrixActive, setMatrixActive] = useState(false);
    const [hackActive, setHackActive] = useState(false);
    const [clockActive, setClockActive] = useState(false);
    const [snakeState, setSnakeState] = useState<ReturnType<typeof initSnake> | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<string[]>([]);
    const matrixRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hackRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const snakeRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const snakeStateRef = useRef<ReturnType<typeof initSnake> | null>(null);

    // Konami code detection
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            seqRef.current = [...seqRef.current, e.key].slice(-TRIGGER_SEQUENCE.length);
            if (seqRef.current.join(",") === TRIGGER_SEQUENCE.join(",")) {
                setOpen(o => !o);
                seqRef.current = [];
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

    // Cleanup all intervals on close
    useEffect(() => {
        if (!open) {
            [matrixRef, hackRef, clockRef, snakeRef].forEach(r => { if (r.current) clearInterval(r.current); r.current = null; });
            setMatrixActive(false); setHackActive(false); setClockActive(false); setSnakeState(null);
        }
    }, [open]);

    const addLines = useCallback((newLines: Line[]) => {
        setLines(l => [...l, ...newLines]);
    }, []);

    const stopAllModes = useCallback(() => {
        [matrixRef, hackRef, clockRef, snakeRef].forEach(r => { if (r.current) clearInterval(r.current); r.current = null; });
        setMatrixActive(false); setHackActive(false); setClockActive(false); setSnakeState(null);
        snakeStateRef.current = null;
    }, []);

    // Snake key handler
    useEffect(() => {
        if (!snakeState) return;
        function onKey(e: KeyboardEvent) {
            if (!snakeStateRef.current) return;
            const dirMap: Record<string, Dir> = { w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT", W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT" };
            if (e.key === "q" || e.key === "Q") {
                stopAllModes();
                addLines([{ type: "system", text: "Snake quit. Final score: " + snakeStateRef.current.score }]);
                return;
            }
            const dir = dirMap[e.key];
            if (dir) { e.preventDefault(); }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [snakeState, stopAllModes, addLines]);

    const runCommand = useCallback(async (raw: string) => {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;

        setCmdHistory(h => [raw, ...h]);
        setHistIdx(-1);
        stopAllModes();

        const out: Line[] = [{ type: "input", text: raw }];

        const push = (...texts: string[]) =>
            texts.forEach(text => out.push({ type: "output", text }));

        switch (cmd.split(" ")[0]) {

            case "help":
                push(
                    "┌─ Commands ──────────────────────────────────────────┐",
                    "│  whoami    experience   projects   contact   now     │",
                    "│  skills    hobbies      secret     fortune   history │",
                    "│  matrix    hack         snake      clock     weather │",
                    "│  joke      ascii <text> coffee     cat       banner  │",
                    "│  ping      sudo         rm         ls        pwd     │",
                    "│  date      uname        clear       exit             │",
                    "└─────────────────────────────────────────────────────┘"
                ); break;

            case "whoami":
                push("Uğurcan Yılmaz", "Software Engineer @ TÜBİTAK BİLGEM", "M.Sc. Computer Engineering @ Özyeğin University", "Based in İstanbul, Türkiye 🇹🇷", "Specializing in real-time signal processing & C++");
                break;

            case "skills":
                push(
                    "Languages  ██████████  C/C++      90%",
                    "           ████████░░  Python     75%",
                    "           ████████░░  MATLAB     80%",
                    "           ██████░░░░  JS/TS      65%",
                    "Frameworks ████████░░  Qt         85%",
                    "           ██████░░░░  Next.js    65%",
                    "Tools      ████████░░  Git        80%",
                    "           ██████░░░░  CMake      65%"
                ); break;

            case "experience":
                push(
                    "┌─ TÜBİTAK BİLGEM ──────────────────────────────┐",
                    "│  Software Engineer          Oct 2023 – Present │",
                    "│  Intern                     Jun 2023 – Aug 2023│",
                    "│  Integrated Sonar Systems Project              │",
                    "│  C++17 · Qt · MATLAB · Real-time DSP           │",
                    "└────────────────────────────────────────────────┘",
                    "┌─ Özyeğin University ───────────────────────────┐",
                    "│  M.Sc. Computer Engineering  2023 – Present    │",
                    "│  Deep Learning · Computer Vision               │",
                    "└────────────────────────────────────────────────┘"
                ); break;

            case "projects":
                push(
                    "1. Onboard Sonar System       [NDA] Qt · C++17 · MATLAB",
                    "2. FIR Band-Pass Filter             C",
                    "3. Digital Watermarking             Python",
                    "4. Healthcare Management System     PHP · MySQL",
                    "5. Event & Certificate System       PHP · MySQL",
                    "6. Regular Expression Engine        JavaScript",
                    "7. Histogram Analysis               C",
                    "", "Visit /projects for details"
                ); break;

            case "contact":
                push("Email   → devrugu@ugurcanyilmaz.com", "GitHub  → github.com/devrugu", "LinkedIn→ linkedin.com/in/kazuhira", "Web     → ugurcanyilmaz.com/contact");
                break;

            case "now":
                push("Currently working on:", "  → AUV with side-scan sonar + mine detection AI", "  → Deep Learning & Computer Vision (M.Sc.)", "  → This portfolio site", "", "Playing: The Last of Us Part II 🎮", "Watching: Invincible 📺");
                break;

            case "hobbies":
                push("🎸  Bağlama — Turkish folk music instrument", "🎮  Video games — story-driven, always", "🐭  Micromouse — autonomous maze-solving robots", "💻  Building side projects at 2am");
                break;

            case "secret":
                push("You found the easter egg! 🥚", "", "The Konami Code: ↑↑↓↓←→←→BA", "A classic since 1986. Good taste.", "", "Fun fact: this terminal runs entirely", "in the browser — no server involved.");
                break;

            case "fortune":
                push(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
                break;

            case "joke": {
                const [setup, punchline] = JOKES[Math.floor(Math.random() * JOKES.length)];
                push(setup);
                out.push({ type: "system", text: "" });
                setTimeout(() => addLines([{ type: "output", text: punchline }]), 800);
                break;
            }

            case "ascii": {
                const text = raw.slice(6).trim() || "hello";
                renderAscii(text).forEach(row => push(row));
                break;
            }

            case "banner":
                renderAscii("UGURCAN").forEach(row => push(row));
                push("", "Software Engineer · TÜBİTAK BİLGEM");
                break;

            case "coffee":
                push(
                    "      ( (", "      ) )",
                    "   ........", "   |      |]", "   \\      /",
                    "    `----'", "", "    ☕ Take a break, you deserve it."
                ); break;

            case "cat":
                push(
                    " /\\_____/\\", "(  o   o  )",
                    " =( Y )=", "   )   (", "  (_)-(_)", "", "  ^ Debugging companion"
                ); break;

            case "sudo":
                push("[sudo] password for ugurcan: ", "", "Sorry, user ugurcan is not in the sudoers file.", "This incident will be reported. 👮");
                break;

            case "rm":
                if (raw.includes("-rf") && raw.includes("/")) {
                    push("Deleting /bin ...", "Deleting /usr ...", "Deleting /home ...", "Deleting /etc ...", "Deleting everything...", "", "██████████ 100%", "", "...", "...just kidding 😅", "All files safe.");
                } else {
                    push(`rm: cannot remove '${raw.split(" ").slice(1).join(" ")}': No such file or directory`);
                }
                break;

            case "hack": {
                push("Initializing hack sequence...", "Bypassing firewall...", "");
                setLines(l => [...l, ...out]);
                setInput("");
                setHackActive(true);
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";
                let count = 0;
                hackRef.current = setInterval(() => {
                    const line = Array.from({ length: 60 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                    setLines(l => [...l, { type: "hack", text: line }]);
                    count++;
                    if (count > 30) {
                        clearInterval(hackRef.current!); hackRef.current = null;
                        setHackActive(false);
                        setLines(l => [...l,
                        { type: "system", text: "" },
                        { type: "output", text: "ACCESS GRANTED 🔓" },
                        { type: "output", text: "Just kidding. There's nothing to hack here 😄" },
                        ]);
                    }
                }, 80);
                return;
            }

            case "matrix": {
                push("Entering the Matrix...", "Press any key to exit.");
                setLines(l => [...l, ...out]);
                setInput("");
                setMatrixActive(true);
                const matChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";
                matrixRef.current = setInterval(() => {
                    const line = Array.from({ length: 60 }, () => matChars[Math.floor(Math.random() * matChars.length)]).join(" ");
                    setLines(l => [...l, { type: "matrix", text: line }]);
                }, 100);
                const stopMatrix = () => {
                    if (matrixRef.current) { clearInterval(matrixRef.current); matrixRef.current = null; }
                    setMatrixActive(false);
                    setLines(l => [...l, { type: "system", text: "Exited the Matrix." }]);
                    window.removeEventListener("keydown", stopMatrix);
                };
                setTimeout(() => window.addEventListener("keydown", stopMatrix), 300);
                return;
            }

            case "clock": {
                push("Live clock — type 'stop' to exit.");
                setLines(l => [...l, ...out]);
                setInput("");
                setClockActive(true);
                clockRef.current = setInterval(() => {
                    const now = new Date();
                    const h = now.getHours().toString().padStart(2, "0");
                    const m = now.getMinutes().toString().padStart(2, "0");
                    const s = now.getSeconds().toString().padStart(2, "0");
                    const [r0, r1] = renderAscii(`${h}:${m}:${s}`);
                    setLines(l => {
                        const filtered = l.filter(x => x.type !== "clock");
                        return [...filtered,
                        { type: "clock", text: r0 },
                        { type: "clock", text: r1 },
                        { type: "clock", text: now.toDateString() },
                        ];
                    });
                }, 1000);
                return;
            }

            case "stop":
                if (clockActive) {
                    if (clockRef.current) { clearInterval(clockRef.current); clockRef.current = null; }
                    setClockActive(false);
                    push("Clock stopped.");
                } else {
                    push("Nothing to stop.");
                }
                break;

            case "snake": {
                push("Snake! Use WASD to move, Q to quit.", "");
                const s = initSnake();
                snakeStateRef.current = s;
                setSnakeState(s);
                setLines(l => [...l, ...out]);
                setInput("");

                snakeRef.current = setInterval(() => {
                    if (!snakeStateRef.current) return;
                    // Auto move in current dir
                    const next = stepSnake(snakeStateRef.current, snakeStateRef.current.dir);
                    snakeStateRef.current = next;
                    setSnakeState({ ...next });

                    if (!next.alive) {
                        clearInterval(snakeRef.current!); snakeRef.current = null;
                        setSnakeState(null); snakeStateRef.current = null;
                        setLines(l => {
                            const filtered = l.filter(ln => ln.type !== "snake");
                            return [...filtered,
                            { type: "error", text: "Game over! 💀" },
                            { type: "output", text: `Final score: ${next.score}` },
                            ];
                        });
                        return;
                    }

                    const grid = renderSnake(next);
                    setLines(l => {
                        const filtered = l.filter(ln => ln.type !== "snake");
                        return [...filtered, ...grid.map(text => ({ type: "snake" as LineType, text }))];
                    });
                }, 200);

                // WASD handler
                const snakeKeyHandler = (e: KeyboardEvent) => {
                    if (!snakeStateRef.current || !snakeStateRef.current.alive) return;
                    const dirMap: Record<string, Dir> = { w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT", W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT" };
                    const dir = dirMap[e.key];
                    if (dir) {
                        e.preventDefault();
                        const next = stepSnake(snakeStateRef.current, dir);
                        snakeStateRef.current = next;
                    }
                    if (e.key === "q" || e.key === "Q") {
                        clearInterval(snakeRef.current!); snakeRef.current = null;
                        const score = snakeStateRef.current?.score ?? 0;
                        setSnakeState(null); snakeStateRef.current = null;
                        window.removeEventListener("keydown", snakeKeyHandler);
                        setLines(l => [...l.filter(ln => ln.type !== "snake"),
                        { type: "system", text: `Snake quit. Score: ${score}` }
                        ]);
                    }
                };
                window.addEventListener("keydown", snakeKeyHandler);
                return;
            }

            case "weather": {
                push("Fetching weather for İstanbul...");
                setLines(l => [...l, ...out]);
                setInput("");
                try {
                    const res = await fetch("https://wttr.in/Istanbul?format=j1");
                    const data = await res.json();
                    const cur = data.current_condition?.[0];
                    const desc = cur?.weatherDesc?.[0]?.value ?? "Unknown";
                    const temp = cur?.temp_C ?? "?";
                    const feels = cur?.FeelsLikeC ?? "?";
                    const humidity = cur?.humidity ?? "?";
                    const wind = cur?.windspeedKmph ?? "?";
                    addLines([
                        { type: "output", text: "📍 İstanbul, Türkiye" },
                        { type: "output", text: `🌤  ${desc}` },
                        { type: "output", text: `🌡  ${temp}°C (feels like ${feels}°C)` },
                        { type: "output", text: `💧  Humidity: ${humidity}%` },
                        { type: "output", text: `💨  Wind: ${wind} km/h` },
                    ]);
                } catch {
                    addLines([{ type: "error", text: "Failed to fetch weather. Check your connection." }]);
                }
                return;
            }

            case "ping": {
                const target = raw.split(" ")[1] || "ugurcanyilmaz.com";
                push(`PING ${target}:`);
                setLines(l => [...l, ...out]);
                setInput("");
                let i = 0;
                const pingInterval = setInterval(() => {
                    const ms = Math.floor(Math.random() * 60 + 5);
                    addLines([{ type: "output", text: `64 bytes from ${target}: icmp_seq=${i + 1} ttl=64 time=${ms}ms` }]);
                    i++;
                    if (i >= 4) {
                        clearInterval(pingInterval);
                        addLines([
                            { type: "system", text: "" },
                            { type: "output", text: `--- ${target} ping statistics ---` },
                            { type: "output", text: `4 packets transmitted, 4 received, 0% packet loss` },
                        ]);
                    }
                }, 600);
                return;
            }

            case "history":
                cmdHistory.forEach((c, i) => push(`  ${cmdHistory.length - i}  ${c}`));
                break;

            case "ls":
                push("about/  blog/  contact/  now/  projects/  resume/");
                break;

            case "pwd":
                push("/home/ugurcanyilmaz");
                break;

            case "date":
                push(new Date().toString());
                break;

            case "uname":
                push("ugurcanyilmaz.com  Next.js 14  Vercel  Istanbul/Turkey");
                break;

            case "clear":
                setLines(BOOT_LINES);
                setInput("");
                return;

            case "exit":
                out.push({ type: "system", text: "Goodbye! 👋" });
                setLines(l => [...l, ...out]);
                setInput("");
                setTimeout(() => setOpen(false), 800);
                return;

            default:
                out.push({ type: "error", text: `command not found: ${cmd}. Type 'help' for available commands.` });
        }

        setLines(l => [...l, ...out]);
        setInput("");
    }, [cmdHistory, clockActive, stopAllModes, addLines]);

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") { runCommand(input); return; }
        if (e.key === "Escape") { setOpen(false); return; }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
            setHistIdx(idx); setInput(cmdHistory[idx] ?? "");
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const idx = Math.max(histIdx - 1, -1);
            setHistIdx(idx); setInput(idx === -1 ? "" : cmdHistory[idx] ?? "");
        }
    }

    function getLineColor(type: LineType): string {
        if (type === "input") return "text-accent";
        if (type === "error") return "text-red-400";
        if (type === "system") return "text-gray-500";
        if (type === "matrix") return "text-green-400";
        if (type === "hack") return "text-green-300 opacity-80";
        if (type === "clock") return "text-accent";
        if (type === "snake") return "text-green-300 font-mono";
        return "text-green-300";
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                        onClick={() => setOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-6"
                    >
                        <div className="w-full max-w-5xl bg-gray-950 border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
                            {/* Title bar */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700/50">
                                <button onClick={() => setOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-3 text-xs text-gray-500">ugurcan@portfolio ~ </span>
                                {matrixActive && <span className="ml-auto text-xs text-green-400 animate-pulse">MATRIX MODE</span>}
                                {hackActive && <span className="ml-auto text-xs text-green-300 animate-pulse">HACKING...</span>}
                                {clockActive && <span className="ml-auto text-xs text-accent animate-pulse">CLOCK</span>}
                                {snakeState && <span className="ml-auto text-xs text-green-300 animate-pulse">SNAKE 🐍</span>}
                            </div>

                            {/* Output */}
                            <div
                                className="h-[75vh] overflow-y-auto px-4 py-3 space-y-0.5"
                                onClick={() => inputRef.current?.focus()}
                            >
                                {lines.map((line, i) => (
                                    <div key={i} className={`leading-relaxed ${getLineColor(line.type)}`}>
                                        {line.type === "input" && <span className="text-gray-600 mr-2">❯</span>}
                                        <span className="whitespace-pre">{line.text || "\u00a0"}</span>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-700/50 bg-gray-900/50">
                                <span className="text-accent flex-shrink-0">❯</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    className="flex-1 bg-transparent text-accent placeholder-gray-600 focus:outline-none caret-accent"
                                    placeholder={snakeState ? "WASD to move, Q to quit" : clockActive ? "type 'stop' to exit" : "type a command…"}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}