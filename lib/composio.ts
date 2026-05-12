export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type ComposioTranscript = {
  text: string;
  language?: string;
  confidence?: number | null;
  segments?: TranscriptSegment[];
  provider?: string;
};

export type ComposioTranscriptionResult = {
  status: 'completed' | 'queued';
  transcript: ComposioTranscript;
  requestId?: string;
};

export type ComposioTranscriptionInput = {
  audio: Blob;
  apiKey?: string;
};

function createFallbackTranscript(message: string): ComposioTranscriptionResult {
  return {
    status: 'queued',
    transcript: {
      text: message,
      language: 'en',
      confidence: null,
      segments: [],
      provider: 'composio'
    }
  };
}

export async function transcribeAudioWithComposio(input: ComposioTranscriptionInput) {
  const endpoint = process.env.COMPOSIO_TRANSCRIPTION_ENDPOINT;
  const apiKey = input.apiKey ?? process.env.COMPOSIO_API_KEY;

  if (!endpoint || !apiKey) {
    return createFallbackTranscript(
      'Composio transcription is scaffolded. Save your API key in Pulse connections and define COMPOSIO_TRANSCRIPTION_ENDPOINT to enable live transcription.'
    );
  }

  const formData = new FormData();
  formData.append('file', input.audio, 'pulse-recording.webm');
  formData.append('toolset', process.env.COMPOSIO_TRANSCRIPTION_TOOLSET ?? 'transcription');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Composio transcription request failed with status ${response.status}`);
  }

  const data = (await response.json()) as Partial<ComposioTranscriptionResult> & {
    transcript?: Partial<ComposioTranscript>;
  };

  const transcript = data.transcript ?? {};

  return {
    status: (data.status ?? 'completed') as 'completed' | 'queued',
    requestId: data.requestId,
    transcript: {
      text: transcript.text?.trim() ?? '',
      language: transcript.language ?? 'en',
      confidence: transcript.confidence ?? null,
      segments: transcript.segments ?? [],
      provider: transcript.provider ?? 'composio'
    }
  } satisfies ComposioTranscriptionResult;
}
