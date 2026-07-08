import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Plus, Edit2, Trash2, Star, Globe, Github, ExternalLink, FolderKanban } from 'lucide-react'
import { useCrud } from '../../hooks/useCrud'
import { adminApi } from '../../utils/api'
import ImageUpload from '../../components/shared/ImageUpload'
import TagInput from '../../components/shared/TagInput'
import ConfirmDialog from '../../components/shared/ConfirmDialog'

const api = {
  getAll: adminApi.getProjects,
  create: adminApi.createProject,
  update: (id, data) => adminApi.updateProject(id, data),
  remove: adminApi.deleteProject,
}

function ProjectForm({ item, onSubmit, onCancel, loading }) {
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      title:            item?.title ?? '',
      description:      item?.description ?? '',
      long_description: item?.long_description ?? '',
      thumbnail:        item?.thumbnail ?? '',
      tech_stack:       item?.tech_stack ?? [],
      github_url:       item?.github_url ?? '',
      live_url:         item?.live_url ?? '',
      category:         item?.category ?? '',
      is_featured:      item?.is_featured ?? false,
      is_published:     item?.is_published ?? true,
      order:            item?.order ?? 0,
      start_date:       item?.start_date?.slice(0, 10) ?? '',
      end_date:         item?.end_date?.slice(0, 10) ?? '',
    },
  })

  const techStack = watch('tech_stack')

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <h2>{item ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onCancel} className="btn btn-ghost btn-icon" style={{ fontSize: '1.1rem' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit(d => onSubmit({ ...d, order: parseInt(d.order) || 0 }))}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="My Awesome Project" {...register('title', { required: true })} />
            </div>

            <div className="form-group">
              <label className="form-label">Short Description *</label>
              <textarea className="form-textarea" rows={2} placeholder="One-line summary shown in cards…" {...register('description', { required: true })} />
            </div>

            <div className="form-group">
              <label className="form-label">Full Description</label>
              <textarea className="form-textarea" rows={4} placeholder="Detailed write-up for the project detail page…" {...register('long_description')} />
            </div>

            <Controller name="thumbnail" control={control} render={({ field }) => (
              <ImageUpload label="Thumbnail" value={field.value} onChange={field.onChange} folder="projects" />
            )} />

            <div className="form-group">
              <label className="form-label">Tech Stack</label>
              <TagInput
                value={techStack}
                onChange={v => setValue('tech_stack', v)}
                placeholder="React, Laravel, MySQL… (press Enter)"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input className="form-input" type="url" placeholder="https://github.com/…" {...register('github_url')} />
              </div>
              <div className="form-group">
                <label className="form-label">Live URL</label>
                <input className="form-input" type="url" placeholder="https://…" {...register('live_url')} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input className="form-input" placeholder="Web App, SaaS…" {...register('category')} />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input className="form-input" type="date" {...register('start_date')} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input className="form-input" type="date" {...register('end_date')} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input className="form-input" type="number" min="0" {...register('order')} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.65rem 0.9rem', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.88rem' }}>
                <input type="checkbox" {...register('is_featured')} style={{ accentColor: 'var(--amber)', width: 15, height: 15 }} />
                <Star size={14} color="var(--amber)" /> Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.65rem 0.9rem', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.88rem' }}>
                <input type="checkbox" {...register('is_published')} style={{ accentColor: 'var(--green)', width: 15, height: 15 }} />
                Published
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading
                ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving…</>
                : item ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProjects() {
  const {
    items, isLoading,
    editing, setEditing,
    creating, setCreating,
    deleting, setDeleting,
    create, update, remove,
    creating_loading, updating_loading, deleting_loading,
  } = useCrud('admin-projects', api)

  const [filter, setFilter] = useState('all')

  const filtered = items.filter(p => {
    if (filter === 'featured')   return p.is_featured
    if (filter === 'published')  return p.is_published
    if (filter === 'draft')      return !p.is_published
    return true
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Projects</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{items.length} total</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {[
          { id: 'all',       label: `All (${items.length})` },
          { id: 'published', label: `Published (${items.filter(p => p.is_published).length})` },
          { id: 'featured',  label: `Featured (${items.filter(p => p.is_featured).length})` },
          { id: 'draft',     label: `Drafts (${items.filter(p => !p.is_published).length})` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
            padding: '0.5rem 0.9rem', fontSize: '0.82rem', fontWeight: 600,
            border: 'none', cursor: 'pointer', background: 'transparent',
            color: filter === tab.id ? 'var(--text)' : 'var(--text-3)',
            borderBottom: filter === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px', transition: 'all 0.15s', fontFamily: 'inherit',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '62px', borderRadius: '8px' }} />)}
        </div>
      ) : (
        <div className="card animate-fade-up">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Tech Stack</th>
                  <th>Status</th>
                  <th>Links</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {p.thumbnail
                          ? <img src={p.thumbnail} alt={p.title} style={{ width: 38, height: 38, borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }} />
                          : <div style={{ width: 38, height: 38, borderRadius: '6px', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: '1rem', opacity: 0.4 }}>⬡</div>
                        }
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {p.is_featured && <Star size={11} fill="var(--amber)" color="var(--amber)" />}
                            {p.title}
                          </div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--text-3)', marginTop: '0.1rem', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.category
                        ? <span className="tag" style={{ fontSize: '0.66rem' }}>{p.category}</span>
                        : <span style={{ color: 'var(--text-3)' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '200px' }}>
                        {(p.tech_stack ?? []).slice(0, 3).map(t => (
                          <span key={t} style={{ fontSize: '0.67rem', padding: '0.1rem 0.4rem', borderRadius: '3px', background: 'var(--bg-3)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>{t}</span>
                        ))}
                        {(p.tech_stack?.length ?? 0) > 3 && (
                          <span style={{ fontSize: '0.67rem', color: 'var(--text-3)' }}>+{p.tech_stack.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${p.is_published ? 'green' : 'amber'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon btn-sm" title="GitHub"><Github size={13} /></a>}
                        {p.live_url   && <a href={p.live_url}   target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon btn-sm" title="Live"><Globe size={13} /></a>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditing(p)} title="Edit"><Edit2 size={13} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDeleting(p.id)} title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <FolderKanban size={28} />
                        <h3>No projects here</h3>
                        <p>Try a different filter or add your first project.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {creating && <ProjectForm onSubmit={create} onCancel={() => setCreating(false)} loading={creating_loading} />}
      {editing  && <ProjectForm item={editing} onSubmit={d => update({ id: editing.id, data: d })} onCancel={() => setEditing(null)} loading={updating_loading} />}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Project"
        message="Are you sure? This will permanently delete the project and cannot be undone."
        confirmLabel="Delete Project"
        onConfirm={() => remove(deleting)}
        onCancel={() => setDeleting(null)}
        loading={deleting_loading}
      />
    </div>
  )
}
