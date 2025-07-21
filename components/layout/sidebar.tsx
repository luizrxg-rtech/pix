'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/providers'
import { filterNavigationByRole } from '@/lib/utils/permissions'
import { NAVIGATION_ITEMS, APP_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  CreditCard,
  ArrowUpDown,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Banknote
} from 'lucide-react'

/**
 * Icon mapping for navigation items
 * Following Open/Closed Principle - easy to extend with new icons
 */
const iconMap = {
  LayoutDashboard,
  CreditCard,
  ArrowUpDown,
  FileText,
  Users,
  Settings,
} as const

/**
 * Sidebar component for navigation
 * Following Single Responsibility Principle - handles only navigation UI
 */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  // Filter navigation items based on user role
  const filteredNavigation = profile 
    ? filterNavigationByRole(profile.role, NAVIGATION_ITEMS)
    : []

  /**
   * Handles sidebar toggle
   * Following Single Responsibility Principle
   */
  const toggleSidebar = () => setIsOpen(!isOpen)

  /**
   * Handles navigation item click
   * Following Single Responsibility Principle
   */
  const handleNavigationClick = () => setIsOpen(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Banknote className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{APP_CONFIG.name}</h1>
              <p className="text-xs text-muted-foreground">{APP_CONFIG.description}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = iconMap[item.icon as keyof typeof iconMap]
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={handleNavigationClick}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-4">
              <p className="text-sm font-medium">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}