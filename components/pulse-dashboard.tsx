'use client';

import { useEffect, useMemo, useState } from 'react';
import { HistoryPanel } from './history-panel';
import { SettingsModal } from './settings-modal';
import { TranscriptionPanel } from './transcription-panel';
import {
  createHistoryEntry,
  defaultConnections,
  isConfigured,
  readConnections,
  readLocalHistory,
  type PulseConnections,
  type PulseHistoryEntry,
  writeConnections,
  writeLocalHistory
} from '../lib/pulse-settings';
import { syncConvexHistory } from '../lib/convex-history';

const highlights = ['Decentralized setup', 'Neon pink on black design', 'PWA-first recording experience'];

const featureCards = [
  {
    title: 'Connections modal',
    body: 'Save your Convex URL and Composio key locally so each user can ship with their own backend.'
  },
  {
    title: 'Recording pill',
    body: 'The mic indicator glows only while audio capture is active and stays tuned for PWA use.'
  },
  {
    title: 'History sync',
    body: 'Transcript sessions can be mirrored to Convex while keeping a local cache for resilience.'
  }
];

export function PulseDashboard() {
  const [connections, setConnections] = useState<PulseConnections>(defaultConnections);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localHistory, setLocalHistory] = useState<PulseHistoryEntry[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setConnections(readConnections());
    setLocalHistory(readLocalHistory());
  }, []);

  useEffect(() => {
    writeLocalHistory(localHistory);
  }, [localHistory]);

  const connectionSummary = useMemo(() => {
    return {
      hasConvex: Boolean(connections.convexUrl.trim()),
      hasComposio: Boolean(connections.composioApiKey.trim()),
      ready: isConfigured(connections)
    };
  }, [connections]);

  function handleSaveConnections(nextConnections: PulseConnections) {
    setConnections(nextConnections);
    writeConnections(nextConnections);
    setSaveMessage('Connections saved locally.');
    setIsSettingsOpen(false);
  }

  async function handleTranscriptCaptured(result: {
    text: string;
    status: 'completed' | 'queued';
    language?: string;
    confidence?: number | null;
  }) {
    const entry = createHistoryEntry(result);
    setLocalHistory((current) => [entry, ...current].slice(0, 24));

    if (connections.convexUrl.trim()) {
      try {
        await syncConvexHistory(connections.convexUrl, entry);
      } catch {
        setSaveMessage('Transcript saved locally; Convex sync will retry when the endpoint is available.');
      }
    }
  }

  return (
    <main>
      <div className="shell">
        <section className="hero hero-grid">
          <div>
            <span className="kicker">Pulse / transcription cockpit</span>
            <h1>Record, sync, and ship in neon.</h1>
            <p className="hero-copy">
              Pulse is a high-end Next.js PWA for decentralized transcription workflows, shaped with a glossy black canvas, electric pink accents, and user-owned connections.
            </p>
            <div className="badges">
              {highlights.map((item) => (
                <span className="badge" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <a className="cta" href="#transcription">
                Open studio
              </a>
              <button className="ghost-button" type="button" onClick={() => setIsSettingsOpen(true)}>
                Connections
              </button>
            </div>
            {saveMessage ? <p className="inline-note">{saveMessage}</p> : null}
          </div>

          <div className="hero-aside">
            <div className="status-panel">
              <span className="kicker">Now live</span>
              <h2>Designed for audio-first workflows.</h2>
              <p>
                Connect your own Convex database and Composio key, then record directly from the browser with a mic-aware pill that activates only when audio is live.
              </p>
              <div className="connection-stats">
                <span className={`stat-pill ${connectionSummary.hasConvex ? 'on' : 'off'}`}>Convex {connectionSummary.hasConvex ? 'connected' : 'missing'}</span>
                <span className={`stat-pill ${connectionSummary.hasComposio ? 'on' : 'off'}`}>Composio {connectionSummary.hasComposio ? 'connected' : 'missing'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-grid" id="features">
          {featureCards.map((card) => (
            <article className="feature-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </section>

        <section className="grid" id="transcription">
          <div className="card transcription">
            <TranscriptionPanel
              connections={connections}
              onTranscriptCaptured={handleTranscriptCaptured}
            />
          </div>

          <HistoryPanel convexUrl={connections.convexUrl} localEntries={localHistory} />
        </section>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        initialConnections={connections}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveConnections}
      />
    </main>
  );
}
