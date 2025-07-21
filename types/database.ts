export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'operator' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'operator' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'operator' | 'viewer'
          updated_at?: string
        }
      }
      pix_keys: {
        Row: {
          id: string
          key_value: string
          key_type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
          owner_name: string
          owner_document: string
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key_value: string
          key_type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
          owner_name: string
          owner_document: string
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key_value?: string
          key_type?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
          owner_name?: string
          owner_document?: string
          status?: 'active' | 'inactive' | 'suspended'
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          transaction_id: string
          amount: number
          description: string | null
          payer_name: string
          payer_document: string
          receiver_key: string
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          transaction_type: 'in' | 'out'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          amount: number
          description?: string | null
          payer_name: string
          payer_document: string
          receiver_key: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          transaction_type: 'in' | 'out'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          amount?: number
          description?: string | null
          payer_name?: string
          payer_document?: string
          receiver_key?: string
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          transaction_type?: 'in' | 'out'
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          title: string
          description: string | null
          report_type: 'daily' | 'weekly' | 'monthly' | 'custom'
          generated_by: string
          file_url: string | null
          status: 'generating' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          report_type: 'daily' | 'weekly' | 'monthly' | 'custom'
          generated_by: string
          file_url?: string | null
          status?: 'generating' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          report_type?: 'daily' | 'weekly' | 'monthly' | 'custom'
          generated_by?: string
          file_url?: string | null
          status?: 'generating' | 'completed' | 'failed'
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'operator' | 'viewer'
      pix_key_type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
      pix_key_status: 'active' | 'inactive' | 'suspended'
      transaction_status: 'pending' | 'completed' | 'failed' | 'cancelled'
      transaction_type: 'in' | 'out'
      report_type: 'daily' | 'weekly' | 'monthly' | 'custom'
      report_status: 'generating' | 'completed' | 'failed'
    }
  }
}