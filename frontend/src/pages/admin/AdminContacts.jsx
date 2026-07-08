import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../utils/api'
import toast from 'react-hot-toast'
import { Mail, MailOpen, Trash2, Eye, X, Search, Inbox } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'
import ConfirmDialog from '../../components/shared/ConfirmDialog'

export default function AdminContacts() {
  const qc = useQueryClient()
  const [viewing, setViewing]   = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const debouncedSearch = useDebounce(search, 250)

  const { data, isLoading } = useQuery({ queryKey: ['admin-contacts'], queryFn: adminApi.getContacts })
  const allContacts = data?.data?.data ?? []
  const unread = allContacts.filter(c => !c.is_read).length

  const contacts = allContacts.filter(c => {
    const matchSearch = !debouncedSearch ||
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'unread' ? !c.is_read : c.is_read)
    return matchSearch && matchFilter
  })

  const markReadMutation = useMutation({
    mutationFn: adminApi.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-contacts'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteContact,
    onSuccess: () => {
      toast.success('Message deleted')
      setDeleting(null)
      qc.invalidateQueries({ queryKey: ['admin-contacts'] })
    },
  })

  const openMessage = (contact) => {
    setViewing(contact)
    if (!contact.is_read) markReadMutation.mutate(contact.id)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Contact Messages</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>
            {allContacts.length} total
            {unread > 0 && <span style={{ color: 'var(--red)', marginLeft: '0.5rem' }}>· {unread} unread</span>}
          </p>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div className="search-wrap" style={{ flex: 1, minWidth: '220px', maxWidth: '320px' }}>
          <Search size={15} />
          <input className="form-input" placeholder="Search by name, email, subject…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[
            { id: 'all',    label: `All (${allContacts.length})` },
            { id: 'unread', label: `Unread (${unread})` },
            { id: 'read',   label: `Read (${allContacts.length - unread})` },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '0.4rem 0.85rem', borderRadius: '100px', fontSize: '0.79rem', fontWeight: 600,
              border: '1px solid', cursor: 'pointer', fontFamily: 'inherit',
              background: filter === t.id ? 'var(--accent)' : 'transparent',
              borderColor: filter === t.id ? 'var(--accent)' : 'var(--border-2)',
              color: filter === t.id ? '#fff' : 'var(--text-2)', transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '8px' }} />)}
        </div>
      ) : (
        <div className="card animate-fade-up">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 24 }}></th>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} style={{ opacity: c.is_read ? 0.75 : 1, cursor: 'pointer' }} onClick={() => openMessage(c)}>
                    <td>{c.is_read ? <MailOpen size={15} color="var(--text-3)" /> : <Mail size={15} color="var(--accent-2)" />}</td>
                    <td>
                      <div style={{ fontWeight: c.is_read ? 400 : 700, color: 'var(--text)', fontSize: '0.87rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{c.email}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: c.is_read ? 400 : 600, fontSize: '0.87rem', color: c.is_read ? 'var(--text-2)' : 'var(--text)' }}>
                        {c.subject}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Read" onClick={() => openMessage(c)}><Eye size={14} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} title="Delete" onClick={() => setDeleting(c.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <Inbox size={28} />
                        <h3>No messages</h3>
                        <p>{search ? 'No results match your search.' : 'Your inbox is empty.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View message modal */}
      {viewing && (
        <div className="modal-overlay" onClick={() => setViewing(null)}>
          <div className="modal" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1rem' }}>{viewing.subject}</h2>
              <button onClick={() => setViewing(null)} className="btn btn-ghost btn-icon"><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '0.75rem', background: 'var(--bg-3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{viewing.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-2)' }}>{viewing.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Received</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>{formatDate(viewing.created_at)}</div>
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-3)', borderRadius: '8px', lineHeight: 1.75, fontSize: '0.9rem', color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>
                {viewing.message}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setViewing(null)} className="btn btn-outline">Close</button>
              <a href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`} className="btn btn-primary">
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Message"
        message="Permanently delete this message? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteMutation.mutate(deleting)}
        onCancel={() => setDeleting(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
