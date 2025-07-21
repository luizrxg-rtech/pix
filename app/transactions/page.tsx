'use client';

import {useEffect, useState} from 'react';
import {Header} from '@/components/layout/header';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {formatCurrency} from '@/lib/utils';
import {Activity, AlertCircle, ArrowUpDown, CheckCircle, Copy, DollarSign, Eye, Key, Search} from 'lucide-react';

// Mock data for PIX transactions
const pixTransactions = [
  {
    id: 'txn_001',
    type: 'static',
    description: 'Pagamento via Chave PIX - Consultoria',
    amount: 500.00,
    status: 'completed',
    pixKey: 'empresa@pix.com',
    payerName: 'João Silva',
    payerDocument: '123.456.789-00',
    payerBank: 'Banco do Brasil',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    endToEndId: 'E12345678202407211200000001',
    txId: 'static_pix_001',
  },
  {
    id: 'txn_002',
    type: 'dynamic',
    description: 'Cobrança PIX Dinâmica - Fatura #001',
    amount: 1500.00,
    status: 'completed',
    pixKey: '+5511999999999',
    payerName: 'Maria Santos',
    payerDocument: '987.654.321-00',
    payerBank: 'Itaú',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    endToEndId: 'E12345678202407211145000002',
    txId: 'dynamic_pix_002',
  },
  {
    id: 'txn_003',
    type: 'static',
    description: 'Doação via Chave PIX - Projeto Social',
    amount: 50.00,
    status: 'completed',
    pixKey: '12345678901',
    payerName: 'Pedro Costa',
    payerDocument: '456.789.123-00',
    payerBank: 'Santander',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    endToEndId: 'E12345678202407211130000003',
    txId: 'static_pix_003',
  },
  {
    id: 'txn_004',
    type: 'dynamic',
    description: 'Cobrança PIX Dinâmica - Serviços Design',
    amount: 800.00,
    status: 'pending',
    pixKey: 'designer@pix.com',
    payerName: 'Ana Oliveira',
    payerDocument: '789.123.456-00',
    payerBank: 'Bradesco',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    endToEndId: null,
    txId: 'dynamic_pix_004',
  },
  {
    id: 'txn_005',
    type: 'static',
    description: 'Pagamento via Chave PIX - Produtos',
    amount: 150.00,
    status: 'failed',
    pixKey: 'loja@pix.com',
    payerName: 'Carlos Silva',
    payerDocument: '321.654.987-00',
    payerBank: 'Caixa',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    endToEndId: null,
    txId: 'static_pix_005',
    failureReason: 'Saldo insuficiente',
  },
  {
    id: 'txn_006',
    type: 'dynamic',
    description: 'Cobrança PIX Dinâmica - Consultoria Jurídica',
    amount: 2500.00,
    status: 'completed',
    pixKey: 'advogado@pix.com',
    payerName: 'Fernanda Lima',
    payerDocument: '654.321.987-00',
    payerBank: 'Nubank',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endToEndId: 'E12345678202407211000000006',
    txId: 'dynamic_pix_006',
  },
  {
    id: 'txn_007',
    type: 'static',
    description: 'Pagamento via Chave PIX - Freelance',
    amount: 750.00,
    status: 'completed',
    pixKey: 'freelancer@pix.com',
    payerName: 'Roberto Santos',
    payerDocument: '147.258.369-00',
    payerBank: 'Inter',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    endToEndId: 'E12345678202407210900000007',
    txId: 'static_pix_007',
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
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
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
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Desconhecido';
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

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'static':
      return 'Chave PIX';
    case 'dynamic':
      return 'PIX Copia e Cola';
    default:
      return 'Desconhecido';
  }
};

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredTransactions = pixTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.pixKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.endToEndId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const transactionDate = transaction.timestamp;
      switch (dateFilter) {
        case 'today':
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'timestamp':
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
        break;
      case 'payerName':
        aValue = a.payerName.toLowerCase();
        bValue = b.payerName.toLowerCase();
        break;
      default:
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Calculate statistics
  const totalTransactions = pixTransactions.length;
  const completedTransactions = pixTransactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = pixTransactions.filter(t => t.status === 'pending').length;
  const failedTransactions = pixTransactions.filter(t => t.status === 'failed').length;
  const totalVolume = pixTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const staticTransactions = pixTransactions.filter(t => t.type === 'static').length;
  const dynamicTransactions = pixTransactions.filter(t => t.type === 'dynamic').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{completedTransactions}</p>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{failedTransactions}</p>
                  <p className="text-sm text-muted-foreground">Erros</p>
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
                    {formatCurrency(totalVolume)}
                  </p>
                  <p className="text-sm text-muted-foreground">Volume Total</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </section>


        {/* Transactions Table */}
        <section className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Transações
              </h2>
              <Badge className="text-sm font-bold px-4 bg-black">
                {sortedTransactions.length}
              </Badge>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por descrição, pagador, chave PIX ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">Todos os status</option>
                    <option value="completed">Concluídas</option>
                    <option value="pending">Pendentes</option>
                    <option value="failed">Falharam</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="static">Chave PIX</option>
                    <option value="dynamic">PIX Copia e Cola</option>
                  </select>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">Todas as datas</option>
                    <option value="today">Hoje</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mês</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSort('timestamp')}
                          className="h-auto p-0 font-medium"
                        >
                          Data/Hora
                          <ArrowUpDown className="h-3 w-3 ml-1" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium">Tipo</th>
                      <th className="text-left p-4 font-medium">Descrição</th>
                      <th className="text-left p-4 font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSort('payerName')}
                          className="h-auto p-0 font-medium"
                        >
                          Pagador
                          <ArrowUpDown className="h-3 w-3 ml-1" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSort('amount')}
                          className="h-auto p-0 font-medium"
                        >
                          Valor
                          <ArrowUpDown className="h-3 w-3 ml-1" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-muted/25">
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">
                              {isClient ? transaction.timestamp.toLocaleDateString() : '--/--/----'}
                            </div>
                            <div className="text-muted-foreground">
                              {isClient ? transaction.timestamp.toLocaleTimeString() : '--:--:--'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getTypeColor(transaction.type)}>
                            {transaction.type === 'static' ? (
                              <Key className="h-3 w-3 mr-1" />
                            ) : (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            {getTypeLabel(transaction.type)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium truncate max-w-xs">
                              {transaction.description}
                            </div>
                            <div className="text-muted-foreground truncate">
                              {transaction.pixKey}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">{transaction.payerName}</div>
                            <div className="text-muted-foreground">
                              {transaction.payerBank}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-lg">
                            {formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(transaction.status)}>
                            {getStatusLabel(transaction.status)}
                          </Badge>
                          {transaction.status === 'failed' && transaction.failureReason && (
                            <div className="text-xs text-red-600 mt-1">
                              {transaction.failureReason}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {sortedTransactions.length === 0 && (
                <div className="p-12 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou aguarde novas transações
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}