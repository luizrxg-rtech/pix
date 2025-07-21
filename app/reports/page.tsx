import { MainLayout } from '@/components/layout/main-layout'
import { ReportsGrid } from '@/components/reports/reports-grid'

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere e acesse relatórios detalhados do sistema
          </p>
        </div>

        <ReportsGrid />
      </div>
    </MainLayout>
  )
}