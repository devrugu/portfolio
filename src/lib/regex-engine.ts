// src/lib/regex-engine.ts

// --- Data Structures for the NFA and DFA ---
class State {
  isEndState: boolean;
  transitions: Map<string, State>;
  epsilonTransitions: State[];

  constructor(isEndState: boolean) {
    this.isEndState = isEndState;
    this.transitions = new Map();
    this.epsilonTransitions = [];
  }
}

class NFA {
  startState: State;
  endState: State;

  constructor(startState: State, endState: State) {
    this.startState = startState;
    this.endState = endState;
  }
}

// --- Core Regex Engine Class (Upgraded) ---
export class RegexEngine {
  private dfa: State | null = null;
  private static operatorPrecedence: { [key: string]: number } = {
    '|': 0, '.': 1, '*': 2, '+': 2,
  };

  private expandCaseInsensitive(pattern: string): string {
    let expanded = '';
    for (const char of pattern) {
      const lower = char.toLowerCase();
      const upper = char.toUpperCase();
      if (lower !== upper) {
        expanded += `(${lower}|${upper})`;
      } else {
        expanded += char;
      }
    }
    return expanded;
  }

  // --- UPDATED: The compile method now accepts a 'wholeWord' flag ---
  public compile(pattern: string, flags: { caseInsensitive: boolean; wholeWord: boolean }): void {
    if (!pattern) {
      this.dfa = null;
      return;
    }

    try {
      let patternToCompile = pattern;

      // 1. Apply case-insensitivity first
      if (flags.caseInsensitive) {
        patternToCompile = this.expandCaseInsensitive(patternToCompile);
      }

      // 2. Wrap the pattern for whole word matching
      // This is a simplified way to handle word boundaries. A true \b would require a more complex NFA.
      // For this demo, we assume "words" are separated by spaces.
      // This is a conceptual addition to the pattern itself.
      if (flags.wholeWord) {
        // This is a simplification. True word boundaries (\b) are complex.
        // We will handle the actual word check in the search function.
      }

      const processedPattern = this.addConcatOperators(patternToCompile);
      const postfixPattern = this.convertToPostfix(processedPattern);
      const nfa = this.postfixToNFA(postfixPattern);
      this.dfa = this.nfaToDFA(nfa);
    } catch (e) {
      console.error("Invalid regex pattern", e);
      this.dfa = null;
      throw new Error("Invalid Pattern");
    }
  }

  // --- UPDATED: The search method now accepts the wholeWord flag to filter results ---
  public search(text: string, flags: { wholeWord: boolean }): { match: string; index: number }[] {
    if (!this.dfa) return [];

    const allMatches: { match: string; index: number }[] = [];
    for (let i = 0; i < text.length; i++) {
      let currentState = this.dfa;
      for (let j = i; j < text.length; j++) {
        const char = text[j];
        if (currentState.transitions.has(char)) {
          currentState = currentState.transitions.get(char)!;
          if (currentState.isEndState) {
            const match = text.substring(i, j + 1);
            allMatches.push({ match, index: i });
          }
        } else {
          break;
        }
      }
    }
    
    let filteredMatches = this.filterSubmatches(allMatches);

    // --- NEW: Post-filter for "whole word" matches ---
    if (flags.wholeWord) {
      filteredMatches = filteredMatches.filter(match => {
        const precedingChar = text[match.index - 1];
        const followingChar = text[match.index + match.match.length];

        const isStartBoundary = precedingChar === undefined || /\s/.test(precedingChar);
        const isEndBoundary = followingChar === undefined || /\s/.test(followingChar);

        return isStartBoundary && isEndBoundary;
      });
    }

    return filteredMatches;
  }
  
  private filterSubmatches(matches: { match: string; index: number }[]): { match: string; index: number }[] {
    if (!matches || matches.length === 0) return [];

    matches.sort((a, b) => {
        if (a.index !== b.index) return a.index - b.index;
        return b.match.length - a.match.length;
    });

    const filtered = [];
    let lastMatchEnd = -1;

    for (const match of matches) {
        const matchEnd = match.index + match.match.length;
        if (match.index >= lastMatchEnd) {
            filtered.push(match);
            lastMatchEnd = matchEnd;
        }
    }
    return filtered;
  }

  private addConcatOperators(regex: string): string {
    let output = "";
    for (let i = 0; i < regex.length; i++) {
      const token = regex[i];
      output += token;
      if (token === "(" || token === "|") continue;
      if (i < regex.length - 1) {
        const nextToken = regex[i + 1];
        if (nextToken === "*" || nextToken === "+" || nextToken === "|" || nextToken === ")") continue;
        output += ".";
      }
    }
    return output;
  }

