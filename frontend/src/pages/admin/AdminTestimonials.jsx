import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, Star } from 'lucide-react'
import { useCrud } from '../../hooks/useCrud'
import { adminApi } from '../../utils/api'

const api = {
  getAll: adminApi.getTestimonials,
  create: adminApi.createTestimonial,
  update: (id, data) => adminApi.updateTestimonial(id, data),
  remove: adminApi.deleteTestimonial,
}

function TestimonialForm({ item, onSubmit, onCancel, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name:         item?.name ?? '',
      role:         item?.role ?? '',
      company:      item?.company ?? '',
      content:      item?.content ?? '',
      rating:       item?.rating ?? 5,
      is_published: item?.is_published ?? true,
      order:        item?.order ?? 0,
    },
  })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h2>{item ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <button onClick={onCancel} className="btn btn-ghost btn-icon">✕</button>
        </div>
        <form onSubmit={handleSubmit(d => onSubmit({ ...d, rating: parseInt(d.rating), order: parseInt(d.order) }))}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" {...register('name', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <input className="form-input" placeholder="CTO, Founder…" {...register('role', { required: true })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" {...register('company')} />
            </div>

            <div className="form-group">
              <label className="form-label">Testimonial *</label>
              <textarea className="form-textarea" rows={4} {...register('content', { required: true })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Rating (1–5)</label>
                <select className="form-select" {...register('rating')}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Order</label>
                <input className="form-input" type="number" {...register('order')} />
              </div>
              <div className="form-group">
                <label className="form-label">Published</label>
                <select className="form-select" {...register('is_published')}>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
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

export default function AdminTestimonials() {
  const {
    items, isLoading,
    editing, setEditing,
    creating, setCreating,
    deleting, setDeleting,
    create, update, remove,
    creating_loading, updating_loading, deleting_loading,
  } = useCrud('admin-testimonials', api)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Testimonials</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{items.length} total</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {items.map(t => (
            <div key={t.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill={i < t.rating ? 'var(--amber)' : 'none'} color={i < t.rating ? 'var(--amber)' : 'var(--text-3)'} />
                  ))}
                </div>
                <span className={`badge ${t.is_published ? 'green' : 'amber'}`}>
                  {t.is_published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>
                "{t.content}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-2)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                      {t.role}{t.company ? ` · ${t.company}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditing(t)}><Edit2 size={13} /></button>
                  <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDeleting(t.id)}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-3)' }}>
              No testimonials yet.
            </div>
          )}
        </div>
      )}

      {creating && <TestimonialForm onSubmit={create} onCancel={() => setCreating(false)} loading={creating_loading} />}
      {editing  && <TestimonialForm item={editing} onSubmit={(d) => update({ id: editing.id, data: d })} onCancel={() => setEditing(null)} loading={updating_loading} />}

      {deleting && (
        <div className="modal-overlay" onClick={() => setDeleting(null)}>
          <div className="modal" style={{ maxWidth: '380px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Testimonial</h2></div>
            <div className="modal-body"><p style={{ color: 'var(--text-2)' }}>Delete this testimonial? This cannot be undone.</p></div>
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
