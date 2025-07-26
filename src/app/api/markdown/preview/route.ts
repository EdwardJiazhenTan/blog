import { NextRequest, NextResponse } from 'next/server';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Use remark to process markdown to HTML
    const result = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(content);

    let html = String(result);

    // Add custom classes to HTML elements to match the blog styling
    html = html
      // Headers
      .replace(/<h1>/g, '<h1 class="text-4xl font-bold mt-16 mb-8 font-snoopy text-center" style="color: var(--foreground)">')
      .replace(/<h2>/g, '<h2 class="text-3xl font-bold mt-12 mb-6 font-snoopy relative" style="color: var(--foreground)">')
      .replace(/<h3>/g, '<h3 class="text-2xl font-bold mt-10 mb-5 font-handwriting" style="color: var(--foreground)">')
      // Paragraphs
      .replace(/<p>/g, '<p class="text-lg leading-relaxed mb-8 font-handwriting" style="color: var(--foreground)">')
      // Lists
      .replace(/<ul>/g, '<ul class="space-y-4 mb-8 font-handwriting" style="color: var(--foreground)">')
      .replace(/<ol>/g, '<ol class="space-y-4 mb-8 font-handwriting counter-reset" style="color: var(--foreground)">')
      .replace(/<li>/g, '<li class="flex items-start space-x-3"><span class="w-1.5 h-1.5 bg-current mt-2.5 flex-shrink-0 opacity-60"></span><span class="text-lg leading-relaxed">')
      .replace(/<\/li>/g, '</span></li>')
      // Blockquotes
      .replace(/<blockquote>/g, '<div class="border-l-4 pl-6 my-8 italic bg-gray-50 py-4 rounded-r-lg" style="border-color: var(--snoopy-yellow); color: var(--foreground)"><div class="font-handwriting text-lg">')
      .replace(/<\/blockquote>/g, '</div></div>')
      // Enhanced Code blocks with language detection and copy button
      .replace(/<pre><code class="language-(\w+)">/g, (match, lang) => {
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
        const displayName = languageNames[lang.toLowerCase()] || lang.toUpperCase();
        return `<div class="code-block-wrapper">
          <div class="language-label">${displayName}</div>
          <div class="snoopy-code-block ${lang.toLowerCase()}">
            <button onclick="copyCodeBlock(this)" class="copy-button" title="Copy code">Copy</button>
            <pre><code class="language-${lang}">`;
      })
      .replace(/<pre><code>/g, '<div class="snoopy-code-block default"><button onclick="copyCodeBlock(this)" class="copy-button" title="Copy code">Copy</button><pre><code>')
      .replace(/<\/code><\/pre>/g, '</code></pre></div></div>')
      // Inline code
      .replace(/<code>/g, '<code class="px-2 py-1 rounded-lg text-sm font-mono border" style="background-color: rgba(45, 27, 23, 0.1); color: var(--foreground); border-color: var(--foreground)">')
      // Links
      .replace(/<a href="/g, '<a class="font-semibold hover:underline transition-all duration-200 hover:opacity-80" style="color: var(--snoopy-blue)" href="')
      // Strong and emphasis
      .replace(/<strong>/g, '<strong class="font-bold" style="color: var(--foreground)">')
      .replace(/<em>/g, '<em class="italic" style="color: var(--foreground)">')
      // Toggle blocks
      .replace(/<details>/g, '<details class="snoopy-toggle">')
      .replace(/<summary>/g, '<summary>');

    // Add JavaScript for copy functionality
    const jsScript = `
      <script>
        function copyCodeBlock(button) {
          const codeBlock = button.nextElementSibling.querySelector('code') || button.parentElement.querySelector('pre code');
          const text = codeBlock.textContent || codeBlock.innerText;
          
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              const originalText = button.textContent;
              button.textContent = 'Copied!';
              button.classList.add('copied');
              setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
              }, 2000);
            });
          }
        }
      </script>
    `;

    return NextResponse.json({ html: html + jsScript });
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return NextResponse.json(
      { error: 'Failed to render markdown', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}