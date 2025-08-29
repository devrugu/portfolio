import { NFA, DFA } from './regexEngine';

interface Node { id: string; position: {x:number;y:number}; data:{label:string}; style?: any; }
interface Edge { id:string; source:string; target:string; label?:string; }

export type Graph = { nodes: Node[]; edges: Edge[] };

export function nfaToGraph(nfa: NFA): Graph {
  const visited = new Set<number>();
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const queue: Array<{state: any; level: number}> = [{ state: nfa.baslangic, level:0 }];
  const levelMap: Record<number, number> = {};
  while (queue.length) {
    const {state, level} = queue.shift()!;
    if (visited.has(state.id)) continue;
    visited.add(state.id);
    const yIndex = levelMap[level] || 0;
    levelMap[level] = yIndex + 1;
    nodes.push({ id: String(state.id), position: { x: level*200, y: yIndex*100 }, data: { label: String(state.id) }, style: state.bitisMi? { border: '3px double black' } : undefined });
    for (const sym in state.baglanti) {
      const target = state.baglanti[sym];
      edges.push({ id: `${state.id}-${sym}-${target.id}`, source: String(state.id), target: String(target.id), label: sym });
      queue.push({ state: target, level: level+1 });
    }
    for (const eps of state.bosBaglanti) {
      queue.push({ state: eps, level: level+1 });
    }
  }
  return { nodes, edges };
}

export function dfaToGraph(dfa: DFA): Graph {
  const visited = new Set<string>();
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const queue: Array<{state: any; level:number}> = [{ state: dfa.baslangic, level:0 }];
  const levelMap: Record<number, number> = {};
  while (queue.length) {
    const {state, level} = queue.shift()!;
    if (visited.has(state.key)) continue;
    visited.add(state.key);
    const yIndex = levelMap[level] || 0;
    levelMap[level] = yIndex + 1;
    nodes.push({ id: state.key, position:{x: level*200, y: yIndex*100}, data:{label: state.key}, style: state.kabul? { border: '3px double black' } : undefined });
    for (const sym in state.baglanti) {
      const target = state.baglanti[sym];
      edges.push({ id: `${state.key}-${sym}-${target.key}`, source: state.key, target: target.key, label: sym });
      queue.push({ state: target, level: level+1 });
    }
  }
  return { nodes, edges };
}
