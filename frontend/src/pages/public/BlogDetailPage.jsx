import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react'
import { publicApi } from '../../utils/api'
import toast from 'react-hot-toast'

export default function BlogDetailPage() {
  const { slug } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => publicApi.getBlogPost(slug),
  })
  const post = data?.data?.data

  const readTime = Math.max(1, Math.ceil((post?.content?.split(' ').length ?? 0) / 200))

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (isLoading) return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '780px' }}>
      <div className="skeleton" style={{ height: '2rem', width: '20%', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: '320px', borderRadius: '16px', marginBottom: '2rem' }} />
      <div className="skeleton" style={{ height: '2.5rem', width: '80%', marginBottom: '1rem' }} />
      {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '1rem', marginBottom: '0.5rem', width: `${70 + Math.random() * 25}%` }} />)}
    </div>
  )

  if (isError || !post) return (
    <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>Post not found</h2>
      <Link to="/blog" className="btn btn-outline">← Back to Blog</Link>
    </div>
  )

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Cover */}
      {post.cover_image && (
        <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
          <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--bg))' }} />
        </div>
      )}

      <div className="container animate-fade-up" style={{ maxWidth: '780px', paddingTop: post.cover_image ? '1rem' : '4rem' }}>
        <Link to="/blog" className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '1.5rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {post.tags.map(t => <span key={t} className="tag" style={{ fontSize: '0.68rem' }}>{t}</span>)}
          </div>
        )}

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
          {post.title}
        </h1>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-3)', fontSize: '0.82rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={13} />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} /> {readTime} min read
            </span>
          </div>
          <button onClick={share} className="btn btn-outline btn-sm">
            <Share2 size={13} /> Share
          </button>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '2rem', paddingLeft: '1.25rem', borderLeft: '3px solid var(--accent)' }}>
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Footer */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/blog" className="btn btn-outline">
            <ArrowLeft size={15} /> All Posts
          </Link>
          <button onClick={share} className="btn btn-ghost btn-sm">
            <Share2 size={14} /> Share this post
          </button>
        </div>
      </div>
    </div>
  )
}
