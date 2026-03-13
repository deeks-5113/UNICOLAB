import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Application {
    id: string;
    project_id: string;
    sender_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    message: string;
    created_at: string;
    updated_at: string;
    sender?: {
        full_name: string;
    };
}

export const useProjectApplications = (projectId: string) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjectApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('collaboration_requests')
                .select(`
          *,
          sender:profiles (
            full_name
          )
        `)
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
        try {
            const { data, error } = await supabase
                .from('collaboration_requests')
                .update({ status })
                .eq('id', applicationId)
                .select()
                .single();

            if (error) throw error;

            setApplications(prev =>
                prev.map(app => app.id === applicationId ? { ...app, status } : app)
            );

            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchProjectApplications();
        }
    }, [projectId]);

    return {
        applications,
        loading,
        error,
        updateApplicationStatus,
        refresh: fetchProjectApplications
    };
};
