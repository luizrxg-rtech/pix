'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Database } from '@/types/database'

type PixKey = Database['public']['Tables']['pix_keys']['Row']

export function PixKeysTable() {
  const [pixKeys, setPixKeys] = useState<PixKey[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchPixKeys()
  }, [])

  const fetchPixKeys = async () => {
    try {
      const { data } = await supabase
        .from('pix_keys')
        .select('*')
        .order('created_at', { ascending: false })

      setPixKeys(data || [])
    } catch (error) {
      console.error('Error fetching PIX keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredKeys = pixKeys.filter(key =>
    key.key_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.owner_document.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: PixKey['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    const labels = {
      active: 'Ativa',
      inactive: 'Inativa',
      suspended: 'Suspensa'
    }

    return (
      <Badge variant="secondary" className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getKeyTypeLabel = (type: PixKey['key_type']) => {
    const labels = {
      cpf: 'CPF',
      cnpj: 'CNPJ',
      email: 'Email',
      phone: 'Telefone',
      random: 'Aleatória'
    }
    return labels[type]
  }

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Chaves PIX</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar chaves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Chave
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : filteredKeys.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchTerm ? 'Nenhuma chave encontrada' : 'Nenhuma chave PIX cadastrada'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Chave</th>
                  <th className="text-left p-4 font-medium">Tipo</th>
                  <th className="text-left p-4 font-medium">Proprietário</th>
                  <th className="text-left p-4 font-medium">Documento</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Criada em</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.map((key) => (
                  <tr key={key.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{key.key_value}</td>
                    <td className="p-4">{getKeyTypeLabel(key.key_type)}</td>
                    <td className="p-4">{key.owner_name}</td>
                    <td className="p-4 font-mono text-sm">{key.owner_document}</td>
                    <td className="p-4">{getStatusBadge(key.status)}</td>
                    <td className="p-4 text-sm">
                      {format(new Date(key.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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