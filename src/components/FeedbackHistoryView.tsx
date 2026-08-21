import React, { useState } from 'react';
import {
  Calendar,
  Star,
  Trash2,
  Copy,
  Check,
  Search,
  FileSpreadsheet,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';
import { FeedbackSubmission, FormatStyle } from '../types';
import { formatSingleLine, getStatusOption } from '../utils/storage';

interface FeedbackHistoryViewProps {
  history: FeedbackSubmission[];
  formatStyle: FormatStyle;
  onDeleteSubmission: (id: string) => void;
  onClearAllHistory: () => void;
  onLoadAsCurrentDraft: (submission: FeedbackSubmission) => void;
}

export const FeedbackHistoryView: React.FC<FeedbackHistoryViewProps> = ({
  history,
  formatStyle,
  onDeleteSubmission,
  onClearAllHistory,
  onLoadAsCurrentDraft,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(history[0]?.id || null);

  const handleCopySubmission = (submission: FeedbackSubmission) => {
    const styleToUse = submission.formatStyle || formatStyle;
    const lines = submission.ratings.map((r) => {
      const statusIdentifier = r.statusId || r.statusTag || r.moodEmoji || 'ok';
      return formatSingleLine(r.teammateName, statusIdentifier, r.stars, r.note, styleToUse);
    });

    const header = `Feedback: ${submission.dateString}`;
    const starsSummary = `Total Estrellas: ${submission.totalStars}★`;
    const noteText = submission.generalNote ? `\nNota general: ${submission.generalNote}` : '';
    const fullText = `${header}\n${starsSummary}\n\n${lines.join('\n')}${noteText}`;

    navigator.clipboard.writeText(fullText);
    setCopiedId(submission.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,ID,Fecha,Companero,Estado,Estrellas,Nota_Individual,Nota_General\n';

    history.forEach((sub) => {
      sub.ratings.forEach((r) => {
        const status = getStatusOption(r.statusId || r.statusTag || r.moodEmoji);
        const row = [
          `"${sub.id}"`,
          `"${sub.dateString}"`,
          `"${r.teammateName.replace(/"/g, '""')}"`,
          `"${status.label}"`,
          r.stars,
          `"${(r.note || '').replace(/"/g, '""')}"`,
          `"${(sub.generalNote || '').replace(/"/g, '""')}"`,
        ].join(',');
        csvContent += row + '\n';
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `feedback_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter((sub) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const matchesDate = sub.dateString.toLowerCase().includes(q);
    const matchesNote = (sub.generalNote || '').toLowerCase().includes(q);
    const matchesMember = sub.ratings.some(
      (r) =>
        r.teammateName.toLowerCase().includes(q) ||
        (r.note || '').toLowerCase().includes(q)
    );
    return matchesDate || matchesNote || matchesMember;
  });

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Top filter & actions header */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="history-search-input"
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar en el historial (fecha, compañero, nota)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="export-csv-btn"
              type="button"
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 disabled:opacity-30 transition-colors font-semibold"
              title="Descargar historial en CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-500" />
              <span>Exportar CSV</span>
            </button>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Eliminar todos los registros del historial?')) {
                    onClearAllHistory();
                  }
                }}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 transition-colors"
                title="Limpiar todo el historial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center space-y-2 font-sans">
          <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
            No hay registros en el historial
          </p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {searchFilter
              ? 'No se encontraron resultados para esta búsqueda.'
              : 'Cuando guardes una sesión de feedback, aparecerá registrada aquí.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHistory.map((submission) => {
            const isExpanded = expandedId === submission.id;
            const isCopied = copiedId === submission.id;

            return (
              <div
                key={submission.id}
                id={`history-entry-${submission.id}`}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all shadow-2xs hover:border-neutral-400 dark:hover:border-neutral-700"
              >
                {/* Header summary row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                  className="p-3 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {submission.dateString}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-sans mt-0.5">
                        <span>{submission.ratings.length} integrantes</span>
                        {submission.generalNote && (
                          <>
                            <span>•</span>
                            <span className="truncate italic max-w-[180px] sm:max-w-xs text-neutral-700 dark:text-neutral-300">
                              "{submission.generalNote}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current text-current" />
                      <span>{submission.totalStars} ★</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySubmission(submission);
                      }}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isCopied
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                      }`}
                      title="Copiar contenido al portapapeles"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <div className="text-neutral-400 p-0.5">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Breakdown */}
                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2.5">
                    {/* General note if exists */}
                    {submission.generalNote && (
                      <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-1.5 font-sans">
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                        <span>{submission.generalNote}</span>
                      </div>
                    )}

                    {/* Breakdown of each team member */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                      {submission.ratings.map((r, idx) => {
                        const status = getStatusOption(r.statusId || r.statusTag || r.moodEmoji);
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                <span>{r.teammateName}</span>
                                {status.tag && (
                                  <span className="font-bold text-[11px] px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                    {status.tag}
                                  </span>
                                )}
                              </div>
                              {r.note && (
                                <p className="text-[11px] text-neutral-500 mt-0.5 truncate font-sans">
                                  {r.note}
                                </p>
                              )}
                            </div>
                            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
                              {r.stars > 0 ? '★'.repeat(r.stars) : '0★'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Actions for this Entry */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800/80 text-xs font-sans">
                      <button
                        type="button"
                        onClick={() => onLoadAsCurrentDraft(submission)}
                        className="text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white flex items-center gap-1 font-semibold"
                        title="Cargar esta configuración en el editor actual"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Cargar como borrador</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('¿Eliminar esta entrada del historial?')) {
                            onDeleteSubmission(submission.id);
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

