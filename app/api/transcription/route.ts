import { NextResponse } from 'next/server';
import { normalizeTranscript } from '../../../lib/gladia';

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    provider: 'gladia',
    scaffold: true
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json({
    ok: true,
    transcript: normalizeTranscript({
      text: typeof body?.text === 'string' ? body.text : 'Transcription scaffold is live.'
    })
  });
}
