// Simple regex engine adapted from original project

interface NFAState {
  id: number;
  bitisMi: boolean;
  baglanti: Record<string, NFAState>;
  bosBaglanti: NFAState[];
}

export interface NFA {
  baslangic: NFAState;
  bitis: NFAState;
}

interface DFAState {
  key: string;
  nfaStates: NFAState[];
  kabul: boolean;
  baglanti: Record<string, DFAState>;
}

export interface DFA {
  baslangic: DFAState;
  dfaStates: Record<string, DFAState>;
}

let stateCounter = 0;
function resetStateCounter() {
  stateCounter = 0;
}

function stateOlustur(bitisMi: boolean): NFAState {
  return { id: stateCounter++, bitisMi, baglanti: {}, bosBaglanti: [] };
}

function bosBaglantiEkle(nereden: NFAState, nereye: NFAState) {
  nereden.bosBaglanti.push(nereye);
}

function baglantiEkle(nereden: NFAState, nereye: NFAState, sembol: string) {
  nereden.baglanti[sembol] = nereye;
}

export function concatOperatoruEkle(regex: string): string {
  let output = "";
  for (let i = 0; i < regex.length; i++) {
    const token = regex[i];
    output += token;
    if (token === "(" || token === "|" ) continue;
    if (i < regex.length - 1) {
      const sonraki = regex[i + 1];
      if (sonraki === "*" || sonraki === "+" || sonraki === "|" || sonraki === ")") continue;
      output += ".";
    }
  }
  return output;
}

const operatorOnceligi: Record<string, number> = { "|":1, ".":2, "+":3, "*":3 };

function bak<T>(stack: T[]): T | undefined {
  return stack.length ? stack[stack.length-1] : undefined;
}

export function postfixDonusumu(regex: string): string {
  let output = "";
  const operatorStack: string[] = [];
  for (const token of regex) {
    if (token === "." || token === "|" || token === "*" || token === "+") {
      while (operatorStack.length && bak(operatorStack) !== "(" && operatorOnceligi[bak(operatorStack)!] >= operatorOnceligi[token]) {
        output += operatorStack.pop();
      }
      operatorStack.push(token);
    } else if (token === "(" || token === ")") {
      if (token === "(") {
        operatorStack.push(token);
      } else {
        while (bak(operatorStack) !== "(") {
          output += operatorStack.pop();
        }
        operatorStack.pop();
      }
    } else {
      output += token;
    }
  }
  while (operatorStack.length) output += operatorStack.pop();
  return output;
}

function bosNFA(): NFA {
  const baslangic = stateOlustur(false);
  const bitis = stateOlustur(true);
  bosBaglantiEkle(baslangic, bitis);
  return { baslangic, bitis };
}

function sembolNFA(sembol: string): NFA {
  const baslangic = stateOlustur(false);
  const bitis = stateOlustur(true);
  baglantiEkle(baslangic, bitis, sembol);
  return { baslangic, bitis };
}

function concatNFA(birinci: NFA, ikinci: NFA): NFA {
  bosBaglantiEkle(birinci.bitis, ikinci.baslangic);
  birinci.bitis.bitisMi = false;
  return { baslangic: birinci.baslangic, bitis: ikinci.bitis };
}

function unionNFA(birinci: NFA, ikinci: NFA): NFA {
  const baslangic = stateOlustur(false);
  bosBaglantiEkle(baslangic, birinci.baslangic);
  bosBaglantiEkle(baslangic, ikinci.baslangic);
  const bitis = stateOlustur(true);
  bosBaglantiEkle(birinci.bitis, bitis);
  birinci.bitis.bitisMi = false;
  bosBaglantiEkle(ikinci.bitis, bitis);
  ikinci.bitis.bitisMi = false;
  return { baslangic, bitis };
}

function yildizNFA(nfa: NFA): NFA {
  const baslangic = stateOlustur(false);
  const bitis = stateOlustur(true);
  bosBaglantiEkle(baslangic, bitis);
  bosBaglantiEkle(baslangic, nfa.baslangic);
  bosBaglantiEkle(nfa.bitis, bitis);
  bosBaglantiEkle(nfa.bitis, nfa.baslangic);
  nfa.bitis.bitisMi = false;
  return { baslangic, bitis };
}

function artiNFA(nfa: NFA): NFA {
  const baslangic = stateOlustur(false);
  const bitis = stateOlustur(true);
  bosBaglantiEkle(baslangic, nfa.baslangic);
  bosBaglantiEkle(nfa.bitis, bitis);
  bosBaglantiEkle(nfa.bitis, nfa.baslangic);
  nfa.bitis.bitisMi = false;
  return { baslangic, bitis };
}

