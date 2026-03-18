import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';

interface ApplicationCardProps {
    application: {
        id: string;
        applicant_name?: string;
        applicant_domain?: string;
        applicant_year?: string;
        project_title?: string;
        status: 'pending' | 'accepted' | 'rejected';
        message?: string;
        created_at: string;
    };
    isCreator?: boolean;
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
    application,
    isCreator,
    onAccept,
    onReject
}) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'accepted':
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                    </Badge>
                );
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">
                            {isCreator ? application.applicant_name : application.project_title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            {new Date(application.created_at).toLocaleDateString()}
                            {isCreator && (application.applicant_domain || application.applicant_year) && (
                                <span className="text-[10px] text-muted-foreground">• {application.applicant_domain} {application.applicant_year}</span>
                            )}
                        </CardDescription>
                    </div>
                    {getStatusBadge(application.status)}
                </div>
            </CardHeader>
            <CardContent>
                {application.message && (
                    <p className="text-sm text-muted-foreground italic">
                        "{application.message}"
                    </p>
                )}
            </CardContent>
            {isCreator && application.status === 'pending' && (
                <CardFooter className="flex gap-2 justify-end pt-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => onReject?.(application.id)}
                    >
                        <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                        onClick={() => onAccept?.(application.id)}
                    >
                        <Check className="w-4 h-4 mr-1" /> Accept
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};
