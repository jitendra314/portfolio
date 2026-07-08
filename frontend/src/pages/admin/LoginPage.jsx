import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Code2, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { user, login } = useAuth()
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: 'admin@portfolio.dev', password: 'admin123' }
  })

  if (user?.is_admin) return <Navigate to="/admin" replace />

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 52, height: 52, background: 'var(--accent)', borderRadius: 14, display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}>
            <Code2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.4rem' }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.88rem' }}>Sign in to manage your portfolio</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input className="form-input" type="email" style={{ paddingLeft: '2.4rem' }}
                  {...register('email', { required: 'Email is required' })} />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input className="form-input" type={showPass ? 'text' : 'password'} style={{ paddingLeft: '2.4rem', paddingRight: '2.8rem' }}
                  {...register('password', { required: 'Password is required' })} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.25rem' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          Default: admin@portfolio.dev / admin123
        </p>
      </div>
    </div>
  )
}
