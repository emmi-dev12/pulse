import { TranscriptionPanel } from '../components/transcription-panel';

const highlights = [
  'Next.js App Router PWA scaffold',
  'Neon pink on black UI system',
  'Gladia transcription integration structure'
];

const files = [
  'lib/gladia.ts',
  'app/api/transcription/route.ts',
  'components/transcription-panel.tsx'
];

export default function Home() {
  return (
    <main>
      <div className="shell">
        <section className="hero">
          <span className="kicker">Pulse / live transcription cockpit</span>
          <h1>Transcribe in neon.</h1>
          <p>
            A blacked-out Next.js PWA starter tuned for audio capture, live transcript
            review, and Gladia-backed speech workflows.
          </p>
          <div className="badges">
            {highlights.map((item) => (
              <span className="badge" key={item}>
                {item}
              </span>
            ))}
          </div>
          <a className="cta" href="#transcription">
            Open transcription workspace
          </a>
        </section>

        <section className="grid" id="transcription">
          <div className="card transcription">
            <TranscriptionPanel />
          </div>

          <aside className="card tech">
            <h2>Included structure</h2>
            <p>The Gladia integration is scaffolded for API wiring and transcript handling.</p>
            <div className="code">
              {files.map((file) => (
                <div key={file}>{file}</div>
              ))}
            </div>
            <p>
              Set <span className="code">GLADIA_API_KEY</span> to connect the speech API
              when you’re ready.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
