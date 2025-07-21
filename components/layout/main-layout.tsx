'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { AuthGuard } from '@/components/auth/auth-guard'

interface MainLayoutProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'operator' | 'viewer'
}

export function MainLayout({ children, requiredRole }: MainLayoutProps) {
  return (
    <AuthGuard requiredRole={requiredRole}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:ml-64">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}