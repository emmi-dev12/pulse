'use client';

import { useEffect, useState } from 'react';
import { defaultConnections, type PulseConnections } from '../lib/pulse-settings';

export function SettingsModal(props: {
  isOpen: boolean;
  initialConnections: PulseConnections;
  onClose: () => void;
  onSave: (connections: PulseConnections) => void;
}) {
  const [draft, setDraft] = useState<PulseConnections>(props.initialConnections);

  useEffect(() => {
    setDraft(props.initialConnections);
  }, [props.initialConnections, props.isOpen]);

  if (!props.isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={props.onClose}>
      <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="kicker">Connections</span>
            <h2 id="settings-title">Set up your decentralized workspace</h2>
          </div>
          <button className="ghost-button" type="button" onClick={props.onClose}>
            Close
          </button>
        </div>

        <p className="modal-copy">
          Add your Convex deployment URL and Composio API key. Pulse stores both in localStorage and uses them for history sync and transcription.
        </p>

        <div className="form-grid">
          <label className="field">
            <span>Convex database URL</span>
            <input
              value={draft.convexUrl}
              onChange={(event) => setDraft((current) => ({ ...current, convexUrl: event.target.value }))}
              placeholder="https://your-app.convex.cloud"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Composio API key</span>
            <input
              value={draft.composioApiKey}
              onChange={(event) => setDraft((current) => ({ ...current, composioApiKey: event.target.value }))}
              placeholder="comp_..."
              type="password"
              autoComplete="off"
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={() => setDraft(defaultConnections)}>
            Reset
          </button>
          <button className="cta" type="button" onClick={() => props.onSave(draft)}>
            Save connections
          </button>
        </div>
      </div>
    </div>
  );
}
