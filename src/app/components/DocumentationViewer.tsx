import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, Copy } from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
      title="复制"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

interface DocumentationViewerProps {
  content?: string
}

export function DocumentationViewer({ content }: DocumentationViewerProps) {
  if (!content) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p>该组件暂无文档</p>
      </div>
    )
  }

  return (
    <div className="p-6 prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-slate-900 mb-4 mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-slate-900 mb-2 mt-4">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-700 mb-4 leading-relaxed">{children}</p>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            if (match) {
              return (
                <code className="block bg-slate-100 rounded-lg p-3 my-2 text-sm overflow-x-auto" {...props}>
                  {children}
                </code>
              )
            }
            const codeText = String(children).replace(/\n$/, '')
            return (
              <span className="inline-flex items-center gap-1">
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm text-red-600" {...props}>
                  {children}
                </code>
                {codeText?.indexOf('npx shadcn@latest add') >= 0 && <CopyButton text={codeText} />}
              </span>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-slate-100 rounded-lg p-4 my-4 overflow-x-auto">{children}</pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-slate-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-700">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-700">{children}</li>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-slate-200 border border-slate-200">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 bg-white">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr>{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-slate-300 pl-4 py-2 my-4 bg-slate-50 italic text-slate-600 flex items-center [&>p]:mb-0">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
