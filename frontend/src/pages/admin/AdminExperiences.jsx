import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, Briefcase, Calendar } from 'lucide-react'
import { useCrud } from '../../hooks/useCrud'
import { adminApi } from '../../utils/api'

const api = {
  getAll: adminApi.getExperiences,
  create: adminApi.createExperience,
  update: (id, data) => adminApi.updateExperience(id, data),
  remove: adminApi.deleteExperience,
}

function ExperienceForm({ item, onSubmit, onCancel, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      company:          item?.company ?? '',
      role:             item?.role ?? '',
      description:      item?.description ?? '',
      responsibilities: item?.responsibilities?.join('\n') ?? '',
      tech_used:        item?.tech_used?.join(', ') ?? '',
      start_date:       item?.start_date?.slice(0, 10) ?? '',
      end_date:         item?.end_date?.slice(0, 10) ?? '',
      is_current:       item?.is_current ?? false,
      company_url:      item?.company_url ?? '',
      location:         item?.location ?? '',
      type:             item?.type ?? 'full-time',
      order:            item?.order ?? 0,
    },
  })

  const submit = (data) => onSubmit({
    ...data,
    responsibilities: data.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
    tech_used: data.tech_used.split(',').map(t => t.trim()).filter(Boolean),
    order: parseInt(data.order) || 0,
  })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h2>{item ? 'Edit Experience' : 'New Experience'}</h2>
          <button onClick={onCancel} className="btn btn-ghost btn-icon">✕</button>
        </div>
        <form onSubmit={handleSubmit(submit)}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Company *</label>
                <input className="form-input" {...register('company', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role / Position *</label>
                <input className="form-input" {...register('role', { required: true })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" rows={3} {...register('description', { required: true })} />
            </div>

            <div className="form-group">
              <label className="form-label">Responsibilities (one per line)</label>
              <textarea className="form-textarea" rows={4} placeholder="Led team of 5 developers&#10;Reduced load time by 40%&#10;Implemented CI/CD pipeline" {...register('responsibilities')} />
            </div>

            <div className="form-group">
              <label className="form-label">Technologies Used (comma separated)</label>
              <input className="form-input" placeholder="React, Laravel, Docker…" {...register('tech_used')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input className="form-input" type="date" {...register('start_date', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input className="form-input" type="date" {...register('end_date')} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" {...register('type')}>
                  {['full-time', 'part-time', 'freelance', 'internship', 'contract'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="San Francisco, CA / Remote" {...register('location')} />
              </div>
              <div className="form-group">
                <label className="form-label">Company URL</label>
                <input className="form-input" type="url" {...register('company_url')} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input type="checkbox" {...register('is_current')} style={{ accentColor: 'var(--accent)' }} />
                Currently working here
              </label>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Order</label>
                <input className="form-input" type="number" {...register('order')} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving…' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminExperiences() {
  const {
    items, isLoading,
    editing, setEditing,
    creating, setCreating,
    deleting, setDeleting,
    create, update, remove,
    creating_loading, updating_loading, deleting_loading,
  } = useCrud('admin-experiences', api)

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Experience</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{items.length} positions</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>
          <Plus size={15} /> Add Experience
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(exp => (
            <div key={exp.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Briefcase size={18} color="var(--accent-2)" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{exp.role}</h3>
                  {exp.is_current && <span className="badge green">Current</span>}
                  <span className="tag" style={{ fontSize: '0.66rem' }}>{exp.type}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.83rem', color: 'var(--text-3)', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>{exp.company}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {formatDate(exp.start_date)} → {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                  </span>
                  {exp.location && <span>{exp.location}</span>}
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{exp.description}</p>

                {exp.tech_used?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                    {exp.tech_used.map(t => (
                      <span key={t} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-3)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditing(exp)}><Edit2 size={14} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDeleting(exp.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-3)' }}>No experience entries yet.</div>
          )}
        </div>
      )}

      {creating && <ExperienceForm onSubmit={create} onCancel={() => setCreating(false)} loading={creating_loading} />}
      {editing  && <ExperienceForm item={editing} onSubmit={(d) => update({ id: editing.id, data: d })} onCancel={() => setEditing(null)} loading={updating_loading} />}

      {deleting && (
        <div className="modal-overlay" onClick={() => setDeleting(null)}>
          <div className="modal" style={{ maxWidth: '380px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Experience</h2></div>
            <div className="modal-body"><p style={{ color: 'var(--text-2)' }}>Delete this experience entry? This cannot be undone.</p></div>
            <div className="modal-footer">
              <button onClick={() => setDeleting(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => remove(deleting)} disabled={deleting_loading} className="btn btn-danger">
                {deleting_loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
