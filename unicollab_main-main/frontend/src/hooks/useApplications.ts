import { useState, useEffect } from 'react';
import api from '@/lib/api';

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
            const { data } = await api.get('/requests/sent');
            setApplications(data || []);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyToProject = async (projectId: string, message?: string) => {
        try {
            const { data } = await api.post('/requests/send', {
                project_id: projectId,
                message: message
            });
            setApplications(prev => [data, ...prev]);
            return data;
        } catch (err: any) {
            const msg = err.response?.data?.detail || err.message;
            setError(msg);
            throw new Error(msg);
        }
    };

    useEffect(() => {
        fetchMyApplications();
        // Since we are moving away from Supabase for this, real-time updates via Supabase channel are disabled.
        // In a full implementation, we could use WebSockets or polling if needed.
    }, []);

    return {
        applications,
        loading,
        error,
        applyToProject,
        refresh: fetchMyApplications
    };
};
