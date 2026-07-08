import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../utils/api'
import { Link } from 'react-router-dom'
import {
  FolderKanban, Zap, Briefcase, MessageSquare,
  Quote, Star, Mail, Eye, FileText, TrendingUp,
  Plus, ArrowRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function StatCard({ icon: Icon, label, value, sub, color, to, loading }) {
  const inner = (
    <div className="card" style={{
      padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem',
      transition: 'all 0.2s', cursor: to ? 'pointer' : 'default',
      height: '100%',
    }}
      onMouseEnter={e => { if (to) { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}18`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ minWidth: 0 }}>
        {loading
          ? <div className="skeleton" style={{ height: '2rem', width: '4rem', marginBottom: '0.4rem' }} />
          : <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>{value}</div>
        }
        <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 500, marginTop: '0.35rem' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.73rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>{sub}</div>}
      </div>
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link> : inner
}

function QuickAction({ to, icon: Icon, label, desc }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.9rem', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(4px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(124,106,247,0.12)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon size={16} color="var(--accent-2)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.87rem' }}>{label}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>{desc}</div>
        </div>
        <ArrowRight size={14} color="var(--text-3)" />
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
    refetchInterval: 60000,
  })
  const s = data?.data?.data

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const statCards = [
    { icon: FolderKanban, label: 'Projects',     value: s?.projects  ?? 0, sub: `${s?.published ?? 0} published · ${s?.featured ?? 0} featured`, color: 'var(--accent)',  to: '/admin/projects' },
    { icon: Zap,          label: 'Skills',       value: s?.skills    ?? 0, sub: 'in your tech stack',                                             color: 'var(--green)',   to: '/admin/skills' },
    { icon: Briefcase,    label: 'Experience',   value: s?.experiences ?? 0, sub: 'positions listed',                                             color: '#60a5fa',        to: '/admin/experiences' },
    { icon: Quote,        label: 'Testimonials', value: s?.testimonials ?? 0, sub: 'from happy clients',                                           color: '#f472b6',        to: '/admin/testimonials' },
    { icon: FileText,     label: 'Blog Posts',   value: s?.blog_posts ?? 0, sub: `${s?.published_posts ?? 0} published`,                          color: 'var(--amber)',   to: '/admin/blog' },
    { icon: MessageSquare,label: 'Messages',     value: s?.messages  ?? 0, sub: `${s?.unread_messages ?? 0} unread`,                              color: 'var(--red)',     to: '/admin/contacts' },
  ]

  const quickActions = [
    { to: '/admin/projects',    icon: Plus,        label: 'Add Project',    desc: 'Showcase new work' },
    { to: '/admin/blog',        icon: FileText,    label: 'Write Post',     desc: 'Share your knowledge' },
    { to: '/admin/skills',      icon: Zap,         label: 'Update Skills',  desc: 'Add new technologies' },
    { to: '/admin/about',       icon: TrendingUp,  label: 'Edit About',     desc: 'Update your story' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{greeting},</p>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>{user?.name ?? 'Admin'} 👋</h1>
      </div>

      {/* Unread alert */}
      {(s?.unread_messages ?? 0) > 0 && (
        <div className="animate-fade-up" style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(255,91,110,0.07)', border: '1px solid rgba(255,91,110,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Mail size={18} color="var(--red)" />
          <span style={{ fontWeight: 600, flex: 1 }}>
            You have <span style={{ color: 'var(--red)' }}>{s.unread_messages}</span> unread message{s.unread_messages !== 1 ? 's' : ''}
          </span>
          <Link to="/admin/contacts" className="btn btn-sm" style={{ background: 'var(--red)', color: '#fff', padding: '0.35rem 0.9rem' }}>
            <Eye size={13} /> View
          </Link>
        </div>
      )}

      {/* Stat grid */}
      <div className="animate-fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
        {statCards.map(card => <StatCard key={card.label} {...card} loading={isLoading} />)}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Quick actions */}
        <div className="animate-fade-up stagger-2">
          <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.9rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickActions.map(a => <QuickAction key={a.to} {...a} />)}
          </div>
        </div>

        {/* Summary */}
        <div className="animate-fade-up stagger-3">
          <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.9rem' }}>Site Health</h2>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { label: 'Published projects',  value: `${s?.published ?? 0} / ${s?.projects ?? 0}`,   ok: (s?.published ?? 0) > 0 },
              { label: 'Published blog posts',value: `${s?.published_posts ?? 0} / ${s?.blog_posts ?? 0}`, ok: (s?.published_posts ?? 0) > 0 },
              { label: 'Skills listed',        value: s?.skills ?? 0,       ok: (s?.skills ?? 0) >= 5 },
              { label: 'Unread messages',      value: s?.unread_messages ?? 0, ok: (s?.unread_messages ?? 0) === 0 },
            ].map(({ label, value, ok }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-2)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: ok ? 'var(--green)' : 'var(--amber)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
