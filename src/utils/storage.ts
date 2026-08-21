import { Teammate, StatusOption, FeedbackSubmission, FormatStyle } from '../types';

export const DEFAULT_TEAMMATES: Teammate[] = [
  { id: '1', name: 'Anjel', avatarColor: 'bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '2', name: 'David', avatarColor: 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '3', name: 'Fer', avatarColor: 'bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '4', name: 'Hector', avatarColor: 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '5', name: 'Isaac', avatarColor: 'bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '6', name: 'Lalo', avatarColor: 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '7', name: 'Luis', avatarColor: 'bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '8', name: 'Pablo', avatarColor: 'bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 border border-neutral-700/40' },
  { id: '9', name: 'Rebeca', avatarColor: 'bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border border-neutral-700/40' },
];

export const STATUS_OPTIONS: StatusOption[] = [
  {
    id: 'ok',
    tag: '[OK]',
    label: 'OK',
    shortLabel: 'Activo / Buen ritmo',
    iconName: 'check',
    color: 'border-neutral-900 dark:border-white',
  },
  {
    id: 'apoyo',
    tag: '[APOYO]',
    label: 'Apoyo',
    shortLabel: 'Requiere soporte / Alerta',
    iconName: 'help',
    color: 'border-neutral-900 dark:border-white',
  },
  {
    id: 'foco',
    tag: '[FOCO]',
    label: 'En Foco',
    shortLabel: 'Alta concentración',
    iconName: 'zap',
    color: 'border-neutral-900 dark:border-white',
  },
  {
    id: 'bloqueo',
    tag: '[BLOQUEADO]',
    label: 'Bloqueado',
    shortLabel: 'En espera / Impedido',
    iconName: 'alert',
    color: 'border-neutral-900 dark:border-white',
  },
  {
    id: 'ninguno',
    tag: '',
    label: 'Sin etiqueta',
    shortLabel: 'Solo estrellas',
    iconName: 'none',
    color: 'border-neutral-300 dark:border-neutral-700',
  },
];

const STORAGE_KEYS = {
  TEAMMATES: 'teamstars_teammates_v2',
  HISTORY: 'teamstars_history_v2',
  SOUND_ENABLED: 'teamstars_sound_v2',
  TEAM_NAME: 'teamstars_team_name_v2',
  SETUP_COMPLETED: 'teamstars_setup_completed_v2',
  FORMAT_STYLE: 'teamstars_format_style_v2',
};

export const DEFAULT_TEAM_NAME = 'Equipo de Desarrollo';

export function getStoredFormatStyle(): FormatStyle {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FORMAT_STYLE) as FormatStyle | null;
    if (raw === 'tags' || raw === 'stars_only' || raw === 'text') return raw;
  } catch {
    // Ignore
  }
  return 'tags'; // Default format: [OK] ★★★★★
}

export function saveStoredFormatStyle(style: FormatStyle): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FORMAT_STYLE, style);
  } catch {
    // Ignore
  }
}

export function getStatusOption(statusIdOrTag?: string): StatusOption {
  if (!statusIdOrTag) return STATUS_OPTIONS[0];
  const found = STATUS_OPTIONS.find(
    (s) => s.id === statusIdOrTag || s.tag === statusIdOrTag || s.label.toLowerCase() === statusIdOrTag.toLowerCase()
  );
  if (found) return found;
  // Fallback for old emojis
  if (statusIdOrTag === '☀️' || statusIdOrTag === 'sun') return STATUS_OPTIONS[0];
  if (statusIdOrTag === '😔' || statusIdOrTag === 'sad') return STATUS_OPTIONS[1];
  if (statusIdOrTag === '🔥' || statusIdOrTag === 'fire' || statusIdOrTag === 'rocket') return STATUS_OPTIONS[2];
  return STATUS_OPTIONS[0];
}

export function formatStarsDisplay(stars: number): string {
  if (stars <= 0) return '';
  return '★'.repeat(stars);
}

