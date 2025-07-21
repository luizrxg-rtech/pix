# PIX Municipal - Sistema de Gestão de Pagamentos Instantâneos

Sistema completo de gestão PIX para administração municipal, desenvolvido com Next.js, TypeScript e Supabase.

## 🚀 Tecnologias

- **Frontend**: Next.js 13 com TypeScript
- **Styling**: Tailwind CSS v4 com shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Context API
- **Validação**: Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Funcionalidades

### 🔐 Autenticação e Autorização
- Sistema de login com email/senha
- Controle de acesso baseado em roles (Admin, Operador, Visualizador)
- Proteção de rotas por nível de permissão

### 📊 Dashboard
- Visão geral do sistema com estatísticas
- Gráficos de transações por período
- Transações recentes
- Indicadores de performance

### 🔑 Gestão de Chaves PIX
- Cadastro, edição e exclusão de chaves PIX
- Suporte a todos os tipos: CPF, CNPJ, Email, Telefone, Aleatória
- Controle de status: Ativa, Inativa, Suspensa
- Busca e filtros avançados

### 💰 Transações
- Monitoramento completo de transações
- Filtros por status, tipo e período
- Visualização detalhada de cada transação
- Exportação de dados

### 📄 Relatórios
- Geração de relatórios customizados
- Relatórios pré-definidos (Diário, Semanal, Mensal)
- Download de relatórios em diferentes formatos
- Histórico de relatórios gerados

### 👥 Gestão de Usuários (Admin)
- Cadastro e gerenciamento de usuários
- Controle de permissões por role
- Auditoria de ações dos usuários

## 🏗️ Arquitetura

### Princípios Aplicados

#### CLEAN Code
- Código autodocumentado com nomes descritivos
- Funções pequenas com responsabilidade única
- Separação clara de responsabilidades

#### SOLID Principles
- **S**ingle Responsibility: Cada componente/função tem uma única responsabilidade
- **O**pen/Closed: Componentes abertos para extensão, fechados para modificação
- **L**iskov Substitution: Interfaces bem definidas e substituíveis
- **I**nterface Segregation: Interfaces específicas e focadas
- **D**ependency Inversion: Inversão de dependências com hooks e context

### Estrutura de Pastas

```
├── app/                    # Next.js App Router
│   ├── dashboard/          # Dashboard pages
│   ├── pix-keys/          # PIX keys management
│   ├── transactions/       # Transactions management
│   ├── reports/           # Reports system
│   ├── users/             # User management
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard specific components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   ├── pix-keys/          # PIX keys components
│   ├── transactions/      # Transaction components
│   ├── reports/           # Reports components
│   └── ui/                # UI components (shadcn/ui)
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase configuration
│   ├── constants/         # Application constants
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   └── validations/       # Zod schemas
├── types/                 # TypeScript type definitions
└── supabase/             # Database migrations
```

## 🛠️ Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd pix-municipal
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Execute as migrações do banco de dados no Supabase

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🗃️ Banco de Dados

### Schema Principal

- **users**: Usuários do sistema com controle de roles
- **pix_keys**: Chaves PIX cadastradas
- **transactions**: Transações financeiras
- **reports**: Relatórios gerados

### Segurança
- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso baseadas em roles
- Auditoria automática com timestamps

## 🔒 Segurança

- Autenticação via Supabase Auth
- Controle de acesso baseado em roles
- Validação de dados com Zod
- Sanitização de inputs
- HTTPS obrigatório em produção

## 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados para tablet e desktop
- Componentes adaptáveis a diferentes tamanhos de tela

## 🎨 Design System

- Baseado no shadcn/ui
- Tokens de design consistentes
- Tema claro/escuro
- Animações e micro-interações
- Acessibilidade (WCAG 2.1)

## 🧪 Testes

```bash
# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📦 Build e Deploy

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico, entre em contato através dos canais oficiais do projeto.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.