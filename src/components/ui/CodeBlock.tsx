'use client';

import { useState, useRef } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = async () => {
    try {
      // Extract text content from the pre element
      const text = preRef.current?.textContent || '';
      
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const languageNames = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    python: 'Python',
    css: 'CSS',
    html: 'HTML',
    bash: 'Bash',
    shell: 'Shell',
    sql: 'SQL',
    json: 'JSON',
    typescript: 'TypeScript',
    ts: 'TypeScript'
  };

  const displayName = language ? languageNames[language.toLowerCase() as keyof typeof languageNames] || language.toUpperCase() : 'Code';

  return (
    <div className="code-block-wrapper">
      {language && (
        <div className="language-label">
          {displayName}
        </div>
      )}
      
      <div className={`snoopy-code-block ${language || 'default'}`}>
        <button
          onClick={copyToClipboard}
          className={`copy-button ${copied ? 'copied' : ''}`}
          title="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        
        <pre ref={preRef} className={className}>
          {children}
        </pre>
      </div>
    </div>
  );
}