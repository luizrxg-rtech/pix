'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ProposalCard } from '@/components/proposals/proposal-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  CreditCard,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react';
import type { Proposal, TimelineEvent, Dashboard } from '@/types';

// Mock data for demonstration
const mockDashboard: Dashboard = {
  totalProposals: 156,
  pendingProposals: 23,
  approvedProposals: 89,
  totalValue: 2450000,
  monthlyGrowth: 12.5,
  recentActivity: [
    {
      id: '1',
      type: 'approved',
      title: 'Proposta aprovada',
      description: 'Proposta #12345 foi aprovada pelo cliente ABC Corp',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: { id: '1', name: 'João Silva', email: 'joao@email.com', role: 'manager' as const, createdAt: new Date(), updatedAt: new Date() },
    },
    {
      id: '2',
      type: 'created',
      title: 'Nova proposta criada',
      description: 'Proposta para implementação de sistema PIX',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'agent' as const, createdAt: new Date(), updatedAt: new Date() },
    },
    {
      id: '3',
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'PIX de R$ 15.000,00 confirmado',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', role: 'admin' as const, createdAt: new Date(), updatedAt: new Date() },
    },
  ],
  topClients: [],
  paymentMethodsStats: [
    { method: 'pix', count: 89, percentage: 65, totalValue: 1890000 },
    { method: 'boleto', count: 34, percentage: 25, totalValue: 420000 },
    { method: 'card', count: 14, percentage: 10, totalValue: 140000 },
  ],
};

const mockRecentProposals: Proposal[] = [
  {
    id: '1',
    title: 'Sistema PIX para E-commerce',
    description: 'Implementação completa de sistema PIX para loja virtual com integração API e dashboard administrativo.',
    clientId: '1',
    client: {
      id: '1',
      name: 'Tech Solutions LTDA',
      email: 'contato@techsolutions.com',
      phone: '(11) 99999-9999',
      document: '12345678000123',
      documentType: 'cnpj',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    authorId: '1',
    status: 'pending',
    value: 75000,
    paymentMethod: 'pix',
    attachments: [],
    timeline: [],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Gateway de Pagamentos',
    description: 'Desenvolvimento de gateway personalizado com suporte a PIX, cartões e boleto bancário.',
    clientId: '2',
    client: {
      id: '2',
      name: 'StartupPay',
      email: 'dev@startuppay.com',
      phone: '(21) 88888-8888',
      document: '98765432000187',
      documentType: 'cnpj',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    authorId: '2',
    status: 'approved',
    value: 125000,
    paymentMethod: 'pix',
    attachments: [],
    timeline: [],
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Consultoria FinTech',
    description: 'Consultoria especializada em regulamentações PIX e implementação de melhores práticas.',
    clientId: '3',
    client: {
      id: '3',
      name: 'FinanceMax',
      email: 'projetos@financemax.com.br',
      phone: '(31) 77777-7777',
      document: '11223344000156',
      documentType: 'cnpj',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    authorId: '1',
    status: 'sent',
    value: 35000,
    paymentMethod: 'boleto',
    attachments: [],
    timeline: [],
    validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard>(mockDashboard);
  const [recentProposals, setRecentProposals] = useState<Proposal[]>(mockRecentProposals);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-muted rounded-xl"></div>
              <div className="h-96 bg-muted rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">Sistema PIX</span>
              <br />
              <span className="text-gray-900">Propostas Inteligentes</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl">
              Gerencie propostas comerciais, integre pagamentos PIX e acompanhe 
              o desempenho em tempo real com nossa plataforma moderna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="shadow-xl">
                <Plus className="h-5 w-5 mr-2" />
                Nova Proposta
              </Button>
              <Button variant="outline" size="lg">
                <BarChart3 className="h-5 w-5 mr-2" />
                Ver Relatórios
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Propostas"
            value={dashboard.totalProposals}
            description="Propostas criadas este mês"
            icon={FileText}
            trend={{
              value: dashboard.monthlyGrowth,
              label: 'vs mês anterior',
              direction: 'up',
            }}
          />
          <StatsCard
            title="Valor Total"
            value={formatCurrency(dashboard.totalValue)}
            description="Em propostas ativas"
            icon={DollarSign}
            trend={{
              value: 8.2,
              label: 'vs mês anterior',
              direction: 'up',
            }}
          />
          <StatsCard
            title="Pendentes"
            value={dashboard.pendingProposals}
            description="Aguardando aprovação"
            icon={Clock}
            className="border-warning-200 bg-warning-50 dark:bg-warning-950 dark:border-warning-800"
          />
          <StatsCard
            title="Taxa de Aprovação"
            value={`${Math.round((dashboard.approvedProposals / dashboard.totalProposals) * 100)}%`}
            description="Propostas aprovadas"
            icon={CheckCircle}
            trend={{
              value: 5.7,
              label: 'vs mês anterior',
              direction: 'up',
            }}
            className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
          />
        </section>

        {/* Payment Methods Stats */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Métodos de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dashboard.paymentMethodsStats.map((stat) => (
                  <div key={stat.method} className="text-center space-y-2">
                    <div className="text-2xl font-bold">
                      {stat.count}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">
                      {stat.method}
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {formatCurrency(stat.totalValue)}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Proposals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Propostas Recentes
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {recentProposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onView={(proposal) => console.log('View proposal:', proposal.id)}
                  onEdit={(proposal) => console.log('Edit proposal:', proposal.id)}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <RecentActivity activities={dashboard.recentActivity} />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Proposta
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Reunião
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}