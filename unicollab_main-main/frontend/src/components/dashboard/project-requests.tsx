"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Send, Inbox, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface LinkUser {
    id: string
    full_name: string
    email: string
}

interface LinkProject {
    id: string
    title: string
}

interface CollaborationRequest {
    id: string
    project_id: string
    sender_id: string
    receiver_id: string
    status: "pending" | "accepted" | "rejected"
    message: string
    created_at: string
    sender?: LinkUser
    receiver?: LinkUser
    project?: LinkProject
}

export function ProjectRequests() {
    const [receivedRequests, setReceivedRequests] = useState<CollaborationRequest[]>([])
    const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const [receivedRes, sentRes] = await Promise.all([
                api.get("/requests/received"),
                api.get("/requests/sent"),
            ])
            setReceivedRequests(receivedRes.data || [])
            setSentRequests(sentRes.data || [])
        } catch (error) {
            console.error("Failed to fetch requests", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (requestId: string, action: "accept" | "reject") => {
        try {
            setActionLoading(requestId)
            await api.post(`/requests/${requestId}/${action}`)
            toast.success(`Request ${action}ed successfully`)
            fetchRequests()
        } catch (error: any) {
            toast.error(error.response?.data?.detail || `Failed to ${action} request`)
        } finally {
            setActionLoading(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <Badge className="shrink-0 border-0 bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20">PENDING</Badge>
            case "accepted":
                return <Badge className="shrink-0 border-0 bg-green-500/20 text-green-600 hover:bg-green-500/20">ACCEPTED</Badge>
            case "rejected":
                return <Badge className="shrink-0 border-0 bg-red-500/20 text-red-600 hover:bg-red-500/20">REJECTED</Badge>
            default:
                return <Badge className="shrink-0 border-0 bg-secondary text-muted-foreground hover:bg-secondary">{status.toUpperCase()}</Badge>
        }
    }

    if (loading) {
        return <div className="text-sm text-muted-foreground p-4 flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Loading project requests...</div>
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Project Requests</h2>

            <div className="rounded-2xl bg-card p-5">
                <Tabs defaultValue="received" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="received" className="flex items-center gap-2">
                            <Inbox className="size-4" />
                            Received ({receivedRequests.length})
                        </TabsTrigger>
                        <TabsTrigger value="sent" className="flex items-center gap-2">
                            <Send className="size-4" />
                            Sent ({sentRequests.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="received" className="m-0">
                        {receivedRequests.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-6">
                                No received requests at the moment.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {receivedRequests.map((req) => (
                                    <div key={req.id} className="rounded-xl border border-border bg-secondary/30 p-4 transition-transform hover:-translate-y-0.5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {req.sender?.full_name || "Unknown User"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    wants to join <span className="font-semibold text-foreground/80">{req.project?.title || "Project"}</span>
                                                </p>
                                            </div>
                                            {getStatusBadge(req.status)}
                                        </div>
                                        {req.message && (
                                            <p className="mt-2 text-xs text-card-foreground/70 line-clamp-2 bg-secondary/50 p-2 rounded-lg italic">
                                                "{req.message}"
                                            </p>
                                        )}

                                        {req.status === "pending" && (
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={() => handleAction(req.id, "accept")}
                                                    disabled={actionLoading === req.id}
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                                >
                                                    {actionLoading === req.id ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, "reject")}
                                                    disabled={actionLoading === req.id}
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/10 text-destructive py-1.5 text-xs font-medium hover:bg-destructive/20 disabled:opacity-50"
                                                >
                                                    {actionLoading === req.id ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="sent" className="m-0">
                        {sentRequests.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-6">
                                You haven't sent any requests yet.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {sentRequests.map((req) => (
                                    <div key={req.id} className="rounded-xl border border-border bg-secondary/30 p-4 transition-transform hover:-translate-y-0.5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {req.project?.title || "Project"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Sent to {req.receiver?.full_name || "Founder"}
                                                </p>
                                            </div>
                                            {getStatusBadge(req.status)}
                                        </div>
                                        {req.message && (
                                            <p className="mt-2 text-xs text-card-foreground/70 line-clamp-2 bg-secondary/50 p-2 rounded-lg italic">
                                                "{req.message}"
                                            </p>
                                        )}
                                        <div className="mt-3 text-[10px] text-muted-foreground">
                                            Requested on {new Date(req.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
