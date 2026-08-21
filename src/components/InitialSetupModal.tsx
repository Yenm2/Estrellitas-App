import React, { useState } from 'react';
import { Users, Plus, Trash2, ArrowRight, RefreshCw, Terminal, Layers } from 'lucide-react';
import { Teammate } from '../types';
import { DEFAULT_TEAMMATES, setSetupCompleted } from '../utils/storage';
import { triggerVibrate, playSuccessSound } from '../utils/audio';

interface InitialSetupModalProps {
  isOpen: boolean;
  currentTeamName: string;
  currentTeammates: Teammate[];
  onCompleteSetup: (teamName: string, teammates: Teammate[]) => void;
  onClose?: () => void;
  isInitialLaunch?: boolean;
}

const AVATAR_COLORS = [
  'bg-neutral-800 text-neutral-100',
  'bg-neutral-700 text-neutral-100',
  'bg-neutral-900 text-neutral-100',
  'bg-neutral-600 text-neutral-100',
];

export const InitialSetupModal: React.FC<InitialSetupModalProps> = ({
  isOpen,
  currentTeamName,
  currentTeammates,
  onCompleteSetup,
  onClose,
  isInitialLaunch = true,
}) => {
  const [teamName, setTeamName] = useState(currentTeamName || 'dev-team');
  const [teammates, setTeammates] = useState<Teammate[]>(
    currentTeammates && currentTeammates.length > 0 ? currentTeammates : DEFAULT_TEAMMATES
  );
  const [newMemberName, setNewMemberName] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nameTrimmed = newMemberName.trim();
    if (!nameTrimmed) return;

    if (teammates.some((t) => t.name.toLowerCase() === nameTrimmed.toLowerCase())) {
      setErrorMsg(`"${nameTrimmed}" ya está en la lista.`);
      return;
    }

    setErrorMsg('');
    const newTeammate: Teammate = {
      id: `tm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: nameTrimmed,
      avatarColor: AVATAR_COLORS[teammates.length % AVATAR_COLORS.length],
    };

    setTeammates([...teammates, newTeammate]);
    setNewMemberName('');
    triggerVibrate(15);
  };

  const handleRemoveMember = (id: string) => {
    setTeammates(teammates.filter((t) => t.id !== id));
    triggerVibrate(10);
  };

  const handleApplyBulk = () => {
    if (!bulkInput.trim()) return;
    const names = bulkInput
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) return;

    const newTeammatesList: Teammate[] = names.map((name, idx) => ({
      id: `tm-bulk-${Date.now()}-${idx}`,
      name,
      avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
    }));

    setTeammates(newTeammatesList);
    setBulkMode(false);
    setBulkInput('');
    setErrorMsg('');
    triggerVibrate(20);
  };

  const handleLoadDefaults = () => {
    setTeammates(DEFAULT_TEAMMATES);
    setTeamName('dev-team');
    setErrorMsg('');
    triggerVibrate(15);
  };

  const handleClearAll = () => {
    setTeammates([]);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTeamName = teamName.trim() || 'dev-team';

    if (teammates.length === 0) {
      setErrorMsg('Por favor agrega al menos un miembro para tu equipo.');
      return;
    }

    setSetupCompleted(true);
    playSuccessSound();
    triggerVibrate([20, 30]);
    onCompleteSetup(trimmedTeamName, teammates);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-mono text-xs">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 animate-in zoom-in-95 duration-100 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-sans">
              {isInitialLaunch ? 'Configurar Equipo Inicial' : 'Editar Equipo'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-sans">
            Ingresa el nombre del equipo y los compañeros a evaluar.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-3.5 overflow-hidden font-sans">
          {/* Team Name Input */}
          <div className="space-y-1 shrink-0">
            <label
              htmlFor="setup-team-name-input"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Nombre del equipo:
            </label>
            <input
              id="setup-team-name-input"
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ej: Dev Team, Squad Frontend..."
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
            />
          </div>

          {/* Teammates Section Header & Quick Mode Toggles */}
          <div className="shrink-0 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <span>Integrantes del equipo:</span>
                <span className="px-1.5 py-0.2 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono">
                  {teammates.length}
                </span>
              </label>

              <button
                type="button"
                onClick={() => setBulkMode(!bulkMode)}
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 font-medium"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{bulkMode ? 'Modo individual' : 'Pegar lista masiva'}</span>
              </button>
            </div>

            {/* Bulk Mode Input or Single Add Input */}
            {bulkMode ? (
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <p className="text-xs text-neutral-500 font-sans">
                  Pega los nombres separados por comas o saltos de línea:
                </p>
                <textarea
                  id="setup-bulk-members-input"
                  rows={3}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Anjel, David, Fer, Hector, Isaac, Lalo, Luis, Pablo, Rebeca"
                  className="w-full text-xs p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-mono"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBulkMode(false)}
                    className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyBulk}
                    disabled={!bulkInput.trim()}
                    className="px-3 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 disabled:opacity-30 font-semibold text-xs rounded-md"
                  >
                    Cargar lista
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-mono">
                <input
                  id="setup-new-member-input"
                  type="text"
                  value={newMemberName}
                  onChange={(e) => {
                    setNewMemberName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                  placeholder="Nombre del compañero..."
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                />
                <button
                  type="button"
                  id="setup-add-member-btn"
                  onClick={() => handleAddMember()}
                  disabled={!newMemberName.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 disabled:opacity-30 text-xs font-semibold shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-rose-500 px-1 font-sans">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Scrollable list of added teammates */}
          <div className="flex-1 overflow-y-auto space-y-1 p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 max-h-44 font-mono">
            {teammates.length === 0 ? (
              <div className="text-center py-5 text-xs text-neutral-400 space-y-1 font-sans">
                <Users className="w-5 h-5 mx-auto text-neutral-400" />
                <p>No hay miembros aún</p>
                <button
                  type="button"
                  onClick={handleLoadDefaults}
                  className="text-neutral-900 dark:text-neutral-100 underline mt-1 block mx-auto font-medium"
                >
                  Cargar lista sugerida (9 compañeros)
                </button>
              </div>
            ) : (
              teammates.map((t, index) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] text-neutral-400 font-mono w-4">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] text-neutral-800 dark:text-neutral-200 select-none shrink-0">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {t.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMember(t.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors"
                    title="Eliminar compañero"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick presets footer helpers */}
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-0.5 shrink-0 font-sans">
            <button
              type="button"
              onClick={handleLoadDefaults}
              className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Restablecer predeterminados</span>
            </button>

            {teammates.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-neutral-500 hover:text-rose-500"
              >
                Limpiar lista
              </button>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2 shrink-0 font-sans">
            <button
              id="complete-setup-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs text-white dark:text-neutral-950 bg-neutral-900 dark:bg-white hover:opacity-90 active:scale-98 transition-all border border-neutral-900 dark:border-white"
            >
              <span>Guardar y Comenzar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

