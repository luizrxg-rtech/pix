'use client';

import {useEffect, useState} from 'react';
import {Header} from '@/components/layout/header';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {Download, Eye, FileText, RefreshCw, Search, Wifi, WifiOff, X,} from 'lucide-react';
import Image from "next/image";
import {cn} from "@/lib/utils";

// Mock data for bank APIs
const bankApis = [
  {
    id: 'bb',
    name: 'Banco do Brasil',
    logo: 'bb',
    status: 'online',
    lastCheck: new Date(Date.now() - 2 * 60 * 1000),
    responseTime: 145,
    uptime: 99.8,
    totalRequests: 15420,
    successRate: 99.2,
    errorRate: 0.8,
    endpoint: 'https://api.bb.com.br/pix/v1',
    version: 'v2.1.0',
  },
  {
    id: 'bacen',
    name: 'Banco Central',
    logo: 'bacen',
    status: 'online',
    lastCheck: new Date(Date.now() - 1 * 60 * 1000),
    responseTime: 89,
    uptime: 99.9,
    totalRequests: 28750,
    successRate: 99.7,
    errorRate: 0.3,
    endpoint: 'https://api.bacen.gov.br/pix/v1',
    version: 'v3.0.1',
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    logo: 'bradesco',
    status: 'offline',
    lastCheck: new Date(Date.now() - 15 * 60 * 1000),
    responseTime: 0,
    uptime: 97.5,
    totalRequests: 8930,
    successRate: 96.8,
    errorRate: 3.2,
    endpoint: 'https://api.bradesco.com.br/pix/v1',
    version: 'v1.8.2',
    lastError: 'Connection timeout after 30s',
  },
  {
    id: 'santander',
    name: 'Santander',
    logo: 'santander',
    status: 'online',
    lastCheck: new Date(Date.now() - 5 * 60 * 1000),
    responseTime: 2340,
    uptime: 98.1,
    totalRequests: 12650,
    successRate: 97.9,
    errorRate: 2.1,
    endpoint: 'https://api.santander.com.br/pix/v1',
    version: 'v2.0.3',
    lastError: 'High response time detected',
  },
  {
    id: 'itau',
    name: 'Itaú',
    logo: 'itau',
    status: 'online',
    lastCheck: new Date(Date.now() - 3 * 60 * 1000),
    responseTime: 234,
    uptime: 99.4,
    totalRequests: 19870,
    successRate: 98.9,
    errorRate: 1.1,
    endpoint: 'https://api.itau.com.br/pix/v1',
    version: 'v2.2.1',
  },
];

// Mock data for API logs
const apiLogs = [
  {
    id: 'log_001',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    bank: 'Banco do Brasil',
    level: 'info',
    message: 'PIX transaction processed successfully',
    endpoint: '/pix/v1/transactions',
    method: 'POST',
    responseTime: 145,
    statusCode: 200,
    requestId: 'req_bb_001',
  },
  {
    id: 'log_003',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    bank: 'Bradesco',
    level: 'error',
    message: 'Connection timeout after 30s',
    endpoint: '/pix/v1/transactions',
    method: 'POST',
    responseTime: 30000,
    statusCode: 408,
    requestId: 'req_brad_003',
  },
  {
    id: 'log_004',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    bank: 'Banco Central',
    level: 'info',
    message: 'Health check completed successfully',
    endpoint: '/pix/v1/health',
    method: 'GET',
    responseTime: 89,
    statusCode: 200,
    requestId: 'req_bc_004',
  },
  {
    id: 'log_005',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    bank: 'Itaú',
    level: 'info',
    message: 'PIX key validation successful',
    endpoint: '/pix/v1/keys/validate',
    method: 'POST',
    responseTime: 234,
    statusCode: 200,
    requestId: 'req_itau_005',
  },
  {
    id: 'log_006',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    bank: 'Bradesco',
    level: 'error',
    message: 'API rate limit exceeded',
    endpoint: '/pix/v1/transactions',
    method: 'POST',
    responseTime: 156,
    statusCode: 429,
    requestId: 'req_brad_006',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'offline':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <Wifi className="h-4 w-4" />;
    case 'offline':
      return <WifiOff className="h-4 w-4" />;
    default:
      return <Wifi className="h-4 w-4" />;
  }
};

