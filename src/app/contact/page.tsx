"use client";

import { useState, useRef, useEffect } from "react";

type Step = "idle" | "form" | "otp" | "revealed";

const COUNTRIES = [
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷", maxLen: 10 },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸", maxLen: 10 },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", maxLen: 10 },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪", maxLen: 11 },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷", maxLen: 9 },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱", maxLen: 9 },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪", maxLen: 9 },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭", maxLen: 9 },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹", maxLen: 10 },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪", maxLen: 9 },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴", maxLen: 8 },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰", maxLen: 8 },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮", maxLen: 9 },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱", maxLen: 9 },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸", maxLen: 9 },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹", maxLen: 10 },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹", maxLen: 9 },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷", maxLen: 10 },
  { code: "RO", name: "Romania", dial: "+40", flag: "🇷🇴", maxLen: 9 },
  { code: "AZ", name: "Azerbaijan", dial: "+994", flag: "🇦🇿", maxLen: 9 },
  { code: "KZ", name: "Kazakhstan", dial: "+7", flag: "🇰🇿", maxLen: 10 },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺", maxLen: 10 },
  { code: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦", maxLen: 9 },
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪", maxLen: 9 },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦", maxLen: 9 },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱", maxLen: 9 },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳", maxLen: 10 },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳", maxLen: 11 },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵", maxLen: 10 },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷", maxLen: 10 },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", maxLen: 9 },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", maxLen: 10 },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷", maxLen: 11 },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽", maxLen: 10 },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", maxLen: 9 },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", maxLen: 10 },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬", maxLen: 10 },
];

function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e164: string) => void;
}) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [localNumber, setLocalNumber] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Only allow digits
    const digits = e.target.value.replace(/\D/g, "").slice(0, selectedCountry.maxLen);
    setLocalNumber(digits);
    onChange(`${selectedCountry.dial}${digits}`);
  }

  function handleCountrySelect(country: typeof COUNTRIES[0]) {
    setSelectedCountry(country);
    setLocalNumber("");
    onChange(`${country.dial}`);
    setDropdownOpen(false);
    setSearch("");
  }

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  return (
    <div className="flex w-full gap-0 relative" ref={dropdownRef}>
      {/* Country selector */}
      <button
        type="button"
        onClick={() => setDropdownOpen(o => !o)}
        className="flex items-center gap-2 bg-gray-800/60 border border-gray-700 border-r-0 rounded-l-lg px-3 py-3 hover:bg-gray-700/60 transition-colors focus:outline-none focus:border-accent min-w-[110px]"
      >
        <span className="text-lg leading-none">{selectedCountry.flag}</span>
        <span className="text-sm text-primary font-mono">{selectedCountry.dial}</span>
        <svg className={`w-3 h-3 text-gray-400 ml-auto transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search country…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>
          {/* List */}
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">No results</li>
            )}
            {filtered.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors text-left ${selectedCountry.code === c.code ? "bg-gray-800 text-accent" : "text-on-background"}`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="font-mono text-gray-400 text-xs">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Number input */}
      <input
        type="text"
        inputMode="numeric"
        placeholder={`${"X".repeat(selectedCountry.maxLen)}`}
        value={localNumber}
        onChange={handleNumberChange}
        className="flex-1 bg-gray-800/60 border border-gray-700 rounded-r-lg px-4 py-3 text-primary placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm font-mono"
        required
      />
    </div>
  );
}

export default function ContactPage() {
  const [step, setStep] = useState<Step>("idle");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+90");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    // Must have digits after the dial code
    // phone is full E.164 e.g. "+905454811063" — must have at least 8 digits total after the +
    const totalDigits = phone.replace(/\D/g, "");
    if (totalDigits.length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/phone-verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code.");
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/phone-verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      setStep("revealed");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // OTP input: digits only, auto-submit at 6 digits
  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
  }

  const inputCls =
    "w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 " +
    "text-primary placeholder-gray-500 focus:outline-none focus:border-accent " +
    "transition-colors text-sm";

  const btnCls =
    "w-full bg-accent text-on-primary font-semibold py-3 rounded-lg " +
    "hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm";

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">Get In Touch</h1>
      <p className="text-lg text-on-background mb-10 max-w-2xl">
        I'm actively seeking new opportunities and am open to discussing projects,
        collaborations, or roles where I can contribute my skills in software engineering
        and real-time systems. Please feel free to reach out.
      </p>

      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a href="mailto:devrugu@ugurcanyilmaz.com" className="text-xl text-primary hover:text-accent hover:underline transition-colors">
            devrugu@ugurcanyilmaz.com
          </a>
        </div>

        {/* Phone (gated) */}
        <div className="flex items-start space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>

          <div className="flex-1">
            {/* Idle */}
            {step === "idle" && (
              <div className="flex items-center gap-4">
                <span className="text-xl text-gray-500 tracking-widest select-none">+90 ••• ••• •• ••</span>
                <button onClick={() => setStep("form")} className="text-sm text-accent border border-accent/40 rounded-lg px-4 py-1.5 hover:bg-accent/10 transition-colors">
                  Reveal number
                </button>
              </div>
            )}

            {/* Form */}
            {step === "form" && (
              <form onSubmit={handleSendOtp} className="space-y-3 max-w-sm">
                <p className="text-sm text-on-background mb-1">
                  Enter your details — a verification code will be sent to your phone.
                </p>
                <div className="flex gap-2">
                  <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} required />
                  <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} required />
                </div>
                <PhoneInput value={phone} onChange={setPhone} />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className={btnCls}>
                  {loading ? "Sending…" : "Send verification code"}
                </button>
              </form>
            )}

            {/* OTP */}
            {step === "otp" && (
              <form onSubmit={handleVerify} className="space-y-3 max-w-sm">
                <p className="text-sm text-on-background mb-1">
                  A 6-digit code was sent to <span className="text-accent font-mono">{phone}</span>. Enter it below.
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="• • • • • •"
                  value={code}
                  onChange={handleCodeChange}
                  maxLength={6}
                  className={`${inputCls} tracking-[0.5em] text-center text-lg font-mono`}
                  required
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className={btnCls}>
                  {loading ? "Verifying…" : "Verify & reveal number"}
                </button>
                <button type="button" onClick={() => { setStep("form"); setError(""); setCode(""); }} className="text-xs text-gray-500 hover:text-on-background transition-colors">
                  ← Change phone number
                </button>
              </form>
            )}

            {/* Revealed */}
            {step === "revealed" && (
              <span className="text-xl text-primary font-medium tracking-wide">+90 545 481 10 63</span>
            )}
          </div>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <a href="https://tr.linkedin.com/in/kazuhira" target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent hover:underline transition-colors">
            LinkedIn Profile
          </a>
        </div>

        {/* GitHub */}
        <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <a href="https://github.com/devrugu" target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent hover:underline transition-colors">
            GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
}