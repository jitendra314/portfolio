import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Github, ExternalLink, Calendar, Star } from 'lucide-react'
import { publicApi } from '../../utils/api'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => publicApi.getProject(slug),
  })
  const project = data?.data?.data

  if (isLoading) return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }} />
      <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '6rem' }} />
    </div>
  )

  if (isError || !project) return (
    <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>Project not found</h2>
      <Link to="/projects" className="btn btn-outline">← Back to Projects</Link>
    </div>
  )

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <div style={{ height: '380px', background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--bg-3) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '3rem' }}>
        {project.thumbnail && <img src={project.thumbnail} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />
      </div>

      <div className="container">
        <Link to="/projects" className="btn btn-ghost" style={{ marginBottom: '1.5rem', paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '4rem', alignItems: 'start' }}>
          {/* Main content */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {project.category && <span className="tag">{project.category}</span>}
              {project.is_featured && <span className="badge purple"><Star size={10} fill="currentColor" /> Featured</span>}
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.5rem' }}>{project.title}</h1>
            <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>{project.description}</p>
            {project.long_description && (
              <div style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '0.95rem' }}>
                {project.long_description.split('\n').map((p, i) => <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>)}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)' }}>Project Info</h3>
              
              {project.start_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>
                  <Calendar size={14} />
                  <span>{new Date(project.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                  {project.end_date && <><span>→</span><span>{new Date(project.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span></>}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                    <Github size={15} /> View Code
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    <ExternalLink size={15} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {project.tech_stack?.length > 0 && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)' }}>Tech Stack</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tech_stack.map(t => (
                    <span key={t} style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem', borderRadius: '6px', background: 'var(--bg-3)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
