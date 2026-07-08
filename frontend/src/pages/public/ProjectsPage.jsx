import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Github, ExternalLink, ArrowRight, Search, Star } from 'lucide-react'
import { publicApi } from '../../utils/api'

export default function ProjectsPage() {
  const [search, setSearch]         = useState('')
  const [activeCategory, setCategory] = useState('All')

  const { data, isLoading } = useQuery({ queryKey: ['projects'], queryFn: publicApi.getProjects })
  const projects = data?.data?.data ?? []

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))]
  const filtered = projects.filter(p => {
    const matchSearch   = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="tag" style={{ marginBottom: '0.75rem' }}>Portfolio</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>All Projects</h1>
          <p style={{ color: 'var(--text-2)', maxWidth: '500px' }}>
            A collection of work spanning web apps, dashboards, SaaS tools, and more.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="form-input" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.4rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '0.35rem 0.9rem', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid', cursor: 'pointer', background: activeCategory === cat ? 'var(--accent)' : 'transparent', borderColor: activeCategory === cat ? 'var(--accent)' : 'var(--border-2)', color: activeCategory === cat ? '#fff' : 'var(--text-2)', transition: 'all 0.15s' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '340px', borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-3)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No projects found</p>
            <p style={{ fontSize: '0.85rem' }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(project => (
              <div key={project.id} className="card"
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                style={{ display: 'flex', flexDirection: 'column', transition: 'all 0.25s' }}>
                
                <div style={{ height: '180px', background: 'linear-gradient(135deg, var(--surface-2), var(--bg-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {project.thumbnail
                    ? <img src={project.thumbnail} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2.5rem', opacity: 0.25 }}>⬡</span>
                  }
                  {project.is_featured && (
                    <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }} className="badge purple">
                      <Star size={10} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {project.category && <span className="tag" style={{ fontSize: '0.68rem', alignSelf: 'flex-start' }}>{project.category}</span>}
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.65, flex: 1 }}>{project.description}</p>
                  {project.tech_stack?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {project.tech_stack.slice(0, 4).map(t => (
                        <span key={t} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'var(--bg-3)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                    <Link to={`/projects/${project.slug}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      Details <ArrowRight size={12} />
                    </Link>
                    {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon btn-sm"><Github size={14} /></a>}
                    {project.live_url   && <a href={project.live_url}   target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon btn-sm"><ExternalLink size={14} /></a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
