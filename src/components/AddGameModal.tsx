import React, { useState } from 'react';
import { GameItem } from '../types/game';
import { X, Plus, Play, ExternalLink, AlertCircle } from 'lucide-react';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (newGame: GameItem) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeUrl, setIframeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('Arrow keys / Mouse');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Auto clean iframe tag if user pasted <iframe src="...">
  const cleanUrl = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.startsWith('<iframe')) {
      const match = trimmed.match(/src=["'](.*?)["']/);
      if (match && match[1]) return match[1];
    }
    return trimmed;
  };

  const handleTestPreview = () => {
    const cleaned = cleanUrl(iframeUrl);
    if (!cleaned) {
      setError('Please provide a valid iframe URL or embed code.');
      return;
    }
    setError('');
    setPreviewActive(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanUrl(iframeUrl);

    if (!title.trim()) {
      setError('Please enter a game title.');
      return;
    }
    if (!cleaned) {
      setError('Please enter a valid iframe URL or embed snippet.');
      return;
    }

    const newGame: GameItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category || 'Arcade',
      description: description.trim() || 'Custom user-added iframe game.',
      iframeUrl: cleaned,
      icon: 'Gamepad2',
      accentColor: '#38bdf8',
      bgGradient: 'from-blue-600/20 to-slate-900',
      rating: 5.0,
      plays: '1',
      featured: false,
      controls: controls.trim() || 'Arrow keys / Mouse',
      tags: ['Custom', category],
      isCustom: true,
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Custom Iframe Game</h3>
              <p className="text-xs text-slate-400">Embed any HTML5 game or iframe source</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Game Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Retro Space Blaster"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
              >
                <option value="Action">Action</option>
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Skill">Skill</option>
                <option value="Sports">Sports</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Controls Hint
              </label>
              <input
                type="text"
                placeholder="e.g. WASD to move"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Iframe Embed URL or Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="https://... or <iframe src='...'>"
                value={iframeUrl}
                onChange={(e) => {
                  setIframeUrl(e.target.value);
                  setPreviewActive(false);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white font-mono text-xs placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={handleTestPreview}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Test URL
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports HTTPS game URLs, itch.io embeds, GitHub pages, or local iframe paths.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of the game rules and gameplay..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none resize-none"
            />
          </div>

          {/* Live Preview Box */}
          {previewActive && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-black p-2">
              <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                <span>Live Iframe Preview:</span>
                <span className="text-emerald-400">Ready</span>
              </div>
              <div className="w-full h-44 bg-slate-950 rounded-lg overflow-hidden relative">
                <iframe
                  src={cleanUrl(iframeUrl)}
                  title="Test Game Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Add to Game Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
