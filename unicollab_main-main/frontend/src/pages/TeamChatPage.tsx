import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeamChat } from '@/hooks/useTeamChat';
import { MessageBubble } from '@/components/collaboration/MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';

const TeamChatPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { messages, loading, error, sendMessage } = useTeamChat(projectId || '');
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id || null);
        });
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(newMessage);
            setNewMessage('');
        } catch (err) {
            // Error handled by hook
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] container mx-auto py-4">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">Team Chat</h1>
            </div>

            <ScrollArea className="flex-1 pr-4" viewportRef={scrollRef}>
                <div className="flex flex-col">
                    {loading && messages.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground italic">
                            Loading conversation...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwnMessage={msg.sender_id === currentUserId}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>

            <form onSubmit={handleSend} className="mt-4 flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
};

export default TeamChatPage;
