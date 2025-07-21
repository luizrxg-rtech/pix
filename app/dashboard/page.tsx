import { MainLayout } from '@/components/layout/main-layout'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { TransactionsChart } from '@/components/dashboard/transactions-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema PIX municipal
          </p>
        </div>

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionsChart />
          <RecentTransactions />
        </div>
      </div>
    </MainLayout>
  )
}