"use client";

import { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

export default function RegexEngineDemo() {
  const [regex, setRegex] = useState('(a*ba)|(bb)');
  const [text, setText] = useState('aba bba bb');
  
  // State for our graphs
  const [nfaNodes, setNfaNodes] = useState([]);
  const [nfaEdges, setNfaEdges] = useState([]);
  const [dfaNodes, setDfaNodes] = useState([]);
  const [dfaEdges, setDfaEdges] = useState([]);

  // State to control UI visibility
  const [nfaCreated, setNfaCreated] = useState(false);
  const [dfaCreated, setDfaCreated] = useState(false);
  
  // State for the highlighted text output
  const [highlightedText, setHighlightedText] = useState<React.ReactNode>(null);

  const handleCreateNFA = () => {
    console.log("Creating NFA for:", regex);
    // TODO: Call our adapted regex logic here to get NFA data
    // TODO: Convert NFA data to React Flow nodes/edges
    setNfaCreated(true);
  };
  
  const handleConvertToDFA = () => {
    console.log("Converting to DFA");
    // TODO: Call our adapted logic to convert NFA to DFA
    // TODO: Convert DFA data to React Flow nodes/edges
    setDfaCreated(true);
  };

  const handleUseNFA = () => {
    console.log("Simulating NFA on:", text);
    // TODO: Animate NFA traversal and highlight text
  };

  const handleUseDFA = () => {
    console.log("Simulating DFA on:", text);
    // TODO: Animate DFA traversal and highlight text
  };

  return (
    <div className="space-y-8">
      {/* --- Input Section --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="regex-input" className="block text-on-background mb-2 font-semibold">Regex Pattern</label>
          <input
            id="regex-input"
            type="text"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter Regex..."
          />
        </div>
        <div>
          <label htmlFor="text-input" className="block text-on-background mb-2 font-semibold">Test String</label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter text here..."
          />
        </div>
      </section>

      {/* --- Control Buttons --- */}
      <section className="flex flex-wrap items-center gap-4">
        <button onClick={handleCreateNFA} className="bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors">
          1. Create NFA
        </button>
        {nfaCreated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-4">
            <button onClick={handleUseNFA} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Use NFA
            </button>
            <button onClick={handleConvertToDFA} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              2. Convert to DFA
            </button>
          </motion.div>
        )}
        {dfaCreated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={handleUseDFA} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Use DFA
            </button>
          </motion.div>
        )}
      </section>

      {/* --- Output Section --- */}
      <section className="space-y-8">
        {nfaCreated && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Nondeterministic Finite Automaton (NFA)</h2>
            <div className="w-full h-[400px] bg-gray-900/50 rounded-lg border border-gray-700">
              <ReactFlow nodes={nfaNodes} edges={nfaEdges} fitView>
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              </ReactFlow>
            </div>
          </div>
        )}
        {dfaCreated && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Deterministic Finite Automaton (DFA)</h2>
            <div className="w-full h-[400px] bg-gray-900/50 rounded-lg border border-gray-700">
              <ReactFlow nodes={dfaNodes} edges={dfaEdges} fitView>
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              </ReactFlow>
            </div>
          </div>
        )}
        {highlightedText && (
           <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Matched Text</h2>
              <div className="bg-gray-800 p-4 rounded-lg text-lg font-mono whitespace-pre-wrap">{highlightedText}</div>
           </div>
        )}
      </section>
    </div>
  );
}