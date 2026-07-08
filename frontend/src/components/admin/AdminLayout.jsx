import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, FolderKanban, Zap, Briefcase, MessageSquare,
  Quote, User, Settings, LogOut, Menu, X, Code2, ExternalLink,
  FileText, ChevronLeft, Bell
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../utils/api'
import ThemeToggle from '../shared/ThemeToggle'

const NAV = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/admin/projects',     icon: FolderKanban,    label: 'Projects' },
  { to: '/admin/skills',       icon: Zap,             label: 'Skills' },
  { to: '/admin/experiences',  icon: Briefcase,       label: 'Experience' },
  { to: '/admin/testimonials', icon: Quote,           label: 'Testimonials' },
  { to: '/admin/blog',         icon: FileText,        label: 'Blog' },
  { to: '/admin/contacts',     icon: MessageSquare,   label: 'Contacts',    badge: true },
  { to: '/admin/about',        icon: User,            label: 'About' },
  { to: '/admin/settings',     icon: Settings,        label: 'Settings' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // unread message count for badge
  const { data: statsData } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.getStats, refetchInterval: 60000 })
  const unread = statsData?.data?.data?.unread_messages ?? 0

  const handleLogout = async () => {
    await logout()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? '64px' : '240px',
        flexShrink: 0, background: 'var(--bg-2)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 200,
      }}>
        {/* Logo row */}
        <div style={{ padding: '0 0.75rem', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', height: '64px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {!collapsed && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <span style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Code2 size={14} color="#fff" />
              </span>
              Admin Panel
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="btn btn-ghost btn-icon" style={{ flexShrink: 0, marginLeft: collapsed ? 0 : 'auto' }}>
            {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(({ to, icon: Icon, label, end, badge }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.7rem',
              padding: '0.58rem 0.7rem', borderRadius: '8px',
              fontSize: '0.875rem', fontWeight: 500,
              color: isActive ? 'var(--text)' : 'var(--text-3)',
              background: isActive ? 'var(--surface)' : 'transparent',
              transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden',
              justifyContent: collapsed ? 'center' : 'flex-start',
              position: 'relative',
            })}
              title={collapsed ? label : undefined}
            >
              <span style={{ position: 'relative', flexShrink: 0 }}>
                <Icon size={16} />
                {badge && unread > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', border: '1.5px solid var(--bg-2)' }} />
                )}
              </span>
              {!collapsed && (
                <>
                  {label}
                  {badge && unread > 0 && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '100px', background: 'var(--red)', color: '#fff', lineHeight: 1.4 }}>{unread}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '0.6rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          {collapsed ? (
            <button onClick={handleLogout} className="btn btn-ghost btn-icon" style={{ width: '100%' }} title="Sign out"><LogOut size={16} /></button>
          ) : (
            <div style={{ padding: '0.6rem 0.7rem', borderRadius: '10px', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/admin/profile" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: 'Syne, sans-serif' }}>
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-icon" title="Sign out" style={{ flexShrink: 0, padding: '0.3rem' }}>
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, marginLeft: collapsed ? '64px' : '240px', transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{ height: '64px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 1.5rem', background: 'var(--bg-2)', position: 'sticky', top: 0, zIndex: 100, gap: '0.5rem' }}>
          <ThemeToggle />
          <Link to="/admin/profile" className="btn btn-ghost btn-sm" style={{ gap: '0.4rem', fontSize: '0.82rem' }}>
            <User size={13} /> Profile
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ gap: '0.4rem', fontSize: '0.82rem' }}>
            View Site <ExternalLink size={13} />
          </a>
        </header>

        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