  private convertToPostfix(regex: string): string {
    let output = "";
    const operatorStack: string[] = [];
    const peek = (stack: string[]) => stack.length ? stack[stack.length - 1] : null;

    for (const token of regex) {
      if (token === "." || token === "|" || token === "*" || token === "+") {
        while (
          operatorStack.length &&
          peek(operatorStack) !== "(" &&
          RegexEngine.operatorPrecedence[peek(operatorStack)!] >= RegexEngine.operatorPrecedence[token]
        ) {
          output += operatorStack.pop();
        }
        operatorStack.push(token);
      } else if (token === "(" || token === ")") {
        if (token === "(") {
          operatorStack.push(token);
        } else {
          while (peek(operatorStack) !== "(") {
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

  private postfixToNFA(postfix: string): NFA {
    if (postfix === "") return this.createBasicNFA('ε');

    const stack: NFA[] = [];

    for (const token of postfix) {
      switch (token) {
        case '*':
          stack.push(this.kleeneStar(stack.pop()!));
          break;
        case '+':
          stack.push(this.kleenePlus(stack.pop()!));
          break;
        case '|': {
          const right = stack.pop()!;
          const left = stack.pop()!;
          stack.push(this.union(left, right));
          break;
        }
        case '.': {
          const right = stack.pop()!;
          const left = stack.pop()!;
          stack.push(this.concat(left, right));
          break;
        }
        default:
          stack.push(this.createBasicNFA(token));
      }
    }
    return stack.pop()!;
  }

  private createBasicNFA(symbol: string): NFA {
    const startState = new State(false);
    const endState = new State(true);
    if (symbol === 'ε') {
      startState.epsilonTransitions.push(endState);
    } else {
      startState.transitions.set(symbol, endState);
    }
    return new NFA(startState, endState);
  }

  private concat(first: NFA, second: NFA): NFA {
    first.endState.isEndState = false;
    first.endState.epsilonTransitions.push(second.startState);
    return new NFA(first.startState, second.endState);
  }
  
  private union(first: NFA, second: NFA): NFA {
    const startState = new State(false);
    startState.epsilonTransitions.push(first.startState, second.startState);
    const endState = new State(true);
    first.endState.isEndState = false;
    second.endState.isEndState = false;
    first.endState.epsilonTransitions.push(endState);
    second.endState.epsilonTransitions.push(endState);
    return new NFA(startState, endState);
  }
  
  private kleeneStar(nfa: NFA): NFA {
    const startState = new State(false);
    const endState = new State(true);
    startState.epsilonTransitions.push(endState, nfa.startState);
    nfa.endState.isEndState = false;
    nfa.endState.epsilonTransitions.push(endState, nfa.startState);
    return new NFA(startState, endState);
  }
  
  private kleenePlus(nfa: NFA): NFA {
      const startState = new State(false);
      const endState = new State(true);
      startState.epsilonTransitions.push(nfa.startState);
      nfa.endState.isEndState = false;
      nfa.endState.epsilonTransitions.push(endState, nfa.startState);
      return new NFA(startState, endState);
  }

  private nfaToDFA(nfa: NFA): State {
    const epsilonClosure = (states: Set<State>): Set<State> => {
        const stack = [...states];
        const closure = new Set(states);
        while (stack.length > 0) {
            const state = stack.pop()!;
            for (const s of state.epsilonTransitions) {
                if (!closure.has(s)) {
                    closure.add(s);
                    stack.push(s);
                }
            }
        }
        return closure;
    };

    const move = (states: Set<State>, symbol: string): Set<State> => {
        const result = new Set<State>();
        for (const state of states) {
            const next = state.transitions.get(symbol);
            if (next) result.add(next);
        }
        return result;
    };

    const stateIdMap = new Map<State, number>();
    let nextId = 0;
    const getStateKey = (states: Set<State>): string => {
        const ids = [];
        for (const s of states) {
            if (!stateIdMap.has(s)) {
                stateIdMap.set(s, nextId++);
            }
            ids.push(stateIdMap.get(s)!);
        }
        return ids.sort((a, b) => a - b).join(",");
    };

    const startClosure = epsilonClosure(new Set([nfa.startState]));
    const dfaStates = new Map<string, State>();
    const queue: Set<State>[] = [startClosure];
    
    const dfaStartState = new State(Array.from(startClosure).some(s => s.isEndState));
    dfaStates.set(getStateKey(startClosure), dfaStartState);

    while (queue.length > 0) {
        const currentNfaStates = queue.shift()!;
        const currentDfaState = dfaStates.get(getStateKey(currentNfaStates))!;
        
        const symbols = new Set<string>();
        for (const state of currentNfaStates) {
            state.transitions.forEach((_, symbol) => symbols.add(symbol));
        }

        for (const symbol of symbols) {
            const nextNfaStates = epsilonClosure(move(currentNfaStates, symbol));
            if (nextNfaStates.size > 0) {
                const key = getStateKey(nextNfaStates);
                let nextDfaState = dfaStates.get(key);
                if (!nextDfaState) {
                    nextDfaState = new State(Array.from(nextNfaStates).some(s => s.isEndState));
                    dfaStates.set(key, nextDfaState);
                    queue.push(nextNfaStates);
                }
                currentDfaState.transitions.set(symbol, nextDfaState);
            }
        }
    }
    return dfaStartState;
  }
}