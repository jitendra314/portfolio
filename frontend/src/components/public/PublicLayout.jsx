import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, Code2, Github, Linkedin, Twitter, ArrowUp } from 'lucide-react'
import ThemeToggle from '../shared/ThemeToggle'
import PageTransition from '../shared/PageTransition'

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop]   = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      setShowTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog',     label: 'Blog' },
    { to: '/about',    label: 'About' },
    { to: '/contact',  label: 'Contact' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled ? 'rgba(var(--bg-rgb, 10,10,15),0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
            <span style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Code2 size={16} color="#fff" />
            </span>
            Portfolio
          </Link>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
                padding: '0.4rem 0.9rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500,
                color: isActive ? 'var(--text)' : 'var(--text-2)',
                background: isActive ? 'var(--surface)' : 'transparent',
                transition: 'all 0.15s',
              })}>
                {label}
              </NavLink>
            ))}
            <div style={{ width: 1, height: 20, background: 'var(--border-2)', margin: '0 0.25rem' }} />
            <ThemeToggle />
            <Link to="/contact" className="btn btn-primary btn-sm" style={{ marginLeft: '0.25rem' }}>Hire Me</Link>
          </nav>

          {/* Mobile */}
          <div className="hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ThemeToggle />
            <button className="btn btn-ghost btn-icon" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '1rem', animation: 'fadeUp 0.2s ease' }}>
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'block', padding: '0.75rem 1rem', borderRadius: '8px',
                  color: isActive ? 'var(--text)' : 'var(--text-2)', fontSize: '0.95rem',
                  background: isActive ? 'var(--surface)' : 'transparent', marginBottom: '0.2rem',
                })}>
                {label}
              </NavLink>
            ))}
            <div style={{ marginTop: '0.5rem', padding: '0.5rem' }}>
              <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Hire Me</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main style={{ flex: 1, paddingTop: '64px' }}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 0', marginTop: '4rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>
                <span style={{ width: 26, height: 26, background: 'var(--accent)', borderRadius: 6, display: 'grid', placeItems: 'center' }}>
                  <Code2 size={13} color="#fff" />
                </span>
                Portfolio
              </Link>
              <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>© {new Date().getFullYear()} · Built with React + Laravel</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} style={{ color: 'var(--text-3)', fontSize: '0.85rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-3)'}>
                  {label}
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="btn btn-ghost btn-icon btn-sm"><Icon size={16} /></a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Back to top ── */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn btn-outline btn-icon"
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50, boxShadow: 'var(--shadow)', animation: 'fadeIn 0.2s ease' }}>
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  )
}
