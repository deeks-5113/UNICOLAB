import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { AppShell } from '@/components/app-shell'

// Pages
import AuthPage from '@/pages/AuthPage'
import DashboardPage from '@/pages/DashboardPage'
import MarketplacePage from '@/pages/MarketplacePage'
import ProfilePage from '@/pages/ProfilePage'
import ProjectsPage from '@/pages/ProjectsPage'
import TeamsPage from '@/pages/TeamsPage'
import CreateProjectPage from '@/pages/CreateProjectPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<AuthPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><AppShell><MarketplacePage /></AppShell></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><AppShell><ProjectsPage /></AppShell></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><AppShell><TeamsPage /></AppShell></ProtectedRoute>} />
          <Route path="/projects/create" element={<ProtectedRoute><AppShell><CreateProjectPage /></AppShell></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </ThemeProvider>
  )
}
