import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentSupabaseProfileId } from '@/lib/project-service';

export interface Application {
    id: string;
    project_id: string;
    sender_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    message: string;
    created_at: string;
    updated_at: string;
    project?: {
        title: string;
    };
}

export const useApplications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('collaboration_requests')
                .select(`
          *,
          project:project_id (
            title
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyToProject = async (projectId: string, message?: string) => {
        try {
            const userId = await getCurrentSupabaseProfileId();
            if (!userId) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from('collaboration_requests')
                .insert([{ project_id: projectId, sender_id: userId, message }])
                .select()
                .single();

            if (error) throw error;
            setApplications(prev => [data, ...prev]);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchMyApplications();

        // Realtime subscription for status updates
        const subscription = supabase
            .channel('my_applications_status')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'collaboration_requests',
                },
                (payload: { new: Record<string, any> }) => {
                    setApplications(prev =>
                        prev.map(app => app.id === payload.new.id ? { ...app, ...payload.new as Application } : app)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return {
        applications,
        loading,
        error,
        applyToProject,
        refresh: fetchMyApplications
    };
};
