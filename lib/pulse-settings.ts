export type PulseConnections = {
  convexUrl: string;
  composioApiKey: string;
};

export type PulseHistoryEntry = {
  id: string;
  text: string;
  createdAt: string;
  source: 'recording';
  status: 'completed' | 'queued';
  language: string;
  confidence: number | null;
};

export const PULSE_CONNECTIONS_KEY = 'pulse.connections';
export const PULSE_HISTORY_KEY = 'pulse.history';

export const defaultConnections: PulseConnections = {
  convexUrl: '',
  composioApiKey: ''
};

export function normalizeConvexUrl(url: string) {
  return url.trim().replace(/\/+$/, '');
}

export function isConfigured(connections: PulseConnections) {
  return Boolean(connections.convexUrl.trim() && connections.composioApiKey.trim());
}

export function createHistoryEntry(params: {
  text: string;
  status?: 'completed' | 'queued';
  language?: string;
  confidence?: number | null;
}): PulseHistoryEntry {
  return {
    id: crypto.randomUUID(),
    text: params.text.trim(),
    createdAt: new Date().toISOString(),
    source: 'recording',
    status: params.status ?? 'completed',
    language: params.language ?? 'en',
    confidence: params.confidence ?? null
  };
}

export function readConnections(): PulseConnections {
  if (typeof window === 'undefined') {
    return defaultConnections;
  }

  try {
    const raw = window.localStorage.getItem(PULSE_CONNECTIONS_KEY);
    if (!raw) {
      return defaultConnections;
    }

    const parsed = JSON.parse(raw) as Partial<PulseConnections>;
    return {
      convexUrl: typeof parsed.convexUrl === 'string' ? parsed.convexUrl : '',
      composioApiKey: typeof parsed.composioApiKey === 'string' ? parsed.composioApiKey : ''
    };
  } catch {
    return defaultConnections;
  }
}

export function writeConnections(connections: PulseConnections) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PULSE_CONNECTIONS_KEY, JSON.stringify(connections));
}

export function readLocalHistory(): PulseHistoryEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PULSE_HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as PulseHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalHistory(entries: PulseHistoryEntry[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PULSE_HISTORY_KEY, JSON.stringify(entries));
}