export function formatSingleLine(
  name: string,
  statusIdOrTag: string,
  stars: number,
  note?: string,
  formatStyle: FormatStyle = 'tags'
): string {
  const status = getStatusOption(statusIdOrTag);
  const starsString = formatStarsDisplay(stars);
  const parts: string[] = [name];

  if (formatStyle === 'tags') {
    if (status.tag) parts.push(status.tag);
  } else if (formatStyle === 'text') {
    if (status.id !== 'ninguno') parts.push(`(${status.label})`);
  }
  // If 'stars_only', we skip status tag

  if (starsString) {
    parts.push(starsString);
  }

  if (note && note.trim()) {
    parts.push(`(${note.trim()})`);
  }

  return parts.join(' ');
}

export function getStoredTeamName(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAM_NAME);
    if (raw && raw.trim()) return raw.trim();
  } catch (e) {
    console.error('Error loading team name', e);
  }
  return DEFAULT_TEAM_NAME;
}

export function saveStoredTeamName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAM_NAME, name);
  } catch (e) {
    console.error('Error saving team name', e);
  }
}

export function getIsSetupCompleted(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETUP_COMPLETED);
    return raw !== null ? JSON.parse(raw) : false;
  } catch {
    return false;
  }
}

export function setSetupCompleted(completed: boolean = true): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETUP_COMPLETED, JSON.stringify(completed));
  } catch {
    // Ignore
  }
}

// Initial sample history with clean status badges and stars
export const INITIAL_SAMPLE_HISTORY: FeedbackSubmission[] = [
  {
    id: 'sample-1',
    timestamp: Date.now() - 86400000 * 1, // yesterday
    dateString: new Date(Date.now() - 86400000 * 1).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    ratings: [
      { teammateId: '1', teammateName: 'Anjel', statusId: 'ok', statusTag: '[OK]', stars: 3, note: 'Muy puntual y apoyó en las entregas.' },
      { teammateId: '2', teammateName: 'David', statusId: 'apoyo', statusTag: '[APOYO]', stars: 1, note: 'Tuvo complicaciones con el equipo, necesita apoyo.' },
      { teammateId: '3', teammateName: 'Fer', statusId: 'foco', statusTag: '[FOCO]', stars: 5, note: 'Excelente cierre de sprint y resolvió bloqueos.' },
      { teammateId: '4', teammateName: 'Hector', statusId: 'ok', statusTag: '[OK]', stars: 2, note: 'Buen seguimiento en las tareas asignadas.' },
      { teammateId: '5', teammateName: 'Isaac', statusId: 'ok', statusTag: '[OK]', stars: 2, note: 'Muy participativo.' },
      { teammateId: '6', teammateName: 'Lalo', statusId: 'apoyo', statusTag: '[APOYO]', stars: 1, note: 'Día pesado con incidencias.' },
      { teammateId: '7', teammateName: 'Luis', statusId: 'ok', statusTag: '[OK]', stars: 2, note: 'Aportó ideas clave.' },
      { teammateId: '8', teammateName: 'Pablo', statusId: 'apoyo', statusTag: '[APOYO]', stars: 1, note: 'Se sintió con sobrecarga de trabajo.' },
      { teammateId: '9', teammateName: 'Rebeca', statusId: 'ok', statusTag: '[OK]', stars: 3, note: 'Gran atención al detalle y orden.' },
    ],
    generalNote: 'Evaluación del cierre diario de actividades',
    totalStars: 20,
    formatStyle: 'tags',
  },
];


export function getStoredTeammates(): Teammate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAMMATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading teammates', e);
  }
  return DEFAULT_TEAMMATES;
}

export function saveStoredTeammates(teammates: Teammate[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAMMATES, JSON.stringify(teammates));
  } catch (e) {
    console.error('Error saving teammates', e);
  }
}

export function getStoredHistory(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading history', e);
  }
  return INITIAL_SAMPLE_HISTORY;
}

export function saveStoredHistory(history: FeedbackSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history', e);
  }
}

export function getStoredSoundPreference(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return raw !== null ? JSON.parse(raw) : true;
  } catch {
    return true;
  }
}

export function saveStoredSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(enabled));
  } catch {
    // Ignore
  }
}
