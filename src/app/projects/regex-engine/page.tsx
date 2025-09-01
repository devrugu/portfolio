"use client";

import { useState, useMemo, useEffect } from 'react';
import { RegexEngine } from '@/lib/regex-engine';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightedText from '@/components/HighlightedText';

type Match = {
  match: string;
  index: number;
};

export default function RegexEnginePage() {
  // --- STATE MANAGEMENT ---
  const [pattern, setPattern] = useState<string>("a");
  const [testString, setTestString] = useState<string>("a ababab baba a baba");
  const [isRealtime, setIsRealtime] = useState<boolean>(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Updated state for flags
  const [flags, setFlags] = useState({
    caseInsensitive: false,
    wholeWord: true, // Let's make this the default for your example
  });

  // --- DEBOUNCING ---
  const [debouncedPattern] = useDebounce(pattern, 300);
  const [debouncedTestString] = useDebounce(testString, 300);
  const [debouncedFlags] = useDebounce(flags, 300);

  const regexEngine = useMemo(() => new RegexEngine(), []);

  // --- CORE LOGIC ---
  const runSearch = () => {
    if (!pattern || !testString) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      setError(null);
      // Pass both flags to the engine
      regexEngine.compile(pattern, { 
        caseInsensitive: flags.caseInsensitive, 
        wholeWord: flags.wholeWord 
      });
      const foundMatches = regexEngine.search(testString, { 
        wholeWord: flags.wholeWord 
      });
      setMatches(foundMatches);
    } catch (e: any) {
      setError("Invalid Regex Pattern");
      setMatches([]);
    }
  };
  
  useEffect(() => {
    if (isRealtime) {
      runSearch();
    }
  }, [debouncedPattern, debouncedTestString, debouncedFlags, isRealtime]);

  // --- EVENT HANDLERS ---
  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFlags(prevFlags => ({
      ...prevFlags,
      [name]: checked,
    }));
  };

  // --- UI RENDER ---
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Live Regex Engine Demo</h1>
        <p className="text-on-background mt-2">
          A from-scratch Regular Expression Engine implemented with Thompson's Construction (NFA) and Subset Construction (DFA), running directly in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs and Controls */}
        <div className="space-y-6">
          <div>
            <label htmlFor="pattern" className="block text-on-background font-semibold mb-2">Regular Expression Pattern</label>
            <input
              id="pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter your regex pattern..."
              className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="testString" className="block text-on-background font-semibold mb-2">Test String</label>
            <textarea
              id="testString"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter the text to search within..."
              rows={15}
              className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Flags and Controls Section */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between">
              {/* Flag Checkboxes */}
              <div className="flex items-center gap-6">
                <span className="font-semibold text-primary">Options:</span>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="whole-word-flag" name="wholeWord" checked={flags.wholeWord} onChange={handleFlagChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent" />
                  <label htmlFor="whole-word-flag" className="text-on-background">Match Whole Word</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="case-insensitive-flag" name="caseInsensitive" checked={flags.caseInsensitive} onChange={handleFlagChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent" />
                  <label htmlFor="case-insensitive-flag" className="text-on-background">Case-Insensitive</label>
                </div>
              </div>
              
              {/* Real-time Toggle */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="realtime-toggle" checked={isRealtime} onChange={(e) => setIsRealtime(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent" />
                <label htmlFor="realtime-toggle" className="text-on-background">Real-time</label>
              </div>
            </div>
          </div>
          
          {/* Animated "Run Search" Button */}
          <AnimatePresence>
            {!isRealtime && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-end">
                <button onClick={runSearch} className="bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors">Run Search</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Results */}
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-2">Results</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="w-full h-[400px] p-4 font-mono text-sm bg-gray-800 border border-gray-700 rounded-lg overflow-auto">
            <HighlightedText text={testString} matches={matches} />
          </div>
        </div>
      </div>
    </div>
  );
}