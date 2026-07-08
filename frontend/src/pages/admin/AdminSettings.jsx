import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { adminApi } from '../../utils/api'
import toast from 'react-hot-toast'
import { Save, Settings, Globe, BarChart2, Download, AlertTriangle } from 'lucide-react'

export default function AdminSettings() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: adminApi.getSettings })
  const settings = data?.data?.data ?? {}

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      reset({
        site_title:        settings.site_title ?? '',
        site_description:  settings.site_description ?? '',
        hero_tagline:      settings.hero_tagline ?? '',
        google_analytics:  settings.google_analytics ?? '',
        resume_download:   settings.resume_download === '1',
        maintenance_mode:  settings.maintenance_mode === '1',
      })
    }
  }, [settings, reset])

  const mutation = useMutation({
    mutationFn: (formData) => adminApi.updateSettings({
      settings: {
        site_title:       formData.site_title,
        site_description: formData.site_description,
        hero_tagline:     formData.hero_tagline,
        google_analytics: formData.google_analytics,
        resume_download:  formData.resume_download ? '1' : '0',
        maintenance_mode: formData.maintenance_mode ? '1' : '0',
      }
    }),
    onSuccess: () => {
      toast.success('Settings saved')
      qc.invalidateQueries({ queryKey: ['admin-settings'] })
    },
    onError: () => toast.error('Error saving settings'),
  })

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '56px', borderRadius: 'var(--radius)' }} />)}
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>Site-wide configuration</p>
      </div>

      <form onSubmit={handleSubmit(mutation.mutate)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '720px' }}>

          {/* SEO */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={14} /> SEO & Branding
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Site Title</label>
                <input className="form-input" placeholder="Alex Morgan — Developer" {...register('site_title')} />
              </div>
              <div className="form-group">
                <label className="form-label">Site Description (meta)</label>
                <textarea className="form-textarea" rows={2} placeholder="Full Stack Developer Portfolio" {...register('site_description')} />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Tagline</label>
                <input className="form-input" placeholder="I build things for the web." {...register('hero_tagline')} />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={14} /> Analytics
            </h2>
            <div className="form-group">
              <label className="form-label">Google Analytics ID</label>
              <input className="form-input" placeholder="G-XXXXXXXXXX" {...register('google_analytics')} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>Leave blank to disable tracking</span>
            </div>
          </div>

          {/* Features */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={14} /> Features
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: 'var(--bg-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <input type="checkbox" {...register('resume_download')} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Download size={13} /> Enable Resume Download</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>Show download CV button on About page</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: 'rgba(255,181,71,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(255,181,71,0.2)' }}>
                <input type="checkbox" {...register('maintenance_mode')} style={{ accentColor: 'var(--amber)', width: 16, height: 16 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber)' }}><AlertTriangle size={13} /> Maintenance Mode</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>Show a coming-soon page to visitors (admin still has access)</div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={mutation.isPending} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <Save size={15} /> {mutation.isPending ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
