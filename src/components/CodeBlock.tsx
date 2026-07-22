import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-blue-50 rounded-t-lg border-b border-blue-200">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-blue-100 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              复制
            </>
          )}
        </button>
      </div>
      <pre className="rounded-b-lg">
        <code className="block">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers && (
                <span className="w-12 flex-shrink-0 px-4 py-0.5 text-right text-gray-500 text-sm select-none border-r border-blue-200">
                  {index + 1}
                </span>
              )}
              <span className="flex-1 px-4 py-0.5 text-sm text-gray-700 font-mono">
                {line || ' '}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
