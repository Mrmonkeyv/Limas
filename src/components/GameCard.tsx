import React from 'react';
import { GameItem } from '../types/game';
import { GameIcon } from './GameIcon';
import { Heart, Play, Star, ExternalLink } from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectGame: (game: GameItem) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between"
    >
      {/* Thumbnail Banner */}
      <div
        className={`relative aspect-[16/10] w-full bg-gradient-to-br ${
          game.bgGradient || 'from-slate-800 to-slate-950'
        } flex items-center justify-center overflow-hidden border-b border-slate-800/60`}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Center Game Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${game.accentColor || '#38bdf8'}33` }}
        >
          <div style={{ color: game.accentColor || '#38bdf8' }}>
            <GameIcon name={game.icon} className="w-9 h-9" />
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
              : 'bg-black/40 text-slate-400 hover:text-white hover:bg-black/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Hover Quick Play Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/30 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current" />
            PLAY NOW
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata unboxed text (zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 font-medium">
            <span style={{ color: game.accentColor || '#38bdf8' }}>{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{game.plays} plays</span>
            {game.isCustom && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-indigo-400">Custom</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {game.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Bottom ratings and controls kicker */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>

          <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
            {game.controls || 'Keyboard / Touch'}
          </span>
        </div>
      </div>
    </div>
  );
};