function epsilonKapanisi(states: NFAState[]): NFAState[] {
  const stack = [...states];
  const closure = new Set<NFAState>(stack);
  while (stack.length) {
    const state = stack.pop()!;
    for (const st of state.bosBaglanti) {
      if (!closure.has(st)) {
        closure.add(st);
        stack.push(st);
      }
    }
  }
  return Array.from(closure);
}

function move(states: NFAState[], symbol: string): NFAState[] {
  const result = new Set<NFAState>();
  for (const state of states) {
    const nxt = state.baglanti[symbol];
    if (nxt) result.add(nxt);
  }
  return Array.from(result);
}

export function NFAToDFA(nfa: NFA): DFA {
  const stateId = new Map<NFAState, number>();
  let id = 0;
  const getId = (st: NFAState) => {
    if (!stateId.has(st)) stateId.set(st, id++);
    return stateId.get(st)!;
  };
  const keyOf = (states: NFAState[]) => states.map(getId).sort((a,b) => a-b).join(',');
  const startClosure = epsilonKapanisi([nfa.baslangic]);
  const dfaStates: Record<string, DFAState> = {};
  const queue: DFAState[] = [];
  const createState = (nfaStates: NFAState[]): DFAState => {
    const key = keyOf(nfaStates);
    if (dfaStates[key]) return dfaStates[key];
    const dfaState: DFAState = { key, nfaStates, kabul: nfaStates.some(s=>s.bitisMi), baglanti: {} };
    dfaStates[key] = dfaState;
    queue.push(dfaState);
    return dfaState;
  };
  const baslangic = createState(startClosure);
  while (queue.length) {
    const current = queue.shift()!;
    const symbols = new Set<string>();
    for (const st of current.nfaStates) {
      for (const sym in st.baglanti) symbols.add(sym);
    }
    for (const sym of symbols) {
      const nextStates = epsilonKapanisi(move(current.nfaStates, sym));
      const next = createState(nextStates);
      current.baglanti[sym] = next;
    }
  }
  return { baslangic, dfaStates };
}

export function NFADonusumu(postfixRegex: string): NFA {
  if (postfixRegex === "") return bosNFA();
  const stack: NFA[] = [];
  for (const token of postfixRegex) {
    if (token === "*") stack.push(yildizNFA(stack.pop()!));
    else if (token === "+") stack.push(artiNFA(stack.pop()!));
    else if (token === "|") { const r = stack.pop()!, l = stack.pop()!; stack.push(unionNFA(l,r)); }
    else if (token === ".") { const r = stack.pop()!, l = stack.pop()!; stack.push(concatNFA(l,r)); }
    else stack.push(sembolNFA(token));
  }
  return stack.pop()!;
}

function sonrakiDurumuEkle(state: NFAState, sonraki: NFAState[], gidilmis: NFAState[]) {
  if (state.bosBaglanti.length) {
    for (const st of state.bosBaglanti) {
      if (!gidilmis.includes(st)) {
        gidilmis.push(st);
        sonrakiDurumuEkle(st, sonraki, gidilmis);
      }
    }
  } else {
    sonraki.push(state);
  }
}

export function searchNFA(nfa: NFA, kelime: string): Array<{start:number,end:number}> {
  const results: Array<{start:number,end:number}> = [];
  for (let i=0; i<kelime.length; i++) {
    let simdiki: NFAState[] = [];
    sonrakiDurumuEkle(nfa.baslangic, simdiki, []);
    for (let j=i; j<kelime.length; j++) {
      const ch = kelime[j];
      const sonraki: NFAState[] = [];
      for (const state of simdiki) {
        const next = state.baglanti[ch];
        if (next) {
          sonrakiDurumuEkle(next, sonraki, []);
        }
      }
      if (sonraki.length === 0) break;
      if (sonraki.some(s=>s.bitisMi)) results.push({start:i,end:j+1});
      simdiki = sonraki;
    }
  }
  return results;
}

export function searchDFA(dfa: DFA, kelime: string): Array<{start:number,end:number}> {
  const results: Array<{start:number,end:number}> = [];
  for (let i=0; i<kelime.length; i++) {
    let current: DFAState | undefined = dfa.baslangic;
    for (let j=i; j<kelime.length && current; j++) {
      current = current.baglanti[kelime[j]];
      if (!current) break;
      if (current.kabul) results.push({start:i,end:j+1});
    }
  }
  return results;
}

export function buildNFAFromRegex(regex: string): NFA {
  resetStateCounter();
  const withConcat = concatOperatoruEkle(regex);
  const postfix = postfixDonusumu(withConcat);
  return NFADonusumu(postfix);
}