const getLogLevelColor = (level: string) => {
  switch (level) {
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getLogMessageColor = (level: string) => {
  switch (level) {
    case 'info':
      return 'text-blue-800';
    case 'error':
      return 'text-red-800';
    default:
      return 'text-gray-800';
  }
};

export default function StatusPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [isClient, setIsClient] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredLogs = apiLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesBank = bankFilter === 'all' || log.bank === bankFilter;
    return matchesSearch && matchesLevel && matchesBank;
  });

  const selectedBankLogs = selectedBank 
    ? apiLogs.filter(log => log.bank === selectedBank)
    : [];

  const openBankLogsModal = (bankName: string) => {
    setSelectedBank(bankName);
    setIsModalOpen(true);
  };

  const closeBankLogsModal = () => {
    setSelectedBank(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="grid lg:grid-cols-3 container mx-auto px-4 py-8 space-x-8">
        {/* Bank APIs Status */}
        <section className="col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Sistemas
            </h2>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {bankApis.map((bank) => (
              <Card key={bank.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        alt="Logo"
                        src={"/images/" + bank.logo + ".jpg"}
                        width={700}
                        height={700}
                        className="w-auto h-12 rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{bank.name}</h3>
                        <p className="text-sm text-muted-foreground">{bank.endpoint}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(bank.status)}>
                      {getStatusIcon(bank.status)}
                      <span className="ml-1 capitalize">{bank.status}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{bank.responseTime}ms</p>
                      <p className="text-xs text-muted-foreground">Tempo de Resposta</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{bank.uptime}%</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{bank.totalRequests.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Requests</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{bank.successRate}%</p>
                      <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between text-sm text-muted-foreground">
                    <div className="flex flex-col items-start">
                      <span>Versão: {bank.version}</span>
                      <span>Última verificação: {isClient ? bank.lastCheck.toLocaleTimeString() : '--:--:--'}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {bank.lastError && (
                        <span className="text-red-600 font-medium text-end">{bank.lastError}</span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => openBankLogsModal(bank.name)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Logs
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* API Logs */}
        <section className="col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Logs das APIs
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Log Filters */}
          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar logs por mensagem, banco ou endpoint..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  
                >
                  <option value="all">Todos os níveis</option>
                  <option value="info">Info</option>
                  <option value="error">Error</option>
                </select>
                <select
                  value={bankFilter}
                  onChange={(e) => setBankFilter(e.target.value)}
                  
                >
                  <option value="all">Todos os bancos</option>
                  {bankApis.map(bank => (
                    <option key={bank.id} value={bank.name}>{bank.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Log Entries */}
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{log.bank}</span>
                        <span className="text-sm text-muted-foreground">
                          {isClient ? log.timestamp.toLocaleString() : '--/--/-- --:--:--'}
                        </span>
                      </div>
                      <p className={cn(getLogMessageColor(log.level), "text-md font-bold mb-2")}>{log.message}</p>
                      <div className="grid grid-cols-2 text-xs text-muted-foreground">
                        <span>{log.method} {log.endpoint}</span>
                        <span>Status: {log.statusCode}</span>
                        <span>Tempo: {log.responseTime}ms</span>
                        <span>ID: {log.requestId}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum log encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || levelFilter !== 'all' || bankFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Não há logs disponíveis no momento'}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Bank Logs Modal */}
      {isModalOpen && selectedBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                Logs - {selectedBank}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeBankLogsModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedBankLogs.length > 0 ? (
                <div className="space-y-3">
                  {selectedBankLogs.map((log) => (
                    <Card key={log.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getLogLevelColor(log.level)}>
                                {log.level.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {isClient ? log.timestamp.toLocaleString() : '--/--/-- --:--:--'}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{log.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{log.method} {log.endpoint}</span>
                              <span>Status: {log.statusCode}</span>
                              <span>Tempo: {log.responseTime}ms</span>
                              <span>ID: {log.requestId}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum log encontrado</h3>
                  <p className="text-muted-foreground">
                    Não há logs disponíveis para {selectedBank} no momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}