import React, { useState } from 'react';
import { Send, Star, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound, triggerVibrate } from '../utils/audio';

interface FeedbackActionBarProps {
  totalStars: number;
  activeCount: number;
  needHelpCount: number;
  onSendFeedback: (generalNote?: string) => void;
  soundEnabled: boolean;
  previewText: string;
}

export const FeedbackActionBar: React.FC<FeedbackActionBarProps> = ({
  totalStars,
  activeCount,
  needHelpCount,
  onSendFeedback,
  soundEnabled,
  previewText,
}) => {
  const [generalNote, setGeneralNote] = useState('');
  const [showNoteField, setShowNoteField] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    triggerVibrate([30, 50, 60]);

    if (soundEnabled) {
      playSuccessSound();
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#000000', '#525252', '#a3a3a3', '#f59e0b', '#ffffff'],
      });
    } catch {
      // Ignore
    }

    onSendFeedback(generalNote.trim() || undefined);
    setGeneralNote('');
    setShowNoteField(false);
    setJustSubmitted(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setJustSubmitted(false);
    }, 2800);
  };

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 z-30 bg-[#fafafa]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 p-2.5 sm:p-3 font-mono text-xs shadow-xs">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Optional Session Note Input */}
          {showNoteField && (
            <div className="bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-1.5 font-sans">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Resumen o nota general de la sesión (opcional):
              </label>
              <input
                id="general-session-note-input"
                type="text"
                value={generalNote}
                onChange={(e) => setGeneralNote(e.target.value)}
                placeholder="Ej: Cierre de jornada - buen ritmo de entregas y avance..."
                className="w-full text-xs px-2.5 py-1.5 rounded-md bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-mono"
              />
            </div>
          )}

          {/* Main Action Bar Row */}
          <div className="flex items-center justify-between gap-2.5">
            {/* Quick Metrics & Note Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Star className="w-4 h-4 fill-current text-current" />
                <span className="font-bold">{totalStars} Estrellas</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                <span>[OK]: {activeCount}</span>
                {needHelpCount > 0 && (
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">[Alerta/Apoyo]: {needHelpCount}</span>
                )}
              </div>

              <button
                type="button"
                id="toggle-session-note-btn"
                onClick={() => setShowNoteField(!showNoteField)}
                className={`px-2.5 py-1.5 rounded-md border text-xs transition-colors hidden sm:flex items-center gap-1.5 font-sans ${
                  showNoteField || generalNote
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white font-medium'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
                title="Agregar nota general a la entrega"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showNoteField ? 'Ocultar nota' : '+ Nota general'}</span>
              </button>
            </div>

            {/* Submit & Preview Buttons */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                type="button"
                id="view-live-preview-btn"
                onClick={() => setShowPreviewModal(true)}
                className="text-xs px-2.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shrink-0 font-sans font-medium"
                title="Ver lista de texto antes de guardar"
              >
                Vista previa
              </button>

              <button
                id="submit-feedback-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg font-sans font-bold text-xs transition-all active:scale-98 border ${
                  justSubmitted
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white'
                    : 'bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-950 hover:opacity-90 border-neutral-900 dark:border-white'
                }`}
              >
                {justSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Guardado con éxito!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Guardar Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Text Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-xs font-mono">
          <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-md w-full p-4 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-3 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-sans">
                Vista previa del Feedback
              </h3>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 px-1 text-base leading-none"
              >
                ✕
              </button>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-950 rounded-lg p-3 border border-neutral-200 dark:border-neutral-800 font-mono whitespace-pre-wrap text-neutral-900 dark:text-neutral-100 select-all max-h-64 overflow-y-auto leading-relaxed">
              {previewText}
            </div>

            <p className="text-[11px] text-neutral-500 font-sans">
              Texto formateado listo para copiar y enviar por Slack, Teams o WhatsApp.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1 font-sans">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-3.5 py-1.5 text-xs rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

