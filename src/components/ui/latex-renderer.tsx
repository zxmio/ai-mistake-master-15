import 'katex/dist/katex.min.css';
import { useMemo } from 'react';

interface LatexRendererProps {
  content: string;
  className?: string;
}

// Parse and render LaTeX content mixed with regular text
export function LatexRenderer({ content, className = '' }: LatexRendererProps) {
  const renderedContent = useMemo(() => {
    if (!content) return null;

    // Split content by LaTeX delimiters: $...$ for inline, $$...$$ for block
    const parts: { type: 'text' | 'inline' | 'block'; content: string }[] = [];
    let remaining = content;

    // Process block math first ($$...$$)
    const blockRegex = /\$\$([\s\S]*?)\$\$/g;
    let lastIndex = 0;
    let match;

    // First, handle block math
    const tempParts: { type: 'text' | 'block'; content: string; start: number; end: number }[] = [];
    
    while ((match = blockRegex.exec(content)) !== null) {
      tempParts.push({
        type: 'block',
        content: match[1],
        start: match.index,
        end: match.index + match[0].length
      });
    }

    // Now process inline math and text between block math
    let currentPos = 0;
    for (const blockPart of tempParts) {
      // Process text before this block (may contain inline math)
      if (blockPart.start > currentPos) {
        const textBefore = content.slice(currentPos, blockPart.start);
        processInlineMath(textBefore, parts);
      }
      parts.push({ type: 'block', content: blockPart.content });
      currentPos = blockPart.end;
    }

    // Process remaining text after last block
    if (currentPos < content.length) {
      const textAfter = content.slice(currentPos);
      processInlineMath(textAfter, parts);
    }

    // If no block math was found, process the entire content for inline math
    if (tempParts.length === 0) {
      parts.length = 0;
      processInlineMath(content, parts);
    }

    return parts;
  }, [content]);

  if (!renderedContent) return null;

  return (
    <span className={className}>
      {renderedContent.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === 'inline') {
          return <InlineMath key={index} math={part.content} />;
        } else {
          return <BlockMath key={index} math={part.content} />;
        }
      })}
    </span>
  );
}

// Helper function to process inline math
function processInlineMath(text: string, parts: { type: 'text' | 'inline' | 'block'; content: string }[]) {
  const inlineRegex = /\$([^\$]+?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    // Add the inline math
    parts.push({ type: 'inline', content: match[1] });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
}

// Inline math component
function InlineMath({ math }: { math: string }) {
  const html = useMemo(() => {
    try {
      const katex = require('katex');
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (e) {
      return math;
    }
  }, [math]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// Block math component
function BlockMath({ math }: { math: string }) {
  const html = useMemo(() => {
    try {
      const katex = require('katex');
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (e) {
      return math;
    }
  }, [math]);

  return (
    <div 
      className="my-2 overflow-x-auto" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
