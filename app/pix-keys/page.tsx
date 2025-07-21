import { MainLayout } from '@/components/layout/main-layout'
import { PixKeysTable } from '@/components/pix-keys/pix-keys-table'

export default function PixKeysPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chaves PIX</h1>
          <p className="text-muted-foreground">
            Gerencie as chaves PIX cadastradas no sistema
          </p>
        </div>

        <PixKeysTable />
      </div>
    </MainLayout>
  )
}