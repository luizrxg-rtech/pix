'use client';

import {useState} from 'react';
import {Header} from '@/components/layout/header';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {formatCurrency} from '@/lib/utils';
import {AlertCircle, CheckCircle, DollarSign, Filter, QrCode, Search,} from 'lucide-react';

// Mock data for static PIX payments
const staticPixPayments = [
  {
    id: '1',
    description: 'Pagamento de Serviços - Consultoria',
    pixKey: 'empresa@pix.com',
    status: 'ok',
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    transactionCount: 12,
    amount: 6000.00,
    emitterName: 'João Silva',
    emitterDocument: '123.456.789-00',
  },
  {
    id: '2',
    description: 'Doações - Projeto Social',
    pixKey: '+5511999999999',
    status: 'ok',
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    amount: 2250.00,
    emitterName: 'Maria Santos',
    emitterDocument: '987.654.321-00',
  },
  {
    id: '3',
    description: 'Venda de Produtos - Loja Online',
    pixKey: '12345678901',
    status: 'error',
    paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    amount: 1200.00,
    emitterName: 'Pedro Costa',
    emitterDocument: '456.789.123-00',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ok':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-red-100 text-red-800 border-red-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ok':
      return 'Efetuado';
    case 'error':
      return 'Falhou';
    default:
      return 'Falhou';
  }
};

export default function StaticPixPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = staticPixPayments.filter(payment =>
    payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.pixKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOk = staticPixPayments.filter(p => p.status === 'ok').length;
  const totalError = staticPixPayments.filter(p => p.status === 'error').length;
  const totalReceived = staticPixPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalOk}</p>
                  <p className="text-sm text-muted-foreground">Efetuados</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalError}</p>
                  <p className="text-sm text-muted-foreground">Erros</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalReceived)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Recebido</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filter */}
        <section className="flex flex-col sm:flex-row gap-4 items-center justify-between">

        </section>

        {/* PIX List */}
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
                  placeholder="Buscar por descrição ou chave PIX..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e)}
                  className="pl-10 w-96"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {payment.description}
                          </h3>
                          <Badge className={getStatusColor(payment.status)}>
                            {getStatusLabel(payment.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">Nome:</p>
                            <p className="truncate">{payment.emitterName}</p>
                          </div>
                          <div>
                            <p className="font-medium">CPF:</p>
                            <p className="truncate">{payment.emitterDocument}</p>
                          </div>
                          <div>
                            <p className="font-medium">Chave PIX:</p>
                            <p className="truncate">{payment.pixKey}</p>
                          </div>
                          <div>
                            <p className="font-medium">Pago em:</p>
                            <p>{payment.paidAt.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Valor:</p>
                            <p className="font-semibold text-lg text-foreground text-green-600">
                              {formatCurrency(payment.amount)}
                            </p>
                          </div>
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
                <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma Chave PIX encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Crie sua primeira Chave PIX para começar'}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}