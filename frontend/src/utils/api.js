import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_token')
      localStorage.removeItem('portfolio_user')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ── Public API helpers ────────────────────────────────────
export const publicApi = {
  getAbout:        () => api.get('/about'),
  getProjects:     () => api.get('/projects'),
  getProject:      (slug) => api.get(`/projects/${slug}`),
  getSkills:       () => api.get('/skills'),
  getExperiences:  () => api.get('/experiences'),
  getTestimonials: () => api.get('/testimonials'),
  getSettings:     () => api.get('/settings'),
  sendContact:     (data) => api.post('/contact', data),
}

// ── Admin Auth ────────────────────────────────────────────
export const authApi = {
  login:   (data)  => api.post('/auth/login', data),
  logout:  ()      => api.post('/auth/logout'),
  me:      ()      => api.get('/auth/me'),
  refresh: ()      => api.post('/auth/refresh'),
}

// ── Admin API helpers ─────────────────────────────────────
export const adminApi = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),

  // Projects
  getProjects:     ()          => api.get('/admin/projects'),
  getProject:      (id)        => api.get(`/admin/projects/${id}`),
  createProject:   (data)      => api.post('/admin/projects', data),
  updateProject:   (id, data)  => api.put(`/admin/projects/${id}`, data),
  deleteProject:   (id)        => api.delete(`/admin/projects/${id}`),
  toggleFeatured:  (id)        => api.patch(`/admin/projects/${id}/toggle`),

  // Skills
  getSkills:    ()         => api.get('/admin/skills'),
  createSkill:  (data)     => api.post('/admin/skills', data),
  updateSkill:  (id, data) => api.put(`/admin/skills/${id}`, data),
  deleteSkill:  (id)       => api.delete(`/admin/skills/${id}`),

  // Experiences
  getExperiences:   ()         => api.get('/admin/experiences'),
  createExperience: (data)     => api.post('/admin/experiences', data),
  updateExperience: (id, data) => api.put(`/admin/experiences/${id}`, data),
  deleteExperience: (id)       => api.delete(`/admin/experiences/${id}`),

  // Testimonials
  getTestimonials:   ()         => api.get('/admin/testimonials'),
  createTestimonial: (data)     => api.post('/admin/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id)       => api.delete(`/admin/testimonials/${id}`),

  // About
  getAbout:    ()     => api.get('/admin/about'),
  updateAbout: (data) => api.put('/admin/about', data),

  // Settings
  getSettings:    ()     => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),

  // Contacts
  getContacts:    ()   => api.get('/admin/contacts'),
  markRead:       (id) => api.patch(`/admin/contacts/${id}/read`),
  deleteContact:  (id) => api.delete(`/admin/contacts/${id}`),

  // Upload
  uploadFile: (file, folder = 'uploads') => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    return api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

// ── Blog public ───────────────────────────────────────────
publicApi.getBlogPosts = () => api.get('/blog')
publicApi.getBlogPost  = (slug) => api.get(`/blog/${slug}`)

// ── Blog admin ────────────────────────────────────────────
adminApi.getBlogPosts    = ()          => api.get('/admin/blog')
adminApi.getBlogPost     = (id)        => api.get(`/admin/blog/${id}`)
adminApi.createBlogPost  = (data)      => api.post('/admin/blog', data)
adminApi.updateBlogPost  = (id, data)  => api.put(`/admin/blog/${id}`, data)
adminApi.deleteBlogPost  = (id)        => api.delete(`/admin/blog/${id}`)

// ── Profile ───────────────────────────────────────────────
adminApi.updateProfile  = (data) => api.put('/admin/profile', data)
adminApi.changePassword = (data) => api.put('/admin/profile/password', data)
