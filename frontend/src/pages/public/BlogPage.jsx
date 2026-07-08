import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react'
import { publicApi } from '../../utils/api'

function PostCard({ post, index }) {
  const readTime = Math.max(1, Math.ceil((post.content?.split(' ').length ?? 0) / 200))

  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article className="card card-hover animate-fade-up"
        style={{ display: 'flex', flexDirection: 'column', height: '100%', animationDelay: `${index * 0.07}s` }}>
        {post.cover_image && (
          <div style={{ height: '200px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={post.cover_image} alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
          </div>
        )}
        {!post.cover_image && (
          <div style={{ height: '140px', background: `linear-gradient(135deg, var(--surface-2) 0%, var(--bg-3) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', opacity: 0.2 }}>✦</span>
          </div>
        )}

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {post.tags.slice(0, 3).map(t => (
                <span key={t} className="tag" style={{ fontSize: '0.65rem' }}>{t}</span>
              ))}
            </div>
          )}

          <h2 style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.35, color: 'var(--text)' }}>
            {post.title}
          </h2>

          {post.excerpt && (
            <p style={{ color: 'var(--text-2)', fontSize: '0.87rem', lineHeight: 1.7, flex: 1 }}>
              {post.excerpt}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-3)', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={12} />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={12} /> {readTime} min read
            </span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-2)', fontWeight: 500 }}>
              Read <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogPage() {
  const [search, setSearch]   = useState('')
  const [activeTag, setTag]   = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => publicApi.getBlogPosts(),
  })
  const posts = data?.data?.data ?? []

  // Collect all unique tags
  const allTags = ['All', ...new Set(posts.flatMap(p => p.tags ?? []))]

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt ?? '').toLowerCase().includes(search.toLowerCase())
    const matchTag = activeTag === 'All' || (p.tags ?? []).includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '4rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }} className="animate-fade-up">
          <div className="tag" style={{ marginBottom: '0.75rem' }}>Writing</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>Blog</h1>
          <p style={{ color: 'var(--text-2)', maxWidth: '480px' }}>
            Thoughts on web development, design systems, open source, and the craft of building software.
          </p>
        </div>

        {/* Search + Tags */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }} className="animate-fade-up stagger-1">
          <div className="search-wrap" style={{ flex: 1, minWidth: '220px', maxWidth: '340px' }}>
            <Search size={15} />
            <input className="form-input" placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setTag(tag)} style={{
                padding: '0.32rem 0.85rem', borderRadius: '100px', fontSize: '0.79rem',
                fontWeight: 600, cursor: 'pointer', border: '1px solid',
                background: activeTag === tag ? 'var(--accent)' : 'transparent',
                borderColor: activeTag === tag ? 'var(--accent)' : 'var(--border-2)',
                color: activeTag === tag ? '#fff' : 'var(--text-2)',
                transition: 'all 0.15s',
              }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '16px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Tag size={32} />
            <h3>No articles found</h3>
            <p>Try a different search term or tag.</p>
          </div>
        ) : (
          <>
            {/* Featured post (first) */}
            {filtered[0] && activeTag === 'All' && !search && (
              <Link to={`/blog/${filtered[0].slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
                <article className="card card-hover animate-fade-up"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, minHeight: '260px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--surface-2), var(--bg-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {filtered[0].cover_image
                      ? <img src={filtered[0].cover_image} alt={filtered[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '4rem', opacity: 0.15 }}>✦</span>
                    }
                  </div>
                  <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <span className="badge purple">Featured Post</span>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--text)' }}>{filtered[0].title}</h2>
                    {filtered[0].excerpt && <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.7 }}>{filtered[0].excerpt}</p>}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {filtered[0].tags?.map(t => <span key={t} className="tag" style={{ fontSize: '0.65rem' }}>{t}</span>)}
                    </div>
                  </div>
                </article>
              </Link>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {(activeTag === 'All' && !search ? filtered.slice(1) : filtered).map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
