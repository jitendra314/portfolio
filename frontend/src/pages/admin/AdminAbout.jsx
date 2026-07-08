import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { adminApi } from '../../utils/api'
import toast from 'react-hot-toast'
import { Save, User } from 'lucide-react'

export default function AdminAbout() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['admin-about'], queryFn: adminApi.getAbout })
  const about = data?.data?.data

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (about) {
      reset({
        name:               about.name ?? '',
        title:              about.title ?? '',
        bio:                about.bio ?? '',
        location:           about.location ?? '',
        email:              about.email ?? '',
        phone:              about.phone ?? '',
        resume_url:         about.resume_url ?? '',
        years_experience:   about.years_experience ?? 0,
        projects_completed: about.projects_completed ?? 0,
        clients_served:     about.clients_served ?? 0,
        open_to_work:       about.open_to_work ?? true,
        github:             about.social_links?.github ?? '',
        linkedin:           about.social_links?.linkedin ?? '',
        twitter:            about.social_links?.twitter ?? '',
        dribbble:           about.social_links?.dribbble ?? '',
      })
    }
  }, [about, reset])

  const mutation = useMutation({
    mutationFn: adminApi.updateAbout,
    onSuccess: () => {
      toast.success('About updated successfully')
      qc.invalidateQueries({ queryKey: ['admin-about'] })
    },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error saving'),
  })

  const onSubmit = (data) => {
    const { github, linkedin, twitter, dribbble, ...rest } = data
    mutation.mutate({
      ...rest,
      years_experience:   parseInt(rest.years_experience) || 0,
      projects_completed: parseInt(rest.projects_completed) || 0,
      clients_served:     parseInt(rest.clients_served) || 0,
      social_links: { github, linkedin, twitter, dribbble },
    })
  }

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: '56px', borderRadius: 'var(--radius)' }} />)}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>About</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>Your personal information shown on the site</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Basic info */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={14} /> Basic Info
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" {...register('name')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title / Headline</label>
                  <input className="form-input" placeholder="Full Stack Developer & UI Craftsman" {...register('title')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" rows={5} {...register('bio')} />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Contact & Location
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="San Francisco, CA" {...register('location')} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" {...register('email')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" {...register('phone')} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Resume / CV URL</label>
                  <input className="form-input" type="url" placeholder="https://…" {...register('resume_url')} />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Stats */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Stats (shown on homepage)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Years Exp.</label>
                    <input className="form-input" type="number" min="0" {...register('years_experience')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Projects</label>
                    <input className="form-input" type="number" min="0" {...register('projects_completed')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Clients</label>
                    <input className="form-input" type="number" min="0" {...register('clients_served')} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', padding: '0.75rem', background: 'var(--bg-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <input type="checkbox" {...register('open_to_work')} style={{ accentColor: 'var(--green)', width: 16, height: 16 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Open to Work</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Show "Open to opportunities" badge on homepage</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Social links */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                Social Links
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { key: 'github',   label: 'GitHub',   placeholder: 'https://github.com/username' },
                  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                  { key: 'twitter',  label: 'Twitter',  placeholder: 'https://twitter.com/username' },
                  { key: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input className="form-input" type="url" placeholder={placeholder} {...register(key)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={mutation.isPending} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <Save size={15} /> {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
