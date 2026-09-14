import { Activity } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav — aria-label distinguishes this from the main landmark */}
      <nav
        aria-label="Application navigation"
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(17, 25, 40, 0.6)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            background: 'var(--accent)',
            padding: '7px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            flexShrink: 0,
          }}
        >
          <Activity size={22} />
        </div>
        {/* Use a <span> here — each page renders its own semantic <h1> */}
        <span
          style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}
        >
          HealthSync
        </span>
      </nav>

      {/* main flex grows to fill the page; overflow:auto so inner panels scroll not the body */}
      <main
        id="main-content"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '2.5rem 2rem',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  );
}
