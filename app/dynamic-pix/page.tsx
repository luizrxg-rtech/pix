'use client';

import {useState} from 'react';
import {Header} from '@/components/layout/header';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {formatCurrency} from '@/lib/utils';
import {AlertCircle, CheckCircle, Clock, Copy, DollarSign, Search, Timer,} from 'lucide-react';

// Mock data for dynamic PIX payments
const dynamicPixPayments = [
  {
    id: '1',
    description: 'Cobrança - Consultoria Técnica',
    amount: 1500.00,
    pixKey: 'empresa@pix.com',
    pixCode: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg.gov.br',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 7 days total, 6 remaining
    paidAt: null,
    emitterName: 'João Silva',
    emitterDocument: '123.456.789-00',
  },
  {
    id: '2',
    description: 'Fatura - Serviços de Design',
    amount: 800.00,
    pixKey: '+5511999999999',
    pixCode: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg.gov.br',
    status: 'paid',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    emitterName: 'Maria Santos',
    emitterDocument: '987.654.321-00',
  },
  {
    id: '3',
    description: 'Cobrança - Desenvolvimento Web',
    amount: 2500.00,
    pixKey: '12345678901',
    pixCode: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg.gov.br',
    status: 'expired',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    paidAt: null,
    emitterName: 'Pedro Costa',
    emitterDocument: '456.789.123-00',
  },
  {
    id: '4',
    description: 'Pagamento - Consultoria Jurídica',
    amount: 1200.00,
    pixKey: 'advogado@pix.com',
    pixCode: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg.gov.br',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours remaining
    paidAt: null,
    emitterName: 'Ana Oliveira',
    emitterDocument: '789.123.456-00',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'paid':
      return 'Pago';
    case 'expired':
      return 'Expirado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
};

const getTimeRemaining = (expiresAt: Date) => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expirado';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export default function DynamicPixPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = dynamicPixPayments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.emitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.pixKey.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPending = dynamicPixPayments.filter(p => p.status === 'pending').length;
  const totalPaid = dynamicPixPayments.filter(p => p.status === 'paid').length;
  const totalExpired = dynamicPixPayments.filter(p => p.status === 'expired').length;
  const totalReceived = dynamicPixPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalPending}</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalPaid}</p>
                  <p className="text-sm text-muted-foreground">Pagos</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalExpired}</p>
                  <p className="text-sm text-muted-foreground">Expirados</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalReceived)}
                  </p>
                  <p className="text-sm text-muted-foreground">Recebido</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Pagamentos
              </h2>
              <Badge className="text-sm font-bold px-4 bg-black">
                {filteredPayments.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição, cliente ou chave PIX..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e)}
                  className="pl-10 w-96"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                
              >
                <option value="all">Todos os status</option>
                <option value="paid">Pagos</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
          </div>
          
          <div className="grid gap-6">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {payment.description}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(payment.status)}>
                              {getStatusLabel(payment.status)}
                            </Badge>
                            {payment.status === 'pending' && (
                              <Badge variant="outline" className="text-orange-600 border-orange-200">
                                <Timer className="h-3 w-3 mr-1" />
                                {getTimeRemaining(payment.expiresAt)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">Nome:</p>
                            <p className="truncate">{payment.emitterName}</p>
                          </div>
                          <div>
                            <p className="font-medium">CPF:</p>
                            <p>{payment.emitterDocument}</p>
                          </div>
                          <div>
                            <p className="font-medium">Chave PIX:</p>
                            <p className="truncate">{payment.pixKey}</p>
                          </div>
                          <div>
                            <p className="font-medium">Valor:</p>
                            <p className="font-semibold text-lg text-foreground text-green-600">
                              {formatCurrency(payment.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Criado em:</p>
                            <p>{payment.createdAt?.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Expira em:</p>
                            <p>{payment.expiresAt?.toLocaleDateString()}</p>
                          </div>
                          {payment.status === 'paid' && (
                            <div>
                              <p className="font-medium">Pago em:</p>
                              <p>{payment.paidAt?.toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPayments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Copy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma cobrança encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar sua busca ou filtros' 
                    : 'Crie sua primeira cobrança PIX para começar'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}