import { normalizeConvexUrl, type PulseHistoryEntry } from './pulse-settings';

export async function loadConvexHistory(convexUrl: string) {
  const baseUrl = normalizeConvexUrl(convexUrl);
  if (!baseUrl) {
    return [] as PulseHistoryEntry[];
  }

  const response = await fetch(`${baseUrl}/api/history`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Convex history request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as
    | PulseHistoryEntry[]
    | { entries?: PulseHistoryEntry[] }
    | { history?: PulseHistoryEntry[] };

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.entries ?? payload.history ?? [];
}

export async function syncConvexHistory(convexUrl: string, entry: PulseHistoryEntry) {
  const baseUrl = normalizeConvexUrl(convexUrl);
  if (!baseUrl) {
    return;
  }

  const response = await fetch(`${baseUrl}/api/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  });

  if (!response.ok) {
    throw new Error(`Convex history sync failed with status ${response.status}.`);
  }
}
