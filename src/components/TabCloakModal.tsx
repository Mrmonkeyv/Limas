import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, EyeOff, AlertTriangle } from 'lucide-react';
import { CloakType, CLOAK_PRESETS, applyCloak } from '../utils/cloak';

interface TabCloakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TabCloakModal: React.FC<TabCloakModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentCloak, setCurrentCloak] = useState<CloakType>('default');

  useEffect(() => {
    const saved = (localStorage.getItem('arcade_cloak') as CloakType) || 'default';
    setCurrentCloak(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCloak = (type: CloakType) => {
    setCurrentCloak(type);
    applyCloak(type);
  };

  const options: { id: CloakType; name: string; subtitle: string; icon: string }[] = [
    {
      id: 'default',
      name: 'Default ArcadeVault',
      subtitle: 'Original gamer title and icon',
      icon: '🎮',
    },
    {
      id: 'docs',
      name: 'Google Docs',
      subtitle: 'Untitled document - Google Docs',
      icon: '📄',
    },
    {
      id: 'classroom',
      name: 'Google Classroom',
      subtitle: 'Home - Google Classroom',
      icon: '🏫',
    },
    {
      id: 'drive',
      name: 'Google Drive',
      subtitle: 'My Drive - Google Drive',
      icon: '📁',
    },
    {
      id: 'canvas',
      name: 'Canvas LMS',
      subtitle: 'Dashboard - Canvas LMS',
      icon: '🎓',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tab Disguise & Cloak</h3>
              <p className="text-xs text-slate-400">Change browser tab title and favicon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-slate-300">
            Select a disguise below. Your active browser tab will instantly switch its title and icon to match your chosen academic tool.
          </p>

          <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectCloak(opt.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  currentCloak === opt.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{opt.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{opt.name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                      {opt.subtitle}
                    </div>
                  </div>
                </div>

                {currentCloak === opt.id && (
                  <span className="text-emerald-400 text-xs font-semibold">Active</span>
                )}
              </button>
            ))}
          </div>

          {/* Panic Key Notice */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Quick Panic Button</span>
              <span>
                Press <kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-amber-500/30 text-[10px] font-mono">`</kbd> (backtick) or click Panic in the top bar to instantly trigger a clean Google Classroom disguise.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
