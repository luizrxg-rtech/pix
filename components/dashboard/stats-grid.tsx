'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CreditCard, ArrowUpDown, CheckCircle, AlertCircle } from 'lucide-react'

interface Stats {
  totalKeys: number
  totalTransactions: number
  completedTransactions: number
  pendingTransactions: number
  totalAmount: number
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [keysResult, transactionsResult] = await Promise.all([
          supabase.from('pix_keys').select('*', { count: 'exact', head: true }),
          supabase.from('transactions').select('status, amount')
        ])

        const totalKeys = keysResult.count || 0
        const transactions = transactionsResult.data || []
        
        const totalTransactions = transactions.length
        const completedTransactions = transactions.filter(t => t.status === 'completed').length
        const pendingTransactions = transactions.filter(t => t.status === 'pending').length
        const totalAmount = transactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + Number(t.amount), 0)

        setStats({
          totalKeys,
          totalTransactions,
          completedTransactions,
          pendingTransactions,
          totalAmount
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSpinner />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statsCards = [
    {
      title: 'Chaves PIX',
      value: stats.totalKeys.toLocaleString('pt-BR'),
      icon: CreditCard,
      description: 'Total de chaves registradas'
    },
    {
      title: 'Transações',
      value: stats.totalTransactions.toLocaleString('pt-BR'),
      icon: ArrowUpDown,
      description: 'Total de transações'
    },
    {
      title: 'Concluídas',
      value: stats.completedTransactions.toLocaleString('pt-BR'),
      icon: CheckCircle,
      description: 'Transações concluídas'
    },
    {
      title: 'Pendentes',
      value: stats.pendingTransactions.toLocaleString('pt-BR'),
      icon: AlertCircle,
      description: 'Transações pendentes'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="animate-slide-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}