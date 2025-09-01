"use client";

import { useState, useMemo, useEffect } from 'react';
import { RegexEngine } from '@/lib/regex-engine';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightedText from '@/components/HighlightedText';

// Define a type for our match results for better code safety
type Match = {
  match: string;
  index: number;
};

export default function RegexEnginePage() {
  // --- STATE MANAGEMENT ---
  // Inputs from the user
  const [pattern, setPattern] = useState<string>("(a|b)*a");
  const [testString, setTestString] = useState<string>("a very blue boat and a big baboon");
  
  // Settings for the demo
  const [isRealtime, setIsRealtime] = useState<boolean>(true);
  
  // Outputs from the engine
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- DEBOUNCING ---
  // Debounce the inputs for a smoother real-time experience
  const [debouncedPattern] = useDebounce(pattern, 300);
  const [debouncedTestString] = useDebounce(testString, 300);

  // --- ENGINE INSTANTIATION ---
  // useMemo ensures we only create a new engine instance when necessary, not on every render
  const regexEngine = useMemo(() => new RegexEngine(), []);

  // --- CORE LOGIC ---
  // A single function to compile the pattern and run the search
  const runSearch = () => {
    // Prevent running on empty inputs, which can be slow
    if (!pattern || !testString) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      setError(null);
      // 1. Compile the pattern
      regexEngine.compile(pattern);
      // 2. Run the search
      const foundMatches = regexEngine.search(testString);
      // 3. Update the state with the results
      setMatches(foundMatches);
    } catch (e: any) {
      // Catch errors from invalid regex patterns
      setError("Invalid Regex Pattern");
      setMatches([]);
    }
  };
  
  // --- REAL-TIME EXECUTION ---
  // A useEffect hook that triggers the search when debounced inputs change in real-time mode
  useEffect(() => {
    if (isRealtime) {
      runSearch();
    }
  }, [debouncedPattern, debouncedTestString, isRealtime]); // Dependencies for the effect

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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Inputs and Controls */}
        <div className="space-y-6">
          <div>
            <label htmlFor="pattern" className="block text-on-background font-semibold mb-2">
              Regular Expression Pattern
            </label>
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
            <label htmlFor="testString" className="block text-on-background font-semibold mb-2">
              Test String
            </label>
            <textarea
              id="testString"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter the text to search within..."
              rows={15}
              className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="realtime-toggle"
                checked={isRealtime}
                onChange={(e) => setIsRealtime(e.target.checked)}
                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent"
              />
              <label htmlFor="realtime-toggle" className="text-on-background">
                Real-time Execution
              </label>
            </div>
            
            {/* Animated "Run Search" Button */}
            <AnimatePresence>
              {!isRealtime && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={runSearch}
                    className="bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors"
                  >
                    Run Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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