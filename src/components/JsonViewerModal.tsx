import React, { useState } from 'react';
import { GameItem } from '../types/game';
import { X, Copy, Check, Download, Upload, FileCode, CheckCircle2 } from 'lucide-react';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: GameItem[];
  onImportGames: (imported: GameItem[]) => void;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  games,
  onImportGames,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'import'>('view');
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    setImportSuccess(false);

    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON root must be an array of game objects [ ... ]');
      }
      if (parsed.length === 0) {
        throw new Error('The array is empty. Please provide at least one game.');
      }
      for (const item of parsed) {
        if (!item.title || !item.iframeUrl) {
          throw new Error('Each item must contain at least a "title" and an "iframeUrl" property.');
        }
      }

      onImportGames(parsed);
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database JSON Manager</h3>
              <p className="text-xs text-slate-400">Stored iframe game records in games.json</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 bg-slate-950/60 border-b border-slate-800 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'view'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Current games.json ({games.length} games)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'import'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Import / Replace JSON
          </button>
        </div>

        {/* Content */}
        {activeTab === 'view' ? (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">
                Path: <code className="text-sky-300 font-mono">/public/games.json</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            {/* Code block */}
            <div className="flex-1 overflow-auto bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
              <pre className="whitespace-pre">{jsonString}</pre>
            </div>
          </div>
        ) : (
          <form onSubmit={handleImportSubmit} className="p-6 flex flex-col flex-1 space-y-4">
            <p className="text-xs text-slate-300">
              Paste custom JSON data containing an array of game objects with <code className="text-sky-300 font-mono">title</code>, <code className="text-sky-300 font-mono">iframeUrl</code>, <code className="text-sky-300 font-mono">category</code>, etc.
            </p>

            {importError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {importError}
              </div>
            )}

            {importSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Games JSON successfully imported and updated!</span>
              </div>
            )}

            <textarea
              rows={12}
              required
              placeholder='[ { "id": "my-game", "title": "My Game", "category": "Arcade", "iframeUrl": "https://..." } ]'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full flex-1 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl p-4 font-mono text-xs text-white placeholder-slate-600 outline-none resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Load Into Portal</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
