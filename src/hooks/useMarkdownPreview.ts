'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseMarkdownPreviewResult {
  html: string;
  loading: boolean;
  error: string | null;
}

export function useMarkdownPreview(content: string, debounceMs: number = 500): UseMarkdownPreviewResult {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async (markdownContent: string) => {
    if (!markdownContent.trim()) {
      setHtml('');
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/markdown/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: markdownContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setHtml(data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render markdown');
      setHtml('');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPreview(content);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [content, debounceMs, fetchPreview]);

  return { html, loading, error };
}