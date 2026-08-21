import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Check, X, RotateCcw, Terminal } from 'lucide-react';
import { Teammate } from '../types';
import { DEFAULT_TEAMMATES } from '../utils/storage';

interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  onSaveTeamName: (name: string) => void;
  teammates: Teammate[];
  onSaveTeammates: (teammates: Teammate[]) => void;
}

const AVATAR_COLORS = [
  'bg-neutral-800 text-neutral-100',
  'bg-neutral-700 text-neutral-100',
  'bg-neutral-900 text-neutral-100',
  'bg-neutral-600 text-neutral-100',
];

export const ManageTeamModal: React.FC<ManageTeamModalProps> = ({
  isOpen,
  onClose,
  teamName,
  onSaveTeamName,
  teammates,
  onSaveTeammates,
}) => {
  const [teamList, setTeamList] = useState<Teammate[]>(teammates);
  const [currentName, setCurrentName] = useState(teamName);
  const [newMemberName, setNewMemberName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(e.target.value);
    onSaveTeamName(e.target.value);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newTeammate: Teammate = {
      id: `custom-${Date.now()}`,
      name: newMemberName.trim(),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };

    const updated = [...teamList, newTeammate];
    setTeamList(updated);
    onSaveTeammates(updated);
    setNewMemberName('');
  };

  const handleRemoveMember = (id: string) => {
    if (teamList.length <= 1) {
      alert('Debes tener al menos un compañero de equipo.');
      return;
    }
    const updated = teamList.filter((t) => t.id !== id);
    setTeamList(updated);
    onSaveTeammates(updated);
  };

  const handleStartEdit = (t: Teammate) => {
    setEditingId(t.id);
    setEditName(t.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = teamList.map((t) => (t.id === id ? { ...t, name: editName.trim() } : t));
    setTeamList(updated);
    onSaveTeammates(updated);
    setEditingId(null);
  };

  const handleRestoreDefaults = () => {
    if (confirm('¿Restablecer los 9 compañeros originales (Anjel, David, Fer, etc.)?')) {
      setTeamList(DEFAULT_TEAMMATES);
      onSaveTeammates(DEFAULT_TEAMMATES);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-3.5 animate-in zoom-in-95 duration-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Administrar Equipo
              </h3>
              <p className="text-xs text-neutral-500 font-sans">
                {teamList.length} integrantes cargados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-base leading-none"
          >
            ✕
          </button>
        </div>

        {/* Team Name Input */}
        <div className="shrink-0 space-y-1 font-sans">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Nombre del equipo:
          </label>
          <input
            id="manage-team-name-input"
            type="text"
            value={currentName}
            onChange={handleTeamNameChange}
            placeholder="Ej: Dev Team"
            className="w-full text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
          />
        </div>

        {/* Add new teammate form */}
        <form onSubmit={handleAddMember} className="shrink-0 space-y-1 font-sans">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Agregar nuevo integrante:
          </label>
          <div className="flex items-center gap-1.5 font-mono">
            <input
              id="new-member-name-input"
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Nombre del compañero..."
              className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
            />
            <button
              id="add-member-btn"
              type="submit"
              disabled={!newMemberName.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 disabled:opacity-30 font-semibold text-xs shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </button>
          </div>
        </form>

        {/* Scrollable list of members */}
        <div className="flex-1 overflow-y-auto space-y-1.5 p-1 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 max-h-52 font-mono">
          {teamList.map((t, idx) => (
            <div
              key={t.id}
              className="p-1.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 text-xs"
            >
              {editingId === t.id ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-0.5 text-xs rounded border border-neutral-900 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(t.id)}
                    className="p-1 text-neutral-900 dark:text-white rounded"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="p-1 text-neutral-400 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] text-neutral-400 font-mono w-4">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] text-neutral-800 dark:text-neutral-200 select-none shrink-0">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {t.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(t)}
                      className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded"
                      title="Editar nombre"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(t.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                      title="Eliminar compañero"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="shrink-0 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 font-sans">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer lista original</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

