'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        setTransactions(data || [])
      } catch (error) {
        console.error('Error fetching recent transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentTransactions()
  }, [supabase])

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
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Últimas 5 transações</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma transação encontrada
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{transaction.payer_name}</p>
                    {getStatusBadge(transaction.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {transaction.description || 'Sem descrição'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(transaction.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.transaction_type === 'in' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'in' ? '+' : '-'}
                    R$ {Number(transaction.amount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}