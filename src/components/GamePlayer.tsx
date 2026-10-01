import React, { useState, useRef, useEffect } from 'react';
import { GameItem } from '../types/game';
import { GameIcon } from './GameIcon';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Heart,
  ArrowLeft,
  Share2,
  Check,
  Monitor,
  Gamepad2,
  Star,
  Info,
} from 'lucide-react';
import { openInAboutBlank } from '../utils/cloak';

interface GamePlayerProps {
  game: GameItem;
  allGames: GameItem[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectGame: (game: GameItem) => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  allGames,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectGame,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Reset loading state when game changes
  useEffect(() => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  }, [game.id]);

  // Handle Fullscreen API changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request error:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen error:', err);
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  // Other recommendations excluding this game
  const recommendations = allGames
    .filter((g) => g.id !== game.id)
    .slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-200">{game.title}</span>
          <span aria-hidden="true">·</span>
          <span>{game.category}</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-400 flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            {game.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Main Game Player Frame */}
      <div
        ref={playerContainerRef}
        className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
          isTheater ? 'w-full' : 'max-w-5xl mx-auto w-full'
        } ${isFullscreen ? 'h-screen w-screen border-none rounded-none' : ''}`}
      >
        {/* Player Header Controls */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: `${game.accentColor || '#38bdf8'}33` }}
            >
              <div style={{ color: game.accentColor || '#38bdf8' }}>
                <GameIcon name={game.icon} className="w-4 h-4" />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
              {game.title}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Reload Button */}
            <button
              onClick={handleReload}
              title="Restart Game"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Theater Mode Toggle */}
            {!isFullscreen && (
              <button
                onClick={() => setIsTheater(!isTheater)}
                title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center ${
                  isTheater
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            )}

            {/* About:Blank Stealth Cloaker */}
            <button
              onClick={() => openInAboutBlank(game.iframeUrl, game.title)}
              title="Open in Stealth Window (about:blank)"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Native Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Iframe Viewport Area */}
        <div
          className={`relative w-full bg-black flex items-center justify-center ${
            isFullscreen
              ? 'flex-1 h-full'
              : isTheater
              ? 'h-[75vh]'
              : 'aspect-[16/10] max-h-[640px] min-h-[420px]'
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3 z-10">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Loading Game Frame...</span>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={game.iframeUrl}
            title={game.title}
            onLoad={() => setIsLoading(false)}
            allow="autoplay; fullscreen; keyboard; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
            className="w-full h-full border-0 select-none"
          />
        </div>
      </div>

      {/* Bottom Info & Controls Section */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game Details & Description */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">{game.title}</h2>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700/80 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {game.description}
            </p>

            {/* Controls Guide */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
              <Gamepad2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  How To Play & Controls
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {game.controls || 'Use Arrow keys or WASD, Space to action.'}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Tags:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {game.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span>{tag}</span>
                    {idx < game.tags!.length - 1 && (
                      <span aria-hidden="true" className="text-slate-600">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Iframe Metadata Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Embed & Iframe Info</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Source:</span>
                <span className="text-slate-200 font-mono text-[11px] truncate max-w-[150px]">
                  {game.iframeUrl}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-200 font-medium">{game.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Plays:</span>
                <span className="text-slate-200 font-mono tabular-nums">{game.plays}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Iframe Sandbox:</span>
                <span className="text-emerald-400 font-medium">Safe Sandbox</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => openInAboutBlank(game.iframeUrl, game.title)}
            className="w-full mt-4 py-2 px-3 bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Launch in Stealth Window
          </button>
        </div>
      </div>

      {/* Recommended Games Row */}
      {recommendations.length > 0 && (
        <div className="max-w-5xl mx-auto w-full mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">More Games You Might Like</h3>
            <span className="text-xs text-slate-500">Pick any game to switch instantly</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onSelectGame(rec)}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${rec.accentColor || '#38bdf8'}22` }}
                >
                  <div style={{ color: rec.accentColor || '#38bdf8' }}>
                    <GameIcon name={rec.icon} className="w-5 h-5" />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 truncate">
                    {rec.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                    <span>{rec.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 tabular-nums">★ {rec.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
