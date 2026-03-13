import React from 'react';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationCard } from '@/components/collaboration/ApplicationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';

const MyApplicationsPage: React.FC = () => {
    const { applications, loading, error } = useApplications();

    if (loading && applications.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">My Applications</h1>
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Applications</h1>
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
                            You haven't applied to any projects yet. Check out the marketplace to find interesting projects!
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="grid gap-4">
                    {applications.map(app => (
                        <ApplicationCard
                            key={app.id}
                            application={{
                                id: app.id,
                                project_title: app.project?.title || 'Unknown Project',
                                status: app.status,
                                message: app.message,
                                created_at: app.created_at
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;
