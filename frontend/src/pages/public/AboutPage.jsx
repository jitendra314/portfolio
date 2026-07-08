import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../../utils/api'
import { MapPin, Mail, Phone, Github, Linkedin, Twitter, Dribbble, Download, Briefcase, Calendar } from 'lucide-react'

export default function AboutPage() {
  const { data: aboutData }      = useQuery({ queryKey: ['about'],       queryFn: publicApi.getAbout })
  const { data: skillsData }     = useQuery({ queryKey: ['skills'],      queryFn: publicApi.getSkills })
  const { data: experienceData } = useQuery({ queryKey: ['experiences'], queryFn: publicApi.getExperiences })

  const about      = aboutData?.data?.data
  const skills     = skillsData?.data?.data ?? {}
  const experiences = experienceData?.data?.data ?? []

  const socialIcons = { github: Github, linkedin: Linkedin, twitter: Twitter, dribbble: Dribbble }

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <div className="container" style={{ paddingTop: '4rem' }}>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <div className="tag" style={{ marginBottom: '0.75rem' }}>About Me</div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem' }}>{about?.name ?? 'Alex Morgan'}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--accent-2)', fontWeight: 600, marginBottom: '1.25rem' }}>{about?.title}</p>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '2rem' }}>{about?.bio}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {about?.location && <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.88rem' }}><MapPin size={15} /> {about.location}</div>}
              {about?.email    && <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.88rem' }}><Mail size={15} />    {about.email}</div>}
              {about?.phone    && <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-2)', fontSize: '0.88rem' }}><Phone size={15} />   {about.phone}</div>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {about?.resume_url && <a href={about.resume_url} target="_blank" rel="noreferrer" className="btn btn-primary"><Download size={15} /> Download CV</a>}
              {Object.entries(about?.social_links ?? {}).map(([key, url]) => {
                const Icon = socialIcons[key]
                return Icon ? <a key={key} href={url} target="_blank" rel="noreferrer" className="btn btn-outline btn-icon"><Icon size={16} /></a> : null
              })}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Years of Experience', value: about?.years_experience ?? 5,  color: 'var(--accent)' },
              { label: 'Projects Completed',  value: about?.projects_completed ?? 40, color: 'var(--green)' },
              { label: 'Clients Served',      value: about?.clients_served ?? 18,    color: 'var(--amber)' },
              { label: 'Open to Work',        value: about?.open_to_work ? 'Yes' : 'No', color: about?.open_to_work ? 'var(--green)' : 'var(--text-3)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color, fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>{value}{typeof value === 'number' ? '+' : ''}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {Object.keys(skills).length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <div className="tag" style={{ marginBottom: '0.75rem' }}>Expertise</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '2.5rem' }}>Skills & Technologies</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-2)', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{category}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {items.map(skill => (
                      <div key={skill.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 500 }}>{skill.name}</span>
                          <span style={{ color: 'var(--text-3)' }}>{skill.proficiency}%</span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--bg-3)', borderRadius: '100px' }}>
                          <div style={{ height: '100%', width: `${skill.proficiency}%`, background: skill.color || 'var(--accent)', borderRadius: '100px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <div className="tag" style={{ marginBottom: '0.75rem' }}>Career</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '2.5rem' }}>Work Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {experiences.map(exp => (
                <div key={exp.id} className="card" style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{exp.role}</h3>
                      {exp.is_current && <span className="badge green">Current</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--accent-2)', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Briefcase size={13} /> {exp.company}
                      </span>
                      <span style={{ color: 'var(--text-3)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} />
                        {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        {' → '}
                        {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                      </span>
                      {exp.location && <span style={{ color: 'var(--text-3)', fontSize: '0.82rem' }}>{exp.location}</span>}
                    </div>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.7 }}>{exp.description}</p>
                    {exp.responsibilities?.length > 0 && (
                      <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {exp.responsibilities.map((r, i) => <li key={i} style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>{r}</li>)}
                      </ul>
                    )}
                    {exp.tech_used?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '1rem' }}>
                        {exp.tech_used.map(t => <span key={t} style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'var(--bg-3)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span className="tag" style={{ fontSize: '0.7rem' }}>{exp.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
