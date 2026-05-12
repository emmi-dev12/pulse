import { TranscriptionPanel } from '../components/transcription-panel';

const highlights = [
  'Composio transcription toolset',
  'Premium neon pink on black design',
  'PWA-first recording experience'
];

const featureCards = [
  {
    title: 'Polished landing page',
    body: 'Hero copy, feature stacks, and a cinematic card layout make Pulse feel like a finished product.'
  },
  {
    title: 'Recording pill',
    body: 'The mic state is fully connected to browser capture so the pill glows only while audio is active.'
  },
  {
    title: 'Vercel-ready architecture',
    body: 'Server routes, metadata, and graceful fallbacks are shaped for deployment without extra wiring.'
  }
];

export default function Home() {
  return (
    <main>
      <div className="shell">
        <section className="hero hero-grid">
          <div>
            <span className="kicker">Pulse / transcription cockpit</span>
            <h1>Record, transcribe, and ship in neon.</h1>
            <p className="hero-copy">
              Pulse is a high-end Next.js PWA for live transcription, shaped with a glossy
              black canvas, pink electric accents, and a Composio-powered transcription flow.
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
              <a className="ghost-button" href="#features">
                Explore features
              </a>
            </div>
          </div>

          <div className="hero-aside">
            <div className="status-panel">
              <span className="kicker">Now live</span>
              <h2>Designed for audio-first workflows.</h2>
              <p>
                Record from your mic, watch the recording pill illuminate, and send audio to
                the API route built for Composio transcription toolsets.
              </p>
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
            <TranscriptionPanel />
          </div>

          <aside className="card tech">
            <h2>Build notes</h2>
            <p>Transcription is routed through a composable Composio integration layer.</p>
            <div className="code">
              <div>lib/composio.ts</div>
              <div>app/api/transcription/route.ts</div>
              <div>components/transcription-panel.tsx</div>
            </div>
            <p>
              Define <span className="code">COMPOSIO_API_KEY</span> and{' '}
              <span className="code">COMPOSIO_TRANSCRIPTION_ENDPOINT</span> for live transcription.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
