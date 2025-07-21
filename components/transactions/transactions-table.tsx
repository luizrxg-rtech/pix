'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Search, Download, Filter, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.payer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiver_key.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }

    const labels = {
      completed: 'Concluída',
      pending: 'Pendente',
      failed: 'Falhou',
      cancelled: 'Cancelada'
    }

    return (
      <Badge variant="secondary" className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Transações</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Transaction['status'] | 'all')}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">Todos os status</option>
              <option value="completed">Concluída</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhou</option>
              <option value="cancelled">Cancelada</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchTerm || statusFilter !== 'all' 
              ? 'Nenhuma transação encontrada com os filtros aplicados'
              : 'Nenhuma transação encontrada'
            }
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Pagador</th>
                  <th className="text-left p-4 font-medium">Chave Destino</th>
                  <th className="text-left p-4 font-medium">Valor</th>
                  <th className="text-left p-4 font-medium">Tipo</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Data</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">
                      {transaction.transaction_id.slice(0, 8)}...
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{transaction.payer_name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {transaction.payer_document}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">{transaction.receiver_key}</td>
                    <td className="p-4">
                      <span className={`font-bold ${
                        transaction.transaction_type === 'in' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'in' ? '+' : '-'}
                        R$ {Number(transaction.amount).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {transaction.transaction_type === 'in' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </td>
                    <td className="p-4">{getStatusBadge(transaction.status)}</td>
                    <td className="p-4 text-sm">
                      {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}