import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageBubbleProps {
    message: {
        id: string;
        content: string;
        sender_id: string;
        sender_name?: string;
        sender_avatar?: string;
        timestamp: string;
    };
    isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
    return (
        <div className={cn(
            "flex gap-3 mb-4 w-full",
            isOwnMessage ? "flex-row-reverse" : "flex-row"
        )}>
            {!isOwnMessage && (
                <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender_avatar} />
                    <AvatarFallback>{message.sender_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "flex flex-col max-w-[70%]",
                isOwnMessage ? "items-end" : "items-start"
            )}>
                {!isOwnMessage && (
                    <span className="text-xs text-muted-foreground mb-1 ml-1">
                        {message.sender_name}
                    </span>
                )}
                <div className={cn(
                    "px-4 py-2 rounded-2xl text-sm",
                    isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-muted-foreground rounded-tl-none"
                )}>
                    {message.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
};
