import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar } from 'lucide-react'
import { useCrud } from '../../hooks/useCrud'
import { adminApi } from '../../utils/api'
import ImageUpload from '../../components/shared/ImageUpload'
import TagInput from '../../components/shared/TagInput'
import ConfirmDialog from '../../components/shared/ConfirmDialog'

const api = {
  getAll: adminApi.getBlogPosts,
  create: adminApi.createBlogPost,
  update: (id, data) => adminApi.updateBlogPost(id, data),
  remove: adminApi.deleteBlogPost,
}

function PostForm({ item, onSubmit, onCancel, loading }) {
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      title:        item?.title ?? '',
      excerpt:      item?.excerpt ?? '',
      content:      item?.content ?? '',
      cover_image:  item?.cover_image ?? '',
      tags:         item?.tags ?? [],
      is_published: item?.is_published ?? false,
      published_at: item?.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    },
  })

  const tags = watch('tags')

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <h2>{item ? 'Edit Post' : 'New Blog Post'}</h2>
          <button onClick={onCancel} className="btn btn-ghost btn-icon">✕</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" {...register('title', { required: true })} />
            </div>

            <div className="form-group">
              <label className="form-label">Excerpt / Summary</label>
              <textarea className="form-textarea" rows={2} placeholder="Short description shown in cards…" {...register('excerpt')} />
            </div>

            <div className="form-group">
              <label className="form-label">Content * (HTML supported)</label>
              <textarea className="form-textarea" rows={12} placeholder="<p>Your article content here…</p>" style={{ fontFamily: 'monospace', fontSize: '0.83rem' }} {...register('content', { required: true })} />
              <span className="form-hint">You can use HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;code&gt;, &lt;pre&gt;, &lt;blockquote&gt;, &lt;img&gt;</span>
            </div>

            <Controller name="cover_image" control={control} render={({ field }) => (
              <ImageUpload label="Cover Image" value={field.value} onChange={field.onChange} folder="blog" />
            )} />

            <div className="form-group">
              <label className="form-label">Tags</label>
              <TagInput value={tags} onChange={(v) => setValue('tags', v)} placeholder="React, Laravel, Tutorial…" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Publish Date</label>
                <input className="form-input" type="date" {...register('published_at')} />
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label className="form-label">Status</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.65rem 0.9rem', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <input type="checkbox" {...register('is_published')} style={{ accentColor: 'var(--green)', width: 16, height: 16 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>Published</span>
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving…' : item ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminBlog() {
  const {
    items, isLoading,
    editing, setEditing,
    creating, setCreating,
    deleting, setDeleting,
    create, update, remove,
    creating_loading, updating_loading, deleting_loading,
  } = useCrud('admin-blog', api)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Blog</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{items.length} posts · {items.filter(p => p.is_published).length} published</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>
          <Plus size={15} /> New Post
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '68px', borderRadius: '8px' }} />)}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tags</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.88rem', maxWidth: '320px' }}>
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-3)', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {(post.tags ?? []).slice(0, 3).map(t => (
                          <span key={t} className="tag" style={{ fontSize: '0.62rem' }}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={12} />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${post.is_published ? 'green' : 'amber'}`}>
                        {post.is_published ? <><Eye size={10} /> Published</> : <><EyeOff size={10} /> Draft</>}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditing(post)} title="Edit"><Edit2 size={13} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDeleting(post.id)} title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <Edit2 size={28} />
                        <h3>No posts yet</h3>
                        <p>Write your first article to share your knowledge.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {creating && <PostForm onSubmit={create} onCancel={() => setCreating(false)} loading={creating_loading} />}
      {editing  && <PostForm item={editing} onSubmit={(d) => update({ id: editing.id, data: d })} onCancel={() => setEditing(null)} loading={updating_loading} />}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete Post"
        onConfirm={() => remove(deleting)}
        onCancel={() => setDeleting(null)}
        loading={deleting_loading}
      />
    </div>
  )
}
