import React from 'react';
import { Star, History, BarChart3, Users, Volume2, VolumeX, Terminal, Code2 } from 'lucide-react';

interface NavbarProps {
  teamName: string;
  activeTab: 'rate' | 'history' | 'stats';
  setActiveTab: (tab: 'rate' | 'history' | 'stats') => void;
  historyCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTeamModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  teamName,
  activeTab,
  setActiveTab,
  historyCount,
  soundEnabled,
  onToggleSound,
  onOpenTeamModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fafafa]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div
            onClick={onOpenTeamModal}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Click para editar equipo"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-xs select-none border border-neutral-800 dark:border-neutral-200 group-hover:opacity-80 transition-opacity">
              &gt;_
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight group-hover:underline underline-offset-4 truncate max-w-[180px] sm:max-w-xs">
                  {teamName || 'team'}
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900">
                  team
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-sans hidden sm:block">
                Evaluación diaria y feedback
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 font-mono">
            <button
              id="toggle-sound-btn"
              onClick={onToggleSound}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
                soundEnabled
                  ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 hover:border-neutral-400'
              }`}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline">{soundEnabled ? 'Sonido: On' : 'Sonido: Off'}</span>
            </button>

            <button
              id="manage-team-btn"
              onClick={onOpenTeamModal}
              className="flex items-center gap-1.5 text-xs font-sans px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              title="Gestionar compañeros de equipo"
            >
              <Users className="w-3.5 h-3.5 text-neutral-500" />
              <span>Equipo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Minimalist Coder Style */}
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 p-1 border border-neutral-200/80 dark:border-neutral-800 font-mono text-xs">
          <button
            id="nav-tab-rate"
            onClick={() => setActiveTab('rate')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all ${
              activeTab === 'rate'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs border border-neutral-200/80 dark:border-neutral-700'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${activeTab === 'rate' ? 'fill-neutral-900 dark:fill-neutral-100' : ''}`} />
            <span>Calificar</span>
          </button>

          <button
            id="nav-tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs border border-neutral-200/80 dark:border-neutral-700'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial</span>
            {historyCount > 0 && (
              <span className="text-[10px] px-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-stats"
            onClick={() => setActiveTab('stats')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs border border-neutral-200/80 dark:border-neutral-700'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Estadísticas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
