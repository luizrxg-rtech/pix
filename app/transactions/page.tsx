import { MainLayout } from '@/components/layout/main-layout'
import { TransactionsTable } from '@/components/transactions/transactions-table'

export default function TransactionsPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Monitore todas as transações PIX do sistema
          </p>
        </div>

        <TransactionsTable />
      </div>
    </MainLayout>
  )
}