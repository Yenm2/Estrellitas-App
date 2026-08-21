import React, { useState } from 'react';
import { Star, MessageSquare, Plus, Minus, CheckCircle2, HelpCircle, Zap, AlertCircle, CircleSlash } from 'lucide-react';
import { Teammate, TeammateRating, StatusOption, FormatStyle } from '../types';
import { STATUS_OPTIONS, getStatusOption, formatSingleLine, formatStarsDisplay } from '../utils/storage';
import { playStarSound, playMoodSound, triggerVibrate } from '../utils/audio';

interface TeammateCardProps {
  teammate: Teammate;
  rating: TeammateRating;
  onUpdateRating: (updated: TeammateRating) => void;
  soundEnabled: boolean;
  formatStyle: FormatStyle;
}

export const TeammateCard: React.FC<TeammateCardProps> = ({
  teammate,
  rating,
  onUpdateRating,
  soundEnabled,
  formatStyle,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(Boolean(rating.note));

  const currentStatus = getStatusOption(rating.statusId || rating.statusTag);

  const handleStatusSelect = (status: StatusOption) => {
    if (soundEnabled) {
      playMoodSound(status.id !== 'apoyo' && status.id !== 'bloqueo');
    }
    triggerVibrate(15);
    onUpdateRating({
      ...rating,
      statusId: status.id,
      statusTag: status.tag,
    });
  };

  const handleStarClick = (starsCount: number) => {
    const newStars = rating.stars === starsCount ? Math.max(0, starsCount - 1) : starsCount;
    if (soundEnabled && newStars > 0) {
      playStarSound(newStars);
    }
    triggerVibrate(12);
    onUpdateRating({
      ...rating,
      stars: newStars,
    });
  };

  const handleIncrementStars = () => {
    const nextStars = Math.min(5, (rating.stars || 0) + 1);
    if (soundEnabled) playStarSound(nextStars);
    triggerVibrate(15);
    onUpdateRating({ ...rating, stars: nextStars });
  };

  const handleDecrementStars = () => {
    const nextStars = Math.max(0, (rating.stars || 0) - 1);
    triggerVibrate(10);
    onUpdateRating({ ...rating, stars: nextStars });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRating({
      ...rating,
      note: e.target.value,
    });
  };

  const liveFormattedLine = formatSingleLine(
    teammate.name,
    currentStatus.id,
    rating.stars,
    rating.note,
    formatStyle
  );

  const getBorderAccent = (statusId: string) => {
    switch (statusId) {
      case 'ok': return 'border-l-4 border-l-emerald-500';
      case 'apoyo': return 'border-l-4 border-l-amber-500';
      case 'foco': return 'border-l-4 border-l-indigo-500';
      case 'bloqueo': return 'border-l-4 border-l-rose-500';
      default: return 'border-l-4 border-l-neutral-200 dark:border-l-neutral-800';
    }
  };

  const getAvatarStyles = (statusId: string) => {
    switch (statusId) {
      case 'ok': return 'bg-emerald-500 text-white';
      case 'apoyo': return 'bg-amber-500 text-white';
      case 'foco': return 'bg-indigo-500 text-white';
      case 'bloqueo': return 'bg-rose-500 text-white';
      default: return 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900';
    }
  };

  const getStatusStyles = (statusId: string, isSelected: boolean) => {
    if (!isSelected) {
      switch (statusId) {
        case 'ok':
          return 'border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/10';
        case 'apoyo':
          return 'border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:border-amber-300 dark:hover:border-amber-800 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/10 dark:hover:bg-amber-950/10';
        case 'foco':
          return 'border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:border-indigo-300 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10';
        case 'bloqueo':
          return 'border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:border-rose-300 dark:hover:border-rose-800 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/10 dark:hover:bg-rose-950/10';
        default:
          return 'border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-650';
      }
    }
    switch (statusId) {
      case 'ok':
        return 'border-emerald-500 bg-emerald-500 text-white dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-500 font-bold';
      case 'apoyo':
        return 'border-amber-500 bg-amber-500 text-white dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-500 font-bold';
      case 'foco':
        return 'border-indigo-500 bg-indigo-500 text-white dark:bg-indigo-950/80 dark:text-indigo-400 dark:border-indigo-500 font-bold';
      case 'bloqueo':
        return 'border-rose-500 bg-rose-500 text-white dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-500 font-bold';
      default:
        return 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold';
    }
  };

  const renderStatusIcon = (iconName: string, isSelected: boolean, className: string = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'check':
        return <CheckCircle2 className={`${className} ${isSelected ? '' : 'text-emerald-500'}`} />;
      case 'help':
        return <HelpCircle className={`${className} ${isSelected ? '' : 'text-amber-500'}`} />;
      case 'zap':
        return <Zap className={`${className} ${isSelected ? '' : 'text-indigo-500'}`} />;
      case 'alert':
        return <AlertCircle className={`${className} ${isSelected ? '' : 'text-rose-500'}`} />;
      default:
        return <CircleSlash className={className} />;
    }
  };

  return (
    <div
      id={`teammate-card-${teammate.id}`}
      className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3.5 sm:p-4 font-mono transition-all hover:border-neutral-400 dark:hover:border-neutral-700 shadow-2xs ${getBorderAccent(currentStatus.id)}`}
    >
      {/* Header: Avatar, Name & Live Format Preview */}
      <div className="flex items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs select-none shrink-0 shadow-2xs transition-colors duration-200 ${getAvatarStyles(currentStatus.id)}`}>
            {teammate.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate tracking-tight">
              {teammate.name}
            </h3>
            {teammate.role && (
              <span className="text-[11px] text-neutral-500 block">
                {teammate.role}
              </span>
            )}
          </div>
        </div>

        {/* Live Output Preview badge */}
        <div
          className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 shrink-0 text-neutral-800 dark:text-neutral-200 text-xs select-all cursor-default max-w-[200px] truncate"
          title="Vista previa del texto que se copiará"
        >
          <span className="font-medium truncate">{liveFormattedLine}</span>
        </div>
      </div>

      {/* Status Selector */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-5 gap-1">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = currentStatus.id === status.id;
            return (
              <button
                key={status.id}
                type="button"
                id={`status-btn-${teammate.id}-${status.id}`}
                onClick={() => handleStatusSelect(status)}
                className={`py-1.5 px-1 flex flex-col items-center justify-center rounded-lg border text-[10px] transition-all ${getStatusStyles(status.id, isSelected)}`}
                title={status.shortLabel}
              >
                <span className="mb-0.5">
                  {renderStatusIcon(status.iconName, isSelected)}
                </span>
                <span className="truncate max-w-full font-semibold">
                  {status.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Star Rating Section */}
      <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300">
            <span>Desempeño</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              {rating.stars} ★
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDecrementStars}
              disabled={rating.stars === 0}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              title="Quitar estrella"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleIncrementStars}
              disabled={rating.stars === 5}
              className="p-1 rounded-md text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              title="Agregar estrella"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5 Interactive Stars */}
        <div className="grid grid-cols-5 gap-1.5 mt-2">
          {[1, 2, 3, 4, 5].map((starNum) => {
            const isFilled = starNum <= rating.stars;
            return (
              <button
                key={starNum}
                type="button"
                id={`star-btn-${teammate.id}-${starNum}`}
                onClick={() => handleStarClick(starNum)}
                className={`py-1.5 rounded-md border flex items-center justify-center gap-1 text-xs transition-all ${
                  isFilled
                    ? 'bg-amber-500 text-white dark:bg-amber-950/80 dark:text-amber-400 border-amber-500 dark:border-amber-500 font-bold'
                    : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:border-amber-300 dark:hover:border-amber-800'
                }`}
                title={`${starNum} estrellas`}
                aria-label={`Calificar con ${starNum} estrellas a ${teammate.name}`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isFilled
                      ? 'fill-current text-white dark:text-amber-400'
                      : 'text-neutral-300 dark:text-neutral-700'
                  }`}
                />
                <span className="text-[11px] font-medium">{starNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note / Feedback Comment Toggle & Input */}
      <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
        {!showNoteInput && !rating.note ? (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors py-0.5"
          >
            <MessageSquare className="w-3 h-3" />
            <span>+ Agregar nota</span>
          </button>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-neutral-500" />
                Nota opcional
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!rating.note) setShowNoteInput(false);
                  else setShowNoteInput(!showNoteInput);
                }}
                className="text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                {showNoteInput ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {showNoteInput && (
              <input
                id={`note-input-${teammate.id}`}
                type="text"
                value={rating.note || ''}
                onChange={handleNoteChange}
                placeholder="Ej: Excelente apoyo en el sprint, resolvió dudas..."
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};


