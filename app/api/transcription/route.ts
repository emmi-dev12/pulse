import { NextResponse } from 'next/server';
import { transcribeAudioWithComposio } from '../../../lib/composio';

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    provider: 'composio',
    scaffold: true
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const file = formData.get('file');
    const apiKey = formData.get('composioApiKey');

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Missing audio file.' }, { status: 400 });
    }

    const result = await transcribeAudioWithComposio({
      audio: file,
      apiKey: typeof apiKey === 'string' ? apiKey : undefined
    });

    return NextResponse.json({ ok: true, ...result });
  }

  const body = await request.json().catch(() => ({}));
  const text = typeof body?.text === 'string' ? body.text : 'Pulse transcription pipeline is ready.';

  return NextResponse.json({
    ok: true,
    status: 'completed',
    transcript: {
      text,
      language: 'en',
      confidence: null,
      segments: [],
      provider: 'composio'
    }
  });
}
