export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'agent';
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
  documentType: 'cpf' | 'cnpj';
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}


export type PaymentMethod = 'pix' | 'boleto' | 'card' | 'transfer';

export interface PIXData {
  key: string;
  keyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  receiverName: string;
  receiverDocument: string;
  qrCode?: string;
  txId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'payment' | 'note';
  title: string;
  description?: string;
  userId?: string;
  user?: User;
  createdAt: Date;
}

export interface Dashboard {
  totalValue: number;
  monthlyGrowth: number;
  recentActivity: TimelineEvent[];
  topClients: ClientStats[];
  paymentMethodsStats: PaymentMethodStats[];
}

export interface ClientStats {
  client: Client;
  totalValue: number;
  approvalRate: number;
}

export interface PaymentMethodStats {
  method: PaymentMethod;
  count: number;
  percentage: number;
  totalValue: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  userId: string;
  createdAt: Date;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  paymentMethod?: PaymentMethod[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  clientId?: string;
  authorId?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchOptions {
  query: string;
  fields?: string[];
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

// Form Types
export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'cpf' | 'cnpj';
  address?: Partial<Address>;
}

// Hooks Types
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}


// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

// Event Types
export interface CustomEventMap {
  'notification:new': CustomEvent<{ notification: Notification }>;
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    notifications: boolean;
    analytics: boolean;
    offlineMode: boolean;
  };
  limits: {
    maxFileSize: number;
    maxAttachments: number;
  };
  pix: {
    maxValue: number;
    minValue: number;
    supportedKeyTypes: PIXData['keyType'][];
  };
}