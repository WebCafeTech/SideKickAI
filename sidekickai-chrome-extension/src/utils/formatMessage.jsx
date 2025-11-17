import React from 'react'

/**
 * Utility functions for formatting chat messages
 * Supports markdown-like formatting: bold, italic, underline, lists, code blocks, etc.
 */

/**
 * Converts markdown-like text to HTML with formatting
 * @param {string} text - The text to format
 * @returns {JSX.Element} - React element with formatted content
 */
export function formatMessage(text) {
  if (!text) return text;
  
  // Split by newlines to handle line breaks
  const lines = text.split('\n');
  const formattedLines = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let listItems = [];
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle code blocks (```)
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        formattedLines.push(
          <pre key={`code-${i}`} style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px',
            borderRadius: '6px',
            overflow: 'auto',
            margin: '8px 0',
            fontSize: '13px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start code block
        if (listItems.length > 0) {
          formattedLines.push(renderList(listItems, listType, i));
          listItems = [];
          inList = false;
          listType = null;
        }
        inCodeBlock = true;
        const lang = line.trim().substring(3).trim();
        if (lang) {
          codeBlockContent.push(`// ${lang}`);
        }
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // Handle numbered lists (1., 2., etc.)
    const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numberedListMatch) {
      if (inList && listType !== 'ol') {
        formattedLines.push(renderList(listItems, listType, i));
        listItems = [];
      }
      inList = true;
      listType = 'ol';
      listItems.push(formatInlineText(numberedListMatch[2]));
      continue;
    }
    
    // Handle bullet lists (-, *, •)
    const bulletListMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletListMatch) {
      if (inList && listType !== 'ul') {
        formattedLines.push(renderList(listItems, listType, i));
        listItems = [];
      }
      inList = true;
      listType = 'ul';
      listItems.push(formatInlineText(bulletListMatch[1]));
      continue;
    }
    
    // End list if we hit a non-list line
    if (inList && line.trim() === '') {
      formattedLines.push(renderList(listItems, listType, i));
      listItems = [];
      inList = false;
      listType = null;
      formattedLines.push(<br key={`br-${i}`} />);
      continue;
    }
    
    if (inList && line.trim() !== '') {
      // Continue list with indented item
      const indentMatch = line.match(/^\s{2,}(.+)$/);
      if (indentMatch) {
        listItems.push(formatInlineText(indentMatch[1]));
        continue;
      } else {
        // End list
        formattedLines.push(renderList(listItems, listType, i));
        listItems = [];
        inList = false;
        listType = null;
      }
    }
    
    // Regular line - format inline text
    if (line.trim() === '') {
      formattedLines.push(<br key={`br-empty-${i}`} />);
    } else {
      formattedLines.push(
        <div key={`line-${i}`} style={{ marginBottom: '4px' }}>
          {formatInlineText(line)}
        </div>
      );
    }
  }
  
  // Close any open lists or code blocks
  if (inList && listItems.length > 0) {
    formattedLines.push(renderList(listItems, listType, lines.length));
  }
  if (inCodeBlock && codeBlockContent.length > 0) {
    formattedLines.push(
      <pre key="code-end" style={{
        background: 'rgba(0,0,0,0.3)',
        padding: '12px',
        borderRadius: '6px',
        overflow: 'auto',
        margin: '8px 0',
        fontSize: '13px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        <code>{codeBlockContent.join('\n')}</code>
      </pre>
    );
  }
  
  return <div>{formattedLines}</div>;
}

/**
 * Renders a list (ordered or unordered)
 */
function renderList(items, type, keyBase) {
  if (items.length === 0) return null;
  
  const ListComponent = type === 'ol' ? 'ol' : 'ul';
  return (
    <ListComponent 
      key={`list-${keyBase}`}
      style={{
        margin: '8px 0',
        paddingLeft: '24px',
        lineHeight: '1.6'
      }}
    >
      {items.map((item, idx) => (
        <li key={`item-${keyBase}-${idx}`} style={{ marginBottom: '4px' }}>
          {item}
        </li>
      ))}
    </ListComponent>
  );
}

/**
 * Formats inline text with bold, italic, underline, code, etc.
 * @param {string} text - Text to format
 * @returns {Array} - Array of React elements
 */
function formatInlineText(text) {
  if (!text) return text;
  
  const parts = [];
  let currentIndex = 0;
  let keyCounter = 0;
  
  // Pattern for various markdown formats (order matters - process code first, then links, then bold, then italic)
  const patterns = [
    // Code inline (backticks) - process first to avoid conflicts
    { 
      regex: /`([^`]+)`/g, 
      priority: 1,
      render: (match, content) => (
        <code key={`code-${keyCounter++}`} style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.9em'
        }}>{content}</code>
      )
    },
    // Links [text](url) - process early to avoid conflicts with bold/italic
    { 
      regex: /\[([^\]]+)\]\(([^)]+)\)/g, 
      priority: 2,
      render: (match, linkText, url) => {
        // Validate URL (basic check)
        let href = url.trim();
        // If URL doesn't start with http:// or https://, add https://
        if (!href.match(/^https?:\/\//i)) {
          href = 'https://' + href;
        }
        return (
          <a 
            key={`link-${keyCounter++}`} 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#60a5fa',
              textDecoration: 'underline',
              cursor: 'pointer',
              wordBreak: 'break-all',
              transition: 'color 0.2s'
            }}
            onClick={(e) => {
              // Ensure link opens in new tab, especially in extension context
              e.preventDefault();
              if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
                chrome.tabs.create({ url: href });
              } else {
                window.open(href, '_blank', 'noopener,noreferrer');
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#93c5fd';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#60a5fa';
            }}
          >
            {linkText}
          </a>
        );
      }
    },
    // Bold (**text** or __text__) - process before italic
    { 
      regex: /\*\*([^*]+)\*\*|__([^_]+)__/g, 
      priority: 3,
      render: (match, content1, content2) => (
        <strong key={`bold-${keyCounter++}`} style={{ fontWeight: 'bold' }}>
          {content1 || content2}
        </strong>
      )
    },
    // Italic (*text* or _text_) - process after bold to avoid conflicts
    { 
      regex: /\*([^*\n]+?)\*|_([^_\n]+?)_/g, 
      priority: 4,
      render: (match, content1, content2) => {
        // Skip if it's part of bold (**text** or __text__)
        if (match.startsWith('**') || match.endsWith('**') || 
            match.startsWith('__') || match.endsWith('__')) {
          return null;
        }
        return (
          <em key={`italic-${keyCounter++}`} style={{ fontStyle: 'italic' }}>
            {content1 || content2}
          </em>
        );
      }
    },
    // Underline (not standard markdown, but sometimes used)
    { 
      regex: /<u>([^<]+)<\/u>/g, 
      priority: 5,
      render: (match, content) => (
        <u key={`underline-${keyCounter++}`} style={{ textDecoration: 'underline' }}>
          {content}
        </u>
      )
    },
  ];
  
  // Find all matches, processing by priority
  const matches = [];
  const processedRanges = []; // Track processed ranges to avoid overlaps
  
  // Process patterns in priority order
  patterns.sort((a, b) => a.priority - b.priority);
  
  patterns.forEach(({ regex, render, priority }) => {
    let match;
    regex.lastIndex = 0; // Reset regex
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;
      
      // Check if this range overlaps with already processed ranges
      const overlaps = processedRanges.some(range => 
        !(end <= range.start || start >= range.end)
      );
      
      if (!overlaps) {
        const rendered = render(match[0], match[1], match[2]);
        if (rendered !== null) {
          matches.push({
            start,
            end,
            render: () => rendered,
            original: match[0],
            priority
          });
          processedRanges.push({ start, end });
        }
      }
    }
  });
  
  // Build parts array (matches are already non-overlapping)
  let lastIndex = 0;
  matches.forEach(match => {
    // Add text before match
    if (match.start > lastIndex) {
      const beforeText = text.substring(lastIndex, match.start);
      if (beforeText) {
        parts.push(beforeText);
      }
    }
    
    // Add formatted match
    parts.push(match.render());
    
    lastIndex = match.end;
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  // If no matches, return original text
  if (parts.length === 0) {
    return text;
  }
  
  return parts;
}

/**
 * Simple text formatter for plain text (no React)
 * Useful for non-React contexts
 */
export function formatPlainText(text) {
  if (!text) return text;
  
  return text
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br />');
}

