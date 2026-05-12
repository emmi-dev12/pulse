'use client';

import { useEffect, useState } from 'react';
import { loadConvexHistory } from '../lib/convex-history';
import { type PulseHistoryEntry, readLocalHistory } from '../lib/pulse-settings';

export function HistoryPanel(props: { convexUrl: string; localEntries: PulseHistoryEntry[] }) {
  const [remoteEntries, setRemoteEntries] = useState<PulseHistoryEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      if (!props.convexUrl.trim()) {
        setRemoteEntries([]);
        setStatus('idle');
        setErrorMessage(null);
        return;
      }

      setStatus('loading');
      setErrorMessage(null);

      try {
        const entries = await loadConvexHistory(props.convexUrl);
        if (!active) {
          return;
        }
        setRemoteEntries(entries);
        setStatus('ready');
      } catch (error) {
        if (!active) {
          return;
        }
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'History could not be loaded.');
        setRemoteEntries([]);
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, [props.convexUrl]);

  const mergedEntries = [...props.localEntries, ...remoteEntries].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <section className="card history-card">
      <div className="history-header">
        <div>
          <span className="kicker">History</span>
          <h2>Session timeline</h2>
        </div>
        <span className={`history-status ${status}`}>{status === 'loading' ? 'Syncing' : status === 'error' ? 'Needs attention' : status === 'ready' ? 'Live' : 'Idle'}</span>
      </div>

      <p>
        {props.convexUrl.trim()
          ? 'Convex history is connected through your saved deployment URL.'
          : 'Add a Convex database URL in Connections to load your remote history.'}
      </p>

      {errorMessage ? <p className="history-error">{errorMessage}</p> : null}

      <div className="history-list">
        {mergedEntries.length ? (
          mergedEntries.map((entry) => (
            <article className="history-item" key={entry.id}>
              <div className="history-item-top">
                <span>{entry.status}</span>
                <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
              </div>
              <p>{entry.text}</p>
            </article>
          ))
        ) : (
          <div className="history-empty">
            No transcripts yet. Start a recording to populate the timeline.
          </div>
        )}
      </div>
    </section>
  );
}
