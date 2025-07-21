'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatDate, getInitials, getStatusColor } from '@/lib/utils';
import { 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Calendar,
  DollarSign,
  User,
  CreditCard
} from 'lucide-react';
import type { Proposal } from '@/types';

interface ProposalCardProps {
  proposal: Proposal;
  onView?: (proposal: Proposal) => void;
  onEdit?: (proposal: Proposal) => void;
}

const statusLabels = {
  draft: 'Rascunho',
  sent: 'Enviada',
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
  expired: 'Expirada',
};

const paymentMethodLabels = {
  pix: 'PIX',
  boleto: 'Boleto',
  card: 'Cartão',
  transfer: 'Transferência',
};

export function ProposalCard({ proposal, onView, onEdit }: ProposalCardProps) {
  const statusColor = getStatusColor(proposal.status);

  return (
    <Card className="card-hover group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {proposal.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {proposal.description}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Badge className={statusColor}>
              {statusLabels[proposal.status]}
            </Badge>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Client Info */}
        {proposal.client && (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(proposal.client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {proposal.client.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {proposal.client.email}
              </p>
            </div>
          </div>
        )}

        {/* Value and Payment Method */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {formatCurrency(proposal.value)}
              </p>
              <p className="text-xs text-muted-foreground">Valor</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {paymentMethodLabels[proposal.paymentMethod]}
              </p>
              <p className="text-xs text-muted-foreground">Pagamento</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Criada em {formatDate(proposal.createdAt)}</span>
          </div>
          <span>Válida até {formatDate(proposal.validUntil)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(proposal)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit?.(proposal)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}