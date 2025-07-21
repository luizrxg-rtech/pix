/*
  # PIX Management System Database Schema

  1. New Tables
    - `users` - System users with role-based access
    - `pix_keys` - PIX keys management 
    - `transactions` - Financial transactions
    - `reports` - System reports
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    
  3. Features
    - Complete PIX key lifecycle management
    - Transaction processing and monitoring
    - Comprehensive reporting system
    - User management with different access levels
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'operator', 'viewer');
CREATE TYPE pix_key_type AS ENUM ('cpf', 'cnpj', 'email', 'phone', 'random');
CREATE TYPE pix_key_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('in', 'out');
CREATE TYPE report_type AS ENUM ('daily', 'weekly', 'monthly', 'custom');
CREATE TYPE report_status AS ENUM ('generating', 'completed', 'failed');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role user_role DEFAULT 'viewer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PIX Keys table
CREATE TABLE IF NOT EXISTS pix_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_value text UNIQUE NOT NULL,
  key_type pix_key_type NOT NULL,
  owner_name text NOT NULL,
  owner_document text NOT NULL,
  status pix_key_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  amount decimal(15,2) NOT NULL,
  description text,
  payer_name text NOT NULL,
  payer_document text NOT NULL,
  receiver_key text NOT NULL,
  status transaction_status DEFAULT 'pending',
  transaction_type transaction_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  report_type report_type NOT NULL,
  generated_by uuid REFERENCES users(id),
  file_url text,
  status report_status DEFAULT 'generating',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read all profiles" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for pix_keys table
CREATE POLICY "All authenticated users can read PIX keys" ON pix_keys
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Operators and admins can manage PIX keys" ON pix_keys
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Create policies for transactions table
CREATE POLICY "All authenticated users can read transactions" ON transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Operators and admins can manage transactions" ON transactions
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

-- Create policies for reports table
CREATE POLICY "All authenticated users can read reports" ON reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create reports" ON reports
  FOR INSERT TO authenticated 
  WITH CHECK (generated_by = auth.uid());

CREATE POLICY "Users can update own reports" ON reports
  FOR UPDATE TO authenticated 
  USING (generated_by = auth.uid());

CREATE POLICY "Admins can manage all reports" ON reports
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_pix_keys_value ON pix_keys(key_value);
CREATE INDEX IF NOT EXISTS idx_pix_keys_type ON pix_keys(key_type);
CREATE INDEX IF NOT EXISTS idx_pix_keys_status ON pix_keys(status);
CREATE INDEX IF NOT EXISTS idx_transactions_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generated_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pix_keys_updated_at BEFORE UPDATE ON pix_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();