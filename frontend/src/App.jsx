import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Public pages
import PublicLayout    from './components/public/PublicLayout'
import HomePage        from './pages/public/HomePage'
import ProjectsPage    from './pages/public/ProjectsPage'
import ProjectDetail   from './pages/public/ProjectDetail'
import AboutPage       from './pages/public/AboutPage'
import ContactPage     from './pages/public/ContactPage'
import BlogPage        from './pages/public/BlogPage'
import BlogDetailPage  from './pages/public/BlogDetailPage'
import NotFoundPage    from './pages/public/NotFoundPage'

// Admin pages
import AdminLayout       from './components/admin/AdminLayout'
import LoginPage         from './pages/admin/LoginPage'
import DashboardPage     from './pages/admin/DashboardPage'
import AdminProjects     from './pages/admin/AdminProjects'
import AdminSkills       from './pages/admin/AdminSkills'
import AdminExperiences  from './pages/admin/AdminExperiences'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminContacts     from './pages/admin/AdminContacts'
import AdminAbout        from './pages/admin/AdminAbout'
import AdminSettings     from './pages/admin/AdminSettings'
import AdminBlog         from './pages/admin/AdminBlog'
import AdminProfile      from './pages/admin/AdminProfile'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2, retry: 1 } },
})

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="loading-screen">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <span className="spinner" style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: '0.88rem' }}>Loading…</span>
      </div>
    </div>
  )
  if (!user || !user.is_admin) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  border: '1px solid var(--border-2)',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                },
              }}
            />
            <Routes>
              {/* Public */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:slug" element={<ProjectDetail />} />
                <Route path="about"    element={<AboutPage />} />
                <Route path="contact"  element={<ContactPage />} />
                <Route path="blog"     element={<BlogPage />} />
                <Route path="blog/:slug" element={<BlogDetailPage />} />
                <Route path="*"        element={<NotFoundPage />} />
              </Route>

              {/* Admin auth */}
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Admin protected */}
              <Route path="/admin" element={
                <ProtectedRoute><AdminLayout /></ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="projects"     element={<AdminProjects />} />
                <Route path="skills"       element={<AdminSkills />} />
                <Route path="experiences"  element={<AdminExperiences />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="contacts"     element={<AdminContacts />} />
                <Route path="blog"         element={<AdminBlog />} />
                <Route path="about"        element={<AdminAbout />} />
                <Route path="settings"     element={<AdminSettings />} />
                <Route path="profile"      element={<AdminProfile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
