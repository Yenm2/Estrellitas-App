import React from 'react';
import { Star, RotateCcw, Copy, Check, Search, CheckCircle2 } from 'lucide-react';
import { FormatStyle } from '../types';
import { playStarSound, triggerVibrate } from '../utils/audio';

interface QuickPresetBarProps {
  onSetAllSun: () => void;
  onAddStarToAll: () => void;
  onResetRatings: () => void;
  onCopyPreview: () => void;
  isCopied: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTeamCount: number;
  filteredCount: number;
  soundEnabled: boolean;
  formatStyle: FormatStyle;
  onChangeFormatStyle: (style: FormatStyle) => void;
}

export const QuickPresetBar: React.FC<QuickPresetBarProps> = ({
  onSetAllSun,
  onAddStarToAll,
  onResetRatings,
  onCopyPreview,
  isCopied,
  searchQuery,
  onSearchChange,
  totalTeamCount,
  filteredCount,
  soundEnabled,
  formatStyle,
  onChangeFormatStyle,
}) => {
  const handleStarAll = () => {
    if (soundEnabled) playStarSound(3);
    triggerVibrate(20);
    onAddStarToAll();
  };

  const handleSunAll = () => {
    triggerVibrate(15);
    onSetAllSun();
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 sm:p-3.5 space-y-2.5 font-mono text-xs shadow-2xs">
      {/* Search, Format Mode Selector and Copy Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-teammate-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Buscar por nombre (${filteredCount}/${totalTeamCount})...`}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors text-xs"
          />
        </div>

        {/* Format Selector: Tags vs Solo Estrellas vs Texto */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 shrink-0">
          <span className="text-[11px] text-neutral-500 px-1 font-sans">Formato:</span>
          <button
            type="button"
            onClick={() => onChangeFormatStyle('tags')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              formatStyle === 'tags'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
            title="Formato con etiquetas: [OK] ★★★★★"
          >
            [Tag + ★]
          </button>
          <button
            type="button"
            onClick={() => onChangeFormatStyle('stars_only')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              formatStyle === 'stars_only'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
            title="Formato solo estrellas: Nombre ★★★★★"
          >
            [Solo ★]
          </button>
          <button
            type="button"
            onClick={() => onChangeFormatStyle('text')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              formatStyle === 'text'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
            title="Formato con texto: Nombre (OK) ★★★★★"
          >
            [(Texto) + ★]
          </button>
        </div>

        {/* Copy preview button */}
        <button
          id="copy-preview-btn"
          type="button"
          onClick={onCopyPreview}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all shrink-0 ${
            isCopied
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white'
              : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
          }`}
          title="Copiar lista formateada al portapapeles"
        >
          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'Copiado!' : 'Copiar lista'}</span>
        </button>
      </div>

      {/* Action Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] border-t border-neutral-100 dark:border-neutral-850 pt-2">
        <span className="text-neutral-500 shrink-0 font-medium font-sans">
          Acciones rápidas:
        </span>

        <button
          type="button"
          onClick={handleSunAll}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 transition-colors"
        >
          <CheckCircle2 className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
          <span>Marcar [OK] a todos</span>
        </button>

        <button
          type="button"
          onClick={handleStarAll}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 transition-colors"
        >
          <Star className="w-3 h-3 fill-current text-current" />
          <span>+1 Estrella a todos</span>
        </button>

        <button
          type="button"
          onClick={onResetRatings}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-400 transition-colors ml-auto"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restablecer</span>
        </button>
      </div>
    </div>
  );
};


