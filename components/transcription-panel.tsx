'use client';

import { useMemo, useState } from 'react';

export function TranscriptionPanel() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing'>('idle');
  const [transcript, setTranscript] = useState('');

  const label = useMemo(() => {
    if (status === 'recording') return 'Recording live input...';
    if (status === 'processing') return 'Processing through Gladia...';
    return 'Ready for transcription.';
  }, [status]);

  async function startMockSession() {
    setStatus('recording');
    setTranscript('');
    setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setTranscript('This is a Pulse transcription session ready to be wired to Gladia.');
        setStatus('idle');
      }, 1100);
    }, 900);
  }

  return (
    <div>
      <span className="kicker">Transcription</span>
      <h2 style={{ marginTop: 8 }}>Studio panel</h2>
      <p>{label}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <button className="cta" onClick={startMockSession} type="button">
          Start mock session
        </button>
        <a className="badge" href="/api/transcription">
          API route scaffold
        </a>
      </div>
      <textarea
        className="transcript-box"
        value={transcript}
        onChange={(event) => setTranscript(event.target.value)}
        placeholder="Incoming transcript will appear here..."
      />
    </div>
  );
}
