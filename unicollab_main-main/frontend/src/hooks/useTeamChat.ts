import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface Message {
    id: string;
    project_id: string;
    sender_id: string;
    content: string;
    timestamp: string;
    sender_name?: string;
    sender_avatar?: string;
}

export const useTeamChat = (projectId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const channelRef = useRef<any>(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select(`
          *,
          sender:sender_id (
            full_name,
            avatar_url
          )
        `)
                .eq('project_id', projectId)
                .order('timestamp', { ascending: true });

            if (error) throw error;

            const formattedMessages = (data || []).map(m => ({
                ...m,
                sender_name: m.sender?.full_name,
                sender_avatar: m.sender?.avatar_url
            }));

            setMessages(formattedMessages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('messages')
                .insert([{
                    project_id: projectId,
                    sender_id: user.id,
                    content
                }]);

            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        if (!projectId) return;

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`project_messages:${projectId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `project_id=eq.${projectId}`
                },
                async (payload) => {
                    // Fetch sender info for the new message
                    const { data: senderData } = await supabase
                        .from('profiles')
                        .select('full_name, avatar_url')
                        .eq('id', payload.new.sender_id)
                        .single();

                    const newMessage = {
                        ...payload.new,
                        sender_name: senderData?.full_name,
                        sender_avatar: senderData?.avatar_url
                    } as Message;

                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [projectId]);

    return { messages, loading, error, sendMessage };
};
