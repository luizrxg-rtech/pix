import type { 
  APIResponse, 
  PaginatedResponse, 
  Proposal, 
  Client, 
  Dashboard,
  FilterOptions,
  SortOptions,
  SearchOptions 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class APIError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'APIError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new APIError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new APIError(data.error || 'API request failed', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

export const api = {
  // Dashboard
  dashboard: {
    get: (): Promise<APIResponse<Dashboard>> =>
      request('/dashboard'),
  },

  // Proposals
  proposals: {
    getAll: (
      page = 1,
      limit = 10,
      filters?: FilterOptions,
      sort?: SortOptions,
      search?: SearchOptions
    ): Promise<PaginatedResponse<Proposal>> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(`${key}[]`, v.toString()));
            } else if (typeof value === 'object') {
              params.append(key, JSON.stringify(value));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      if (sort) {
        params.append('sortField', sort.field);
        params.append('sortDirection', sort.direction);
      }

      if (search?.query) {
        params.append('search', search.query);
        if (search.fields) {
          search.fields.forEach(field => 
            params.append('searchFields[]', field)
          );
        }
      }

      return request(`/proposals?${params}`);
    },

    getById: (id: string): Promise<APIResponse<Proposal>> =>
      request(`/proposals/${id}`),

    create: (data: Partial<Proposal>): Promise<APIResponse<Proposal>> =>
      request('/proposals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Proposal>): Promise<APIResponse<Proposal>> =>
      request(`/proposals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<APIResponse<void>> =>
      request(`/proposals/${id}`, {
        method: 'DELETE',
      }),

    updateStatus: (id: string, status: Proposal['status']): Promise<APIResponse<Proposal>> =>
      request(`/proposals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),

    send: (id: string): Promise<APIResponse<Proposal>> =>
      request(`/proposals/${id}/send`, {
        method: 'POST',
      }),

    duplicate: (id: string): Promise<APIResponse<Proposal>> =>
      request(`/proposals/${id}/duplicate`, {
        method: 'POST',
      }),
  },

  // Clients
  clients: {
    getAll: (
      page = 1,
      limit = 10,
      search?: string
    ): Promise<PaginatedResponse<Client>> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      return request(`/clients?${params}`);
    },

    getById: (id: string): Promise<APIResponse<Client>> =>
      request(`/clients/${id}`),

    create: (data: Partial<Client>): Promise<APIResponse<Client>> =>
      request('/clients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Client>): Promise<APIResponse<Client>> =>
      request(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<APIResponse<void>> =>
      request(`/clients/${id}`, {
        method: 'DELETE',
      }),
  },

  // File uploads
  files: {
    upload: async (file: File): Promise<APIResponse<{ url: string; id: string }>> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new APIError(
          `Upload failed: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    },

    delete: (id: string): Promise<APIResponse<void>> =>
      request(`/files/${id}`, {
        method: 'DELETE',
      }),
  },

  // PIX
  pix: {
    generateQRCode: (data: {
      value: number;
      key: string;
      description?: string;
    }): Promise<APIResponse<{ qrCode: string; txId: string }>> =>
      request('/pix/qr-code', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    validateKey: (key: string, type: string): Promise<APIResponse<{ valid: boolean }>> =>
      request('/pix/validate-key', {
        method: 'POST',
        body: JSON.stringify({ key, type }),
      }),

    checkPayment: (txId: string): Promise<APIResponse<{ 
      status: 'pending' | 'paid' | 'expired';
      paidAt?: Date;
      value?: number;
    }>> =>
      request(`/pix/check-payment/${txId}`),
  },
};

export { APIError };