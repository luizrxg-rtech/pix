/**
 * Application constants following DRY principle
 * Centralized configuration to avoid magic numbers/strings
 */

export const APP_CONFIG = {
  name: 'PIX Municipal',
  description: 'Sistema de Gestão de Pagamentos Instantâneos',
  version: '1.0.0',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator', 
  VIEWER: 'viewer',
} as const

export const PIX_KEY_TYPES = {
  CPF: 'cpf',
  CNPJ: 'cnpj',
  EMAIL: 'email',
  PHONE: 'phone',
  RANDOM: 'random',
} as const

export const PIX_KEY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const

export const TRANSACTION_TYPES = {
  IN: 'in',
  OUT: 'out',
} as const

export const REPORT_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
} as const

export const REPORT_STATUS = {
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

/**
 * Role hierarchy for permission checking
 * Higher numbers indicate higher permissions
 */
export const ROLE_HIERARCHY = {
  [USER_ROLES.VIEWER]: 1,
  [USER_ROLES.OPERATOR]: 2,
  [USER_ROLES.ADMIN]: 3,
} as const

/**
 * Navigation items with role-based access control
 */
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    requiredRole: USER_ROLES.VIEWER,
  },
  {
    name: 'Chaves PIX',
    href: '/pix-keys',
    icon: 'CreditCard',
    requiredRole: USER_ROLES.VIEWER,
  },
  {
    name: 'Transações',
    href: '/transactions',
    icon: 'ArrowUpDown',
    requiredRole: USER_ROLES.VIEWER,
  },
  {
    name: 'Relatórios',
    href: '/reports',
    icon: 'FileText',
    requiredRole: USER_ROLES.VIEWER,
  },
  {
    name: 'Usuários',
    href: '/users',
    icon: 'Users',
    requiredRole: USER_ROLES.ADMIN,
  },
  {
    name: 'Configurações',
    href: '/settings',
    icon: 'Settings',
    requiredRole: USER_ROLES.OPERATOR,
  },
] as const