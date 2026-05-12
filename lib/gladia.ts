export type GladiaTranscript = {
  text: string;
  confidence?: number;
  language?: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
};

export async function submitAudioToGladia(_audio: Blob | File | ArrayBuffer) {
  const apiKey = process.env.GLADIA_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GLADIA_API_KEY.');
  }

  // Replace this scaffold with the actual Gladia upload/transcription workflow.
  return {
    jobId: 'gladia-job-placeholder',
    status: 'queued' as const
  };
}

export function normalizeTranscript(payload: GladiaTranscript) {
  return {
    text: payload.text.trim(),
    language: payload.language ?? 'en',
    confidence: payload.confidence ?? null,
    segments: payload.segments ?? []
  };
}
