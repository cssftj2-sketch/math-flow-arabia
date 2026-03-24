import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * A component that renders text containing LaTeX formulas.
 * Formulas should be delimited by $$ for block math or $ for inline math.
 * Example: "The quadratic formula is $$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$."
 */
const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const parts = useMemo(() => {
    // Regex to find $$...$$ or $...$
    // Using a non-greedy match to handle multiple formulas in one line.
    const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
    return text.split(regex);
  }, [text]);

  return (
    <div className={`leading-relaxed whitespace-pre-wrap ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2);
          try {
            const html = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <div
                key={index}
                className="my-4 overflow-x-auto py-2"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            console.error('KaTeX block error:', e);
            return <code key={index} className="text-destructive font-mono text-xs">{part}</code>;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          try {
            const html = katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-block mx-1"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            console.error('KaTeX inline error:', e);
            return <code key={index} className="text-destructive font-mono text-xs">{part}</code>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default MathText;
