'use client';

import {useEffect, useState} from 'react';
import {Header} from '@/components/layout/header';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {PixIcon} from '@/components/ui/pix-icon';
import {cn, formatCurrency} from '@/lib/utils';
import {AlertCircle, ArrowRight, ArrowRightLeft, CheckCircle, Clock, Copy, DollarSign, Key} from 'lucide-react';
import Image from "next/image";

const pixDashboard = {
  totalTransactions: 1247,
  totalValue: 3450000,
  staticPixTransactions: 856,
  dynamicPixTransactions: 391,
  monthlyGrowth: 18.5,
  todayTransactions: 89,
  pendingTransactions: 12,
  failedTransactions: 3,
};

const recentTransactions = [
  {
    id: '1',
    type: 'static',
    amount: 150.00,
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    description: 'Pagamento recebido via Chave PIX',
    pixKey: 'usuario@email.com',
  },
  {
    id: '2',
    type: 'dynamic',
    amount: 2500.00,
    status: 'completed',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    description: 'Cobrança PIX dinâmica paga',
    pixKey: '+5511999999999',
  },
  {
    id: '3',
    type: 'static',
    amount: 75.50,
    status: 'pending',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    description: 'Aguardando confirmação PIX',
    pixKey: '12345678901',
  },
  {
    id: '4',
    type: 'dynamic',
    amount: 1200.00,
    status: 'failed',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    description: 'Falha na transação PIX',
    pixKey: 'empresa@pix.com',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'static':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'dynamic':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Concluída';
    case 'pending':
      return 'Pendente';
    case 'failed':
      return 'Falhou';
    default:
      return 'Desconhecido';
  }
};

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter recent transactions based on selected filters
  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const handleViewAll = () => {
    window.location.href = '/transactions';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <section className="">
        <div className="container flex flex-row justify-between mx-auto px-4 py-12">
          <div className="flex flex-col max-w-4xl items-start space-y-6">
            <div className="flex items-start space-x-3 mb-4">
              <h1 className="text-4xl font-bold text-black">
                Monitoramento PIX
              </h1>
              <PixIcon size={48} className="text-black"/>
            </div>
            <p className="flex items-center justify-start text-xl text-muted-foreground max-w-2xl text-start">
              Gerencie pagamentos Chave PIX e dinâmicos com facilidade.
              Monitore transações em tempo real e tenha controle total sobre seus recebimentos.
            </p>
          </div>
          <Image
            alt="Logo"
            src="/images/logo.png"
            width={2196}
            height={803}
            className="w-auto h-32"
          />
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{pixDashboard.totalTransactions}</p>
                  <p className="text-sm text-muted-foreground">Total de Transações</p>
                </div>
                <ArrowRightLeft className="h-8 w-8 text-blue-500"/>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(pixDashboard.totalValue)}
                  </p>
                  <p className="text-sm text-muted-foreground">Volume Total</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500"/>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{pixDashboard.failedTransactions}</p>
                  <p className="text-sm text-muted-foreground">Erros</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500"/>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {pixDashboard.todayTransactions}
                  </p>
                  <p className="text-sm text-muted-foreground">Transações hoje</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500"/>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Transações Recentes
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleViewAll}>
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-2"/>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">Todos os status</option>
                    <option value="completed">Concluídas</option>
                    <option value="pending">Pendentes</option>
                    <option value="failed">Falharam</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Tipo</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="static">Chave PIX</option>
                    <option value="dynamic">PIX Copia e Cola</option>
                  </select>
                </div>
              </div>

              <div>
                {filteredTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={cn(
                      filteredTransactions.length - 1 !== index && "border-b",
                      "py-3"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(getTypeColor(transaction.type), "h-10 w-10 rounded-lg flex items-center justify-center")}>
                          {transaction.type === 'static' ? (
                            <Key className="h-5 w-5 text-inherit"/>
                          ) : (
                            <Copy className="h-5 w-5 text-inherit"/>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.pixKey} • {isClient ? transaction.timestamp.toLocaleTimeString() : '--:--:--'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusLabel(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5"/>
                  <span>Chave PIX</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transações</span>
                  <span className="font-semibold">{pixDashboard.staticPixTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Volume</span>
                  <span className="font-semibold">{formatCurrency(pixDashboard.totalValue * 0.6)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Copy className="h-5 w-5"/>
                  <span>PIX Copia e Cola</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transações</span>
                  <span className="font-semibold">{pixDashboard.dynamicPixTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Volume</span>
                  <span className="font-semibold">{formatCurrency(pixDashboard.totalValue * 0.4)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">PIX Banco Central</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PIX Banco do Brasil</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PIX Bradesco</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Offline</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PIX Santander</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Offline</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}