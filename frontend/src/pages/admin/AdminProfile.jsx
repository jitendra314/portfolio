import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { adminApi } from '../../utils/api'
import toast from 'react-hot-toast'
import { User, Lock, Save, CheckCircle2 } from 'lucide-react'

export default function AdminProfile() {
  const { user } = useAuth()
  const [tab, setTab] = useState('profile')

  const profileForm = useForm({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const passwordForm = useForm({
    defaultValues: { current_password: '', password: '', password_confirmation: '' },
  })

  const updateProfile = useMutation({
    mutationFn: (data) => adminApi.updateProfile(data),
    onSuccess: () => toast.success('Profile updated'),
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error updating profile'),
  })

  const updatePassword = useMutation({
    mutationFn: (data) => adminApi.changePassword(data),
    onSuccess: () => { toast.success('Password changed'); passwordForm.reset() },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error changing password'),
  })

  const tabs = [
    { id: 'profile',  label: 'Profile',  icon: User },
    { id: 'password', label: 'Password', icon: Lock },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Profile</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>Manage your admin account</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start', maxWidth: '780px' }}>
        {/* Sidebar */}
        <div className="card" style={{ padding: '0.75rem' }}>
          {/* Avatar */}
          <div style={{ padding: '1rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', margin: '0 auto 0.75rem', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#fff' }}>
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.2rem' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{user?.email}</div>
            {user?.is_admin && <span className="badge purple" style={{ marginTop: '0.5rem' }}>Admin</span>}
          </div>

          <div className="divider" />

          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.6rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '0.87rem', fontWeight: 500, fontFamily: 'inherit',
              background: tab === id ? 'var(--surface-2)' : 'transparent',
              color: tab === id ? 'var(--text)' : 'var(--text-2)',
              transition: 'all 0.15s', marginBottom: '0.15rem',
            }}>
              <Icon size={15} style={{ flexShrink: 0 }} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '1.75rem' }}>
          {tab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(data => updateProfile.mutate(data))}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>Profile Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input className="form-input" {...profileForm.register('name', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" {...profileForm.register('email', { required: true })} />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={updateProfile.isPending} className="btn btn-primary">
                  {updateProfile.isPending ? 'Saving…' : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(data => updatePassword.mutate(data))}>
              <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>Change Password</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input className="form-input" type="password" {...passwordForm.register('current_password', { required: true })} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" {...passwordForm.register('password', { required: true, minLength: { value: 8, message: 'Min 8 characters' } })} />
                  {passwordForm.formState.errors.password && <span className="form-error">{passwordForm.formState.errors.password.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-input" type="password" {...passwordForm.register('password_confirmation', { required: true })} />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={updatePassword.isPending} className="btn btn-primary">
                  {updatePassword.isPending ? 'Updating…' : <><CheckCircle2 size={14} /> Update Password</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
