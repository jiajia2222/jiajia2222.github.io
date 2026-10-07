'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownPreview({ markdown }: { markdown: string }) {
  return <div className="markdown-preview">
    {markdown.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown> : <p className="empty">开始写作后，这里会显示 Markdown 预览。</p>}
  </div>;
}
