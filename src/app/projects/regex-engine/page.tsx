'use client';
import { useState } from 'react';
import AutomatonGraph from '@/components/AutomatonGraph';
import { buildNFAFromRegex, NFAToDFA, searchNFA, searchDFA, NFA, DFA } from '@/lib/regexEngine';
import { nfaToGraph, dfaToGraph, Graph } from '@/lib/graphUtils';

export default function RegexEngineDemo() {
  const [pattern, setPattern] = useState('');
  const [text, setText] = useState('');
  const [nfa, setNfa] = useState<NFA | null>(null);
  const [dfa, setDfa] = useState<DFA | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [matches, setMatches] = useState<Array<{start:number,end:number}>>([]);

  const handleCreateNFA = () => {
    try {
      const nfa = buildNFAFromRegex(pattern);
      setNfa(nfa);
      setGraph(nfaToGraph(nfa));
      setDfa(null);
      setMatches([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvert = () => {
    if (!nfa) return;
    const dfa = NFAToDFA(nfa);
    setDfa(dfa);
    setGraph(dfaToGraph(dfa));
    setMatches([]);
  };

  const handleUseNFA = () => {
    if (!nfa) return;
    const res = searchNFA(nfa, text);
    setMatches(res);
  };

  const handleUseDFA = () => {
    if (!dfa) return;
    const res = searchDFA(dfa, text);
    setMatches(res);
  };

  const highlighted = () => {
    if (!matches.length) return text;
    const parts = [] as any[];
    let last = 0;
    const sorted = [...matches].sort((a,b)=>a.start-b.start);
    for (const m of sorted) {
      if (m.start > last) parts.push(text.slice(last, m.start));
      parts.push(<mark key={m.start+"-"+m.end} className="bg-yellow-300 text-black">{text.slice(m.start, m.end)}</mark>);
      last = m.end;
    }
    parts.push(text.slice(last));
    return parts;
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Regular Expression Engine Demo</h1>
      <div className="flex flex-col gap-2 max-w-xl">
        <input className="border p-2" placeholder="Regex" value={pattern} onChange={e=>setPattern(e.target.value)} />
        <textarea className="border p-2" placeholder="Text" value={text} onChange={e=>setText(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreateNFA}>Create NFA</button>
        {nfa && (
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-4 py-2" onClick={handleUseNFA}>Use NFA</button>
            <button className="bg-purple-500 text-white px-4 py-2" onClick={handleConvert}>Convert NFA to DFA</button>
          </div>
        )}
        {dfa && (
          <button className="bg-green-700 text-white px-4 py-2" onClick={handleUseDFA}>Use DFA</button>
        )}
      </div>
      {graph && <AutomatonGraph graph={graph} />}
      <div className="p-2 border min-h-[2rem]">{highlighted()}</div>
    </div>
  );
}
