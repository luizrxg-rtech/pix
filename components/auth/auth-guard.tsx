'use client'

import { useAuth } from '@/components/providers/providers'
import { LoginForm } from '@/components/auth/login-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'operator' | 'viewer'
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || !profile) {
    return <LoginForm />
  }

  if (requiredRole) {
    const roleHierarchy = { admin: 3, operator: 2, viewer: 1 }
    const userLevel = roleHierarchy[profile.role]
    const requiredLevel = roleHierarchy[requiredRole]

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
            <p className="text-gray-600">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}