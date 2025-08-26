// src/lib/regex-engine.ts

// --- Core Data Structures ---

export interface NfaState {
  id: number;
  isEnd: boolean;
  transitions: Map<string, NfaState[]>;
  epsilonTransitions: NfaState[];
}

export interface NFA {
  start: NfaState;
  end: NfaState;
}

export interface DfaState {
    id: number;
    nfaStates: Set<NfaState>;
    isAccepting: boolean;
    transitions: Map<string, DfaState>;
}

// --- Global state for unique ID generation ---
let stateIdCounter = 0;
export const resetStateIdCounter = () => { stateIdCounter = 0; };
const createNfaState = (isEnd: boolean): NfaState => ({
    id: stateIdCounter++,
    isEnd,
    transitions: new Map(),
    epsilonTransitions: [],
});

// --- Regex to Postfix Conversion (Shunting-Yard) ---

const operatorPrecedence = { "|": 0, ".": 1, "*": 2, "+": 2 };

export function addConcatOperators(regex: string): string {
  let output = "";
  for (let i = 0; i < regex.length; i++) {
    const token = regex[i];
    output += token;
    if (token === "(" || token === "|") continue;
    if (i < regex.length - 1) {
      const next = regex[i + 1];
      if (next === "*" || next === "+" || next === "|" || next === ")") continue;
      output += ".";
    }
  }
  return output;
}

export function toPostfix(regex: string): string {
  let output = "";
  const operatorStack: string[] = [];
  for (const token of regex) {
    if (token === "." || token === "|" || token === "*" || token === "+") {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        operatorPrecedence[operatorStack[operatorStack.length - 1] as keyof typeof operatorPrecedence] >= operatorPrecedence[token as keyof typeof operatorPrecedence]
      ) {
        output += operatorStack.pop();
      }
      operatorStack.push(token);
    } else if (token === "(" || token === ")") {
      if (token === "(") {
        operatorStack.push(token);
      } else {
        while (operatorStack[operatorStack.length - 1] !== "(") {
          output += operatorStack.pop();
        }
        operatorStack.pop();
      }
    } else {
      output += token;
    }
  }
  while (operatorStack.length) {
    output += operatorStack.pop();
  }
  return output;
}

// --- Postfix to NFA Conversion (Thompson's Construction) ---

export function postfixToNfa(postfix: string): NFA {
  if (postfix === "") {
    const start = createNfaState(false);
    const end = createNfaState(true);
    start.epsilonTransitions.push(end);
    return { start, end };
  }

  const stack: NFA[] = [];

  for (const token of postfix) {
    if (token === "*") {
      const nfa = stack.pop()!;
      const start = createNfaState(false);
      const end = createNfaState(true);
      start.epsilonTransitions.push(nfa.start);
      start.epsilonTransitions.push(end);
      nfa.end.epsilonTransitions.push(nfa.start);
      nfa.end.epsilonTransitions.push(end);
      nfa.end.isEnd = false;
      stack.push({ start, end });
    } else if (token === "+") {
        const nfa = stack.pop()!;
        const start = createNfaState(false);
        const end = createNfaState(true);
        start.epsilonTransitions.push(nfa.start);
        nfa.end.epsilonTransitions.push(nfa.start);
        nfa.end.epsilonTransitions.push(end);
        nfa.end.isEnd = false;
        stack.push({ start, end });
    } else if (token === "|") {
      const right = stack.pop()!;
      const left = stack.pop()!;
      const start = createNfaState(false);
      const end = createNfaState(true);
      start.epsilonTransitions.push(left.start);
      start.epsilonTransitions.push(right.start);
      left.end.epsilonTransitions.push(end);
      left.end.isEnd = false;
      right.end.epsilonTransitions.push(end);
      right.end.isEnd = false;
      stack.push({ start, end });
    } else if (token === ".") {
      const right = stack.pop()!;
      const left = stack.pop()!;
      left.end.epsilonTransitions.push(right.start);
      left.end.isEnd = false;
      stack.push({ start: left.start, end: right.end });
    } else { // Character
      const start = createNfaState(false);
      const end = createNfaState(true);
      start.transitions.set(token, [end]);
      stack.push({ start, end });
    }
  }
  return stack.pop()!;
}

// --- NFA to DFA Conversion (Subset Construction) ---

function getEpsilonClosure(states: NfaState[]): Set<NfaState> {
    const closure = new Set(states);
    const stack = [...states];
    while (stack.length > 0) {
        const u = stack.pop()!;
        for (const v of u.epsilonTransitions) {
            if (!closure.has(v)) {
                closure.add(v);
                stack.push(v);
            }
        }
    }
    return closure;
}

function move(states: Set<NfaState>, symbol: string): Set<NfaState> {
    const nextStates = new Set<NfaState>();
    for (const state of states) {
        const transitions = state.transitions.get(symbol);
        if (transitions) {
            for (const nextState of transitions) {
                nextStates.add(nextState);
            }
        }
    }
    return nextStates;
}

export function nfaToDfa(nfa: NFA): { startState: DfaState, allStates: DfaState[] } {
    const dfaStates = new Map<string, DfaState>();
    let dfaIdCounter = 0;

    const nfaStatesToKey = (nfaStates: Set<NfaState>): string => {
        return Array.from(nfaStates).map(s => s.id).sort((a, b) => a - b).join(',');
    };

    const initialClosure = getEpsilonClosure([nfa.start]);
    const initialKey = nfaStatesToKey(initialClosure);
    
    const startState: DfaState = {
        id: dfaIdCounter++,
        nfaStates: initialClosure,
        isAccepting: Array.from(initialClosure).some(s => s.isEnd),
        transitions: new Map(),
    };

    const queue: DfaState[] = [startState];
    dfaStates.set(initialKey, startState);

    while (queue.length > 0) {
        const currentDfaState = queue.shift()!;
        const alphabet = new Set<string>();
        for (const nfaState of currentDfaState.nfaStates) {
            for (const symbol of nfaState.transitions.keys()) {
                alphabet.add(symbol);
            }
        }

        for (const symbol of alphabet) {
            const nextNfaStates = getEpsilonClosure(Array.from(move(currentDfaState.nfaStates, symbol)));
            if (nextNfaStates.size === 0) continue;

            const nextKey = nfaStatesToKey(nextNfaStates);
            let nextDfaState = dfaStates.get(nextKey);

            if (!nextDfaState) {
                nextDfaState = {
                    id: dfaIdCounter++,
                    nfaStates: nextNfaStates,
                    isAccepting: Array.from(nextNfaStates).some(s => s.isEnd),
                    transitions: new Map(),
                };
                dfaStates.set(nextKey, nextDfaState);
                queue.push(nextDfaState);
            }

            currentDfaState.transitions.set(symbol, nextDfaState);
        }
    }

    return { startState, allStates: Array.from(dfaStates.values()) };
}


// --- DFA Simulation ---

export function simulateDfa(dfaStartState: DfaState, text: string): boolean {
  let currentState: DfaState | undefined = dfaStartState;
  for (const char of text) {
      if (!currentState) return false;
      currentState = currentState.transitions.get(char);
  }
  return currentState ? currentState.isAccepting : false;
}