import React from 'react';
import { Download, Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build_character.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-cyber-secondary/50 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/10">
        <span className="text-xs font-mono text-blue-400">blender_script.py</span>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
            title="Copy Code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 hover:bg-cyber-primary/20 rounded transition-colors text-cyber-primary"
            title="Download .py file"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};