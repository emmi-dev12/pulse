'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PulseConnections } from '../lib/pulse-settings';

type Status = 'idle' | 'recording' | 'uploading' | 'ready' | 'error';

export function TranscriptionPanel(props: {
  connections: PulseConnections;
  onTranscriptCaptured: (result: {
    text: string;
    status: 'completed' | 'queued';
    language?: string;
    confidence?: number | null;
  }) => void | Promise<void>;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<number | null>(null);
  const suppressUploadRef = useRef(false);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'recording':
        return 'Recording live input…';
      case 'uploading':
        return 'Processing through Composio…';
      case 'ready':
        return 'Transcript ready.';
      case 'error':
        return 'Recording unavailable.';
      default:
        return 'Ready for transcription.';
    }
  }, [status]);

  useEffect(() => {
    return () => {
      suppressUploadRef.current = true;
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch {
          // Ignore stop errors during cleanup.
        }
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startTimer() {
    stopTimer();
    setElapsedSeconds(0);
    intervalRef.current = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function cleanupTracks() {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    recorderRef.current = null;
    setIsMicActive(false);
  }

  function resetSession() {
    stopTimer();
    cleanupTracks();
    chunksRef.current = [];
  }

  async function uploadRecording(blob: Blob) {
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', blob, 'pulse-recording.webm');
    formData.append('composioApiKey', props.connections.composioApiKey);

    const response = await fetch('/api/transcription', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Transcription request failed.');
    }

    const payload = await response.json();
    const nextTranscript = payload?.transcript?.text ?? '';
    const nextStatus = payload?.status === 'queued' ? 'queued' : 'completed';
    const nextLanguage = payload?.transcript?.language ?? 'en';
    const nextConfidence = payload?.transcript?.confidence ?? null;
    setTranscript(nextTranscript || 'Transcript returned with no text.');
    setStatus('ready');
    setErrorMessage(null);
    await props.onTranscriptCaptured({
      text: nextTranscript || 'Transcript returned with no text.',
      status: nextStatus,
      language: nextLanguage,
      confidence: nextConfidence
    });
  }

  async function startRecording() {
    setErrorMessage(null);
    setTranscript('');
    suppressUploadRef.current = false;

    if (typeof window === 'undefined' || !window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setErrorMessage('Microphone capture is not supported in this browser context.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaStreamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      setIsMicActive(true);
      setStatus('recording');
      startTimer();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setStatus('error');
        setErrorMessage('There was a problem with audio recording.');
        resetSession();
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        stopTimer();
        cleanupTracks();

        if (suppressUploadRef.current) {
          return;
        }

        if (!blob.size) {
          setStatus('idle');
          return;
        }

        try {
          await uploadRecording(blob);
        } catch (error) {
          setStatus('error');
          setErrorMessage(error instanceof Error ? error.message : 'Transcription failed.');
        }
      };

      recorder.start();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Microphone permission was denied.');
      resetSession();
    }
  }

  function handleStopClick() {
    const recorder = recorderRef.current;
    suppressUploadRef.current = false;

    if (!recorder || recorder.state === 'inactive') {
      setIsMicActive(false);
      setStatus('idle');
      return;
    }

    recorder.stop();
  }

  return (
    <div>
      <div className="panel-header">
        <div>
          <span className="kicker">Transcription</span>
          <h2 style={{ marginTop: 8 }}>Recording studio</h2>
        </div>
        <span className={`recording-pill${isMicActive ? ' active' : ''}`} aria-live="polite">
          <span className="recording-dot" aria-hidden="true" />
          {isMicActive ? `Mic live • ${elapsedSeconds}s` : 'Mic idle'}
        </span>
      </div>

      <p>{statusLabel}</p>
      {errorMessage ? <p style={{ color: '#ffb3da', marginTop: -4 }}>{errorMessage}</p> : null}

      <div className="action-row">
        <button
          className="cta"
          onClick={startRecording}
          type="button"
          disabled={status === 'recording' || status === 'uploading'}
        >
          {status === 'recording' ? 'Recording…' : 'Use microphone'}
        </button>
        <button className="ghost-button" onClick={handleStopClick} type="button" disabled={!isMicActive}>
          Stop mic
        </button>
        <span className={`badge ${props.connections.composioApiKey ? 'badge-ready' : ''}`}>
          {props.connections.composioApiKey ? 'Composio key saved' : 'Add Composio key'}
        </span>
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
