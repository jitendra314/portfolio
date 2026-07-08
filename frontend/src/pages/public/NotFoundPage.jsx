import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }} className="animate-fade-up">
        {/* Big 404 */}
        <div style={{
          fontSize: 'clamp(6rem, 20vw, 10rem)', fontWeight: 800,
          fontFamily: 'Syne, sans-serif', lineHeight: 1,
          background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 50%, var(--text-3) 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '1.5rem',
          userSelect: 'none',
        }}>
          404
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => window.history.back()} className="btn btn-outline">
            <ArrowLeft size={15} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            <Home size={15} /> Home
          </Link>
        </div>

        {/* Decorative dots */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i === 2 ? 'var(--accent)' : 'var(--border-2)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
