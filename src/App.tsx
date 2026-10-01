import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GameItem } from './types/game';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonViewerModal } from './components/JsonViewerModal';
import { TabCloakModal } from './components/TabCloakModal';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Star,
  Gamepad2,
  Heart,
  Plus,
  FileCode,
  EyeOff,
  Clock,
  Sparkles,
  Layers,
  Zap,
  Grid3x3,
  Rocket,
  Shield,
  Compass,
  ArrowUpDown,
  X,
  ExternalLink,
} from 'lucide-react';
import { applyCloak, CloakType } from './utils/cloak';

export default function App() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'az'>('popular');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load games from /games.json and localStorage
  useEffect(() => {
    // Restore cloak preset if set
    const savedCloak = (localStorage.getItem('arcade_cloak') as CloakType) || 'default';
    if (savedCloak !== 'default') applyCloak(savedCloak);

    // Restore favorites
    try {
      const savedFavs = JSON.parse(localStorage.getItem('arcade_favorites') || '[]');
      setFavorites(savedFavs);
    } catch (e) {}

    // Restore recents
    try {
      const savedRecents = JSON.parse(localStorage.getItem('arcade_recents') || '[]');
      setRecentIds(savedRecents);
    } catch (e) {}

    // Fetch games.json
    fetch('/games.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load games.json');
        return res.json();
      })
      .then((data: GameItem[]) => {
        // Merge with any custom games from localStorage
        const customGames: GameItem[] = JSON.parse(
          localStorage.getItem('arcade_custom_games') || '[]'
        );
        setGames([...data, ...customGames]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching games.json:', err);
        // Fallback default list
        setLoading(false);
      });
  }, []);

  // Keyboard shortcut listener (/ for search, ` for panic button)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === '`') {
        e.preventDefault();
        setIsPanicActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('arcade_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectGame = (game: GameItem) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track recently played
    setRecentIds((prev) => {
      const updated = [game.id, ...prev.filter((id) => id !== game.id)].slice(0, 8);
      localStorage.setItem('arcade_recents', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddGame = (newGame: GameItem) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customGames = updated.filter((g) => g.isCustom);
      localStorage.setItem('arcade_custom_games', JSON.stringify(customGames));
      return updated;
    });
    setSelectedGame(newGame);
  };

  const handleImportGames = (imported: GameItem[]) => {
    setGames(imported);
    localStorage.setItem('arcade_custom_games', JSON.stringify(imported.filter((g) => g.isCustom)));
  };

  // Derive categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ['All', 'Favorites', ...Array.from(set)];
  }, [games]);

  // Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    return games
      .filter((g) => {
        // Category filter
        if (selectedCategory === 'Favorites') {
          if (!favorites.includes(g.id)) return false;
        } else if (selectedCategory !== 'All' && g.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = g.title.toLowerCase().includes(q);
          const matchDesc = g.description.toLowerCase().includes(q);
          const matchCategory = g.category.toLowerCase().includes(q);
          const matchTags = g.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCategory && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        // Default popular: featured first, then plays
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [games, selectedCategory, searchQuery, sortBy, favorites]);

  // Featured Spotlight Game
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  // Panic screen overlay
  if (isPanicActive) {
    return (
      <div className="fixed inset-0 bg-white text-slate-900 z-[9999] flex flex-col font-sans select-none">
        <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="text-xl font-medium text-slate-700">Google Classroom</span>
          </div>
          <button
            onClick={() => setIsPanicActive(false)}
            className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Exit Panic (or press `)
          </button>
        </header>
        <main className="p-8 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-normal text-slate-800 mb-6">Upcoming Assignments</h1>
          <div className="p-6 border border-slate-200 rounded-lg shadow-sm space-y-3">
            <h2 className="text-base font-medium text-slate-900">Literature & Composition - Essay Draft</h2>
            <p className="text-xs text-slate-500">Due tomorrow at 11:59 PM · Assigned by Dr. Evans</p>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-6 links) — Zone 3 (1-2 primary actions) */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setSelectedGame(null);
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            ArcadeVault
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => {
                setSelectedGame(null);
                setSelectedCategory('All');
              }}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                !selectedGame && selectedCategory === 'All' ? 'text-white font-semibold' : ''
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => {
                setSelectedGame(null);
                setSelectedCategory('Puzzle');
              }}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Puzzles
            </button>
            <button
              onClick={() => {
                setSelectedGame(null);
                setSelectedCategory('Arcade');
              }}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Arcade
            </button>
            <button
              onClick={() => {
                setSelectedGame(null);
                setSelectedCategory('Retro');
              }}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Retro
            </button>
            <button
              onClick={() => {
                setSelectedGame(null);
                setSelectedCategory('Favorites');
              }}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="text-[11px] text-rose-400 tabular-nums">({favorites.length})</span>
              )}
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap text-emerald-400/90 font-medium"
            >
              + Add Game
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5">
            {/* Tab Disguise Cloak */}
            <button
              onClick={() => setIsCloakOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="Disguise browser tab"
            >
              <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Tab Cloak</span>
            </button>

            {/* JSON Config viewer */}
            <button
              onClick={() => setIsJsonOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="View games.json database"
            >
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            {/* Panic Key button */}
            <button
              onClick={() => setIsPanicActive(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
              title="Emergency panic screen (press ` anytime)"
            >
              Panic
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
        {selectedGame ? (
          /* Active Game Player View */
          <GamePlayer
            game={selectedGame}
            allGames={games}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onClose={() => setSelectedGame(null)}
            onSelectGame={handleSelectGame}
          />
        ) : (
          /* Portal Catalog View */
          <>
            {/* Featured Hero Banner (Shown when not filtering) */}
            {featuredGame && selectedCategory === 'All' && !searchQuery && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="relative z-10 max-w-xl">
                  {/* Clean unboxed metadata separator */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    <span>Spotlight Game</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{featuredGame.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-amber-400 tabular-nums">★ {featuredGame.rating.toFixed(1)}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
                    {featuredGame.title}
                  </h1>

                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {featuredGame.description}
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => handleSelectGame(featuredGame)}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>PLAY SPOTLIGHT</span>
                    </button>

                    <button
                      onClick={() => handleToggleFavorite(featuredGame.id)}
                      className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(featuredGame.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>Favorite</span>
                    </button>
                  </div>
                </div>

                {/* Hero Graphic Preview Badge */}
                <div
                  onClick={() => handleSelectGame(featuredGame)}
                  className="relative z-10 w-full md:w-64 aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-slate-950 border border-slate-700/60 flex flex-col items-center justify-center cursor-pointer group shadow-xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-9 h-9" />
                  </div>
                  <span className="mt-3 text-xs font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">
                    Click to Launch Frame
                  </span>
                </div>
              </div>
            )}

            {/* Filter, Search & Controls Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search games or tags... (Press '/' to focus)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Order Selector */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sort:</span>
                  </div>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                    <button
                      onClick={() => setSortBy('popular')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        sortBy === 'popular'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Popular
                    </button>
                    <button
                      onClick={() => setSortBy('rating')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        sortBy === 'rating'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Rating
                    </button>
                    <button
                      onClick={() => setSortBy('az')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        sortBy === 'az'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      A-Z
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Games Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400">Loading games library...</p>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="py-20 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8">
                <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200">No games matched your criteria</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try clearing your search term or switching to &apos;All Games&apos;, or add a custom iframe game.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-bold text-slate-200">{filteredGames.length}</span>
                    <span>games available</span>
                    {selectedCategory !== 'All' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-medium">Category: {selectedCategory}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectGame={handleSelectGame}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Clean quiet footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">ArcadeVault</span>
            <span aria-hidden="true">·</span>
            <span>All games stored as standalone iframes in JSON</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsCloakOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Stealth Cloaker
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => setIsJsonOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              JSON Database
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => setIsAddOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Add Custom Game
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonViewerModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        games={games}
        onImportGames={handleImportGames}
      />

      <TabCloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
      />
    </div>
  );
}
