import type { AppConfig } from '@/types';

export const appConfig: AppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  appName: 'PIX Proposals',
  version: '1.0.0',
  environment: (process.env.NODE_ENV as any) || 'development',
  features: {
    notifications: true,
    analytics: true,
    darkMode: true,
    offlineMode: false,
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxAttachments: 5,
    proposalValidDays: 30,
  },
  pix: {
    maxValue: 1000000, // R$ 1M
    minValue: 1, // R$ 0.01
    supportedKeyTypes: ['cpf', 'cnpj', 'email', 'phone', 'random'],
  },
};

export const routes = {
  home: '/',
  dashboard: '/dashboard',
  proposals: '/proposals',
  proposal: (id: string) => `/proposals/${id}`,
  newProposal: '/proposals/new',
  clients: '/clients',
  client: (id: string) => `/clients/${id}`,
  newClient: '/clients/new',
  pix: '/pix',
  settings: '/settings',
  login: '/auth/login',
  register: '/auth/register',
};

export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    accent: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    warning: {
      50: '#fff7ed',
      100: '#ffedd5',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;