export interface Teammate {
  id: string;
  name: string;
  avatarColor?: string;
  role?: string;
}

export type FormatStyle = 'tags' | 'stars_only' | 'text';

export type StatusKey = 'ok' | 'apoyo' | 'foco' | 'bloqueo' | 'ninguno';

export interface StatusOption {
  id: string;
  tag: string; // e.g. [OK]
  label: string; // e.g. OK / Activo
  shortLabel: string;
  iconName: 'check' | 'help' | 'zap' | 'alert' | 'none';
  color: string;
}

export interface TeammateRating {
  teammateId: string;
  teammateName: string;
  statusId: string; // 'ok' | 'apoyo' | 'foco' | 'bloqueo' | 'ninguno'
  statusTag: string; // '[OK]', '[APOYO]', etc.
  moodEmoji?: string; // backwards compatibility
  stars: number; // 0 to 5
  note?: string;
}

export interface FeedbackSubmission {
  id: string;
  timestamp: number;
  dateString: string;
  ratings: TeammateRating[];
  generalNote?: string;
  totalStars: number;
  formatStyle?: FormatStyle;
}


