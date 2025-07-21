'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDateTime, getInitials } from '@/lib/utils';
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Copy,
  MessageSquare 
} from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface RecentActivityProps {
  activities: TimelineEvent[];
}

const eventIcons = {
  created: FileText,
  sent: FileText,
  viewed: Eye,
  approved: CheckCircle,
  rejected: XCircle,
  payment: Copy,
  note: MessageSquare,
};

const eventColors = {
  created: 'text-blue-600 bg-blue-50 border-blue-200',
  sent: 'text-purple-600 bg-purple-50 border-purple-200',
  viewed: 'text-gray-600 bg-gray-50 border-gray-200',
  approved: 'text-green-600 bg-green-50 border-green-200',
  rejected: 'text-red-600 bg-red-50 border-red-200',
  payment: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  note: 'text-amber-600 bg-amber-50 border-amber-200',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Atividades Recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = eventIcons[activity.type];
            const colorClass = eventColors[activity.type];

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`rounded-full p-2 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(activity.createdAt)}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  )}
                  {activity.user && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(activity.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {activity.user.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma atividade recente
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}