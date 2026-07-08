import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Send, Mail, MapPin, MessageSquare } from 'lucide-react'
import { publicApi } from '../../utils/api'

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const { data: aboutData } = useQuery({ queryKey: ['about'], queryFn: publicApi.getAbout })
  const about = aboutData?.data?.data

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await publicApi.sendContact(data)
      toast.success('Message sent! I\'ll get back to you soon.')
      reset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 4rem' }}>
          <div className="tag" style={{ marginBottom: '0.75rem' }}>Get In Touch</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>Let's Talk</h1>
          <p style={{ color: 'var(--text-2)' }}>
            Have a project idea? Want to collaborate? Or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start', maxWidth: '900px', margin: '0 auto' }}>
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { icon: Mail,         label: 'Email',    value: about?.email || 'alex@portfolio.dev' },
              { icon: MapPin,       label: 'Location', value: about?.location || 'San Francisco, CA' },
              { icon: MessageSquare,label: 'Response', value: 'Within 24 hours' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'rgba(124,106,247,0.12)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="var(--accent-2)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" placeholder="Your name" {...register('name', { required: 'Name is required' })} />
                  {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" placeholder="you@email.com" {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input className="form-input" placeholder="Project inquiry, collaboration, etc." {...register('subject', { required: 'Subject is required' })} />
                {errors.subject && <span className="form-error">{errors.subject.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-textarea" placeholder="Tell me about your project or just say hi…" rows={5} {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'At least 20 characters please' } })} />
                {errors.message && <span className="form-error">{errors.message.message}</span>}
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }}>
                {submitting ? 'Sending…' : <><Send size={15} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
