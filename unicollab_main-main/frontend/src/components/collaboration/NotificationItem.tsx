import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle, UserPlus, MessageSquare, Info } from 'lucide-react';

interface NotificationItemProps {
    notification: {
        id: string;
        type: 'application_status' | 'team_invite' | 'new_message' | 'project_update';
        message: string;
        is_read: boolean;
        created_at: string;
    };
    onRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'application_status':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'team_invite':
                return <UserPlus className="w-4 h-4 text-blue-500" />;
            case 'new_message':
                return <MessageSquare className="w-4 h-4 text-orange-500" />;
            default:
                return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    return (
        <div
            className={cn(
                "flex gap-3 p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                !notification.is_read && "bg-primary/5"
            )}
            onClick={() => onRead?.(notification.id)}
        >
            <div className="mt-1 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {getIcon()}
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <p className={cn(
                        "text-sm leading-tight",
                        !notification.is_read ? "font-semibold" : "font-normal"
                    )}>
                        {notification.message}
                    </p>
                    {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                    )}
                </div>
                <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                </span>
            </div>
        </div>
    );
};
