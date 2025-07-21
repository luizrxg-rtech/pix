'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChartData {
  date: string
  transactions: number
  amount: number
}

export function TransactionsChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), i)
          return {
            date: startOfDay(date).toISOString(),
            displayDate: format(date, 'dd/MM', { locale: ptBR })
          }
        }).reverse()

        const chartData: ChartData[] = []

        for (const day of days) {
          const { data: transactions } = await supabase
            .from('transactions')
            .select('amount, status')
            .gte('created_at', day.date)
            .lt('created_at', new Date(new Date(day.date).getTime() + 24 * 60 * 60 * 1000).toISOString())
            .eq('status', 'completed')

          const count = transactions?.length || 0
          const total = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

          chartData.push({
            date: day.displayDate,
            transactions: count,
            amount: total
          })
        }

        setData(chartData)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações por Dia</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle>Transações por Dia</CardTitle>
        <CardDescription>Últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'transactions' ? value : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                name === 'transactions' ? 'Transações' : 'Valor Total'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="transactions" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}