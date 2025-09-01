"use client";

import { motion } from 'framer-motion';

type Match = {
  match: string;
  index: number;
};

interface HighlightedTextProps {
  text: string;
  matches: Match[];
}

// A component to render text with highlighted matches
export default function HighlightedText({ text, matches }: HighlightedTextProps) {
  if (matches.length === 0) {
    // If there are no matches, just return the plain text.
    // The <pre> tag preserves whitespace and line breaks.
    return <pre>{text}</pre>;
  }

  // This is the core logic for rendering the highlights.
  const parts = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    // 1. Add the text *before* the current match (if any)
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // 2. Add the highlighted match itself
    parts.push(
        <motion.mark
            key={`${match.index}-${match.match}`} // A more stable key for animations
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-accent/40 text-primary rounded px-1 py-0.5"
        >
            {match.match}
        </motion.mark>
    );

    // 3. Update our position in the string
    lastIndex = match.index + match.match.length;
  });

  // 4. Add any remaining text *after* the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // Render the parts inside a <pre> tag to maintain formatting
  return <pre className="whitespace-pre-wrap">{parts}</pre>;
}