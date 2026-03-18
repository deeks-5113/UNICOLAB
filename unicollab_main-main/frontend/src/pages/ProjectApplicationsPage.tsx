import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectApplications } from '@/hooks/useProjectApplications';
import { ApplicationCard } from '@/components/collaboration/ApplicationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const ProjectApplicationsPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { applications, loading, error, updateApplicationStatus } = useProjectApplications(projectId || '');

    const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected') => {
        try {
            await updateApplicationStatus(applicationId, status);
            toast.success(`Application ${status} successfully`);
        } catch (err: any) {
            toast.error(`Failed to update application: ${err.message}`);
        }
    };

    if (loading && applications.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-10 w-48 mb-6" />
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-bold">Project Applications</h1>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            {applications.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyTitle>No applications yet</EmptyTitle>
                        <EmptyDescription>
                            Wait for students to discover your project and apply!
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="grid gap-4">
                    {applications.map(app => (
                        <ApplicationCard
                            key={app.id}
                            isCreator
                            application={{
                                id: app.id,
                                applicant_name: app.sender?.full_name || 'Anonymous Student',
                                applicant_domain: app.sender?.domain,
                                applicant_year: app.sender?.year_of_study,
                                status: app.status,
                                message: app.message,
                                created_at: app.created_at
                            }}
                            onAccept={(id) => handleStatusUpdate(id, 'accepted')}
                            onReject={(id) => handleStatusUpdate(id, 'rejected')}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectApplicationsPage;
