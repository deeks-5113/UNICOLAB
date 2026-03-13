import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProjectById, ProjectData, checkJoinRequestStatus, getCurrentSupabaseProfileId } from '@/lib/project-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { JoinRequestModal } from '@/components/JoinRequestModal'
import { SimilarProjectsCarousel } from '@/components/SimilarProjectsCarousel'
import { Users, Eye, Bookmark, Share2, Calendar, Clock, MapPin, Code, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function ProjectDescriptionPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const [project, setProject] = useState<ProjectData | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [joinStatus, setJoinStatus] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProject() {
            if (!projectId) return
            setLoading(true)
            try {
                const userId = await getCurrentSupabaseProfileId()
                setCurrentUser(userId ? { id: userId } : null)

                const data = await getProjectById(projectId)
                if (data) {
                    setProject(data)
                    if (userId) {
                        const status = await checkJoinRequestStatus(projectId, userId)
                        setJoinStatus(status)
                    }
                } else {
                    toast.error("Project not found.")
                }
            } catch (err) {
                console.error(err)
                toast.error("Failed to load project details.")
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [projectId])

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied to clipboard!")
        } catch {
            toast.error("Failed to copy link.")
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Loading project details...</p>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
                <p className="text-xl font-bold">Project not found</p>
                <p className="text-muted-foreground">The project you are looking for does not exist or has been removed.</p>
            </div>
        )
    }

    const isMember = project.teams?.some(t => t.member_id === currentUser?.id)
    const isCreator = project.founder_id === currentUser?.id

    // Construct a unified team array starting with the founder
    const displayTeam = []
    if (project.founder) {
        displayTeam.push({
            id: 'founder-' + project.founder.id,
            role_in_team: 'Creator',
            member: project.founder
        })
    }

    // Add existing accepted team members
    if (project.teams && project.teams.length > 0) {
        project.teams.forEach(team => {
            if (team.member_id !== project.founder_id) { // Avoid duplicating founder if they are in teams
                displayTeam.push(team)
            }
        })
    }

    const currentMembers = displayTeam.length

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Main Content (Left) */}
                <div className="flex-1 space-y-8 min-w-0">

                    {/* 1. Project Hero Card */}
                    <div className="rounded-3xl bg-card p-6 md:p-8 flex flex-col md:flex-row gap-8 border border-border/50 shadow-sm relative overflow-hidden">
                        <div className="flex-1 z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sm font-medium text-blue-400">{project.domain}</span>
                                <Badge className={
                                    project.status === "IN_PROGRESS"
                                        ? "border-0 bg-accent/20 text-accent font-semibold px-3 py-1"
                                        : "border-0 bg-emerald-500/20 text-emerald-500 font-semibold px-3 py-1"
                                }
                                >
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current inline-block"></span>
                                    {project.status.toUpperCase()}
                                </Badge>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight text-white">
                                {project.title}
                            </h1>

                            <p className="text-muted-foreground text-lg mb-8 max-w-2xl text-balance">
                                {project.description?.length > 150 ? project.description.slice(0, 150) + '...' : project.description || 'Impactful student project.'}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                {!isCreator && (
                                    isMember ? (
                                        <Button disabled className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 flex items-center gap-2 cursor-default">
                                            Joined ✓
                                        </Button>
                                    ) : joinStatus === 'pending' ? (
                                        <Button disabled className="bg-orange-500/50 text-white rounded-full px-6 flex items-center gap-2 cursor-default opacity-80">
                                            Pending Approval...
                                        </Button>
                                    ) : joinStatus === 'rejected' ? (
                                        <Button disabled className="bg-red-500/10 text-red-500 hover:bg-red-500/10 border border-red-500/20 rounded-full px-6 flex items-center gap-2 cursor-default">
                                            Request Rejected
                                        </Button>
                                    ) : (
                                        <JoinRequestModal projectId={project.id} />
                                    )
                                )}
                                <Button variant="outline" className="rounded-full px-6 flex items-center gap-2 border-border/60 bg-transparent hover:bg-white/5">
                                    <Bookmark className="size-4" /> Save Project
                                </Button>
                                <Button variant="ghost" onClick={handleShare} className="rounded-full px-4 text-muted-foreground hover:text-foreground">
                                    <Share2 className="size-4 mr-2" /> Share
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Team Capacity: <strong className="text-foreground">{currentMembers}/{project.team_size_required}</strong> members joined</span>
                            </div>
                        </div>

                        {/* Placeholder Image for Hero */}
                        <div className="hidden md:block w-48 lg:w-64 shrink-0 mt-4 md:mt-0 relative z-10">
                            <div className="w-full h-full min-h-[220px] rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex flex-col items-center justify-center p-4">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Project Preview</span>
                            </div>
                        </div>

                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    </div>

                    {/* 2. About This Project */}
                    <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-primary text-xl">📄</span> About This Project
                        </h2>

                        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
                            {project.description && (
                                <div>
                                    <h3 className="text-foreground font-semibold mb-2">Description</h3>
                                    <p>{project.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Tech Stack / Skills */}
                    {project.required_skills && project.required_skills.length > 0 && (
                        <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-primary text-xl">💼</span> Tech Stack
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {project.required_skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-secondary/50 border border-border/50 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 5. The Team Section */}
                    <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-primary text-xl">👥</span> The Team
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {displayTeam.map((team) => (
                                <div key={team.id} className="flex flex-col items-center p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors border border-transparent">
                                    <Avatar className="h-14 w-14 mb-3 border-2 border-border/50">
                                        <AvatarImage src={team.member?.avatar_url || ''} />
                                        <AvatarFallback className="bg-indigo-500/20 text-indigo-400 font-medium">
                                            {team.member?.full_name?.charAt(0) || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-foreground text-center text-sm">{team.member?.full_name}</span>
                                    <span className="text-xs text-primary mt-1 font-medium">
                                        {team.role_in_team || 'Member'}
                                    </span>
                                </div>
                            ))}

                            {/* Empty slot placeholder */}
                            {project.team_size_required > currentMembers && (
                                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border/60 bg-transparent transition-colors mb-3 h-full min-h-[140px]">
                                    <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground mb-2">
                                        +
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">Open Position</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 6. Similar Projects Carousel */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-primary text-xl">🧩</span> Similar Projects
                            </h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-card border-border/50"><span className="text-sm">←</span></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-card border-border/50"><span className="text-sm">→</span></Button>
                            </div>
                        </div>
                        <SimilarProjectsCarousel domain={project.domain} currentProjectId={project.id} />
                    </div>

                </div>

                {/* Sidebar (Right) */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-24 space-y-6">

                        {/* Creator Card */}
                        <Card className="bg-card border-border/50 shadow-sm rounded-2xl overflow-hidden">
                            {/* Cover Image Area */}
                            <div className="h-20 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 w-full relative">
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-full p-1 bg-card">
                                    <Avatar className="h-20 w-20 border-2 border-card">
                                        <AvatarImage src={project.founder?.avatar_url || ''} />
                                        <AvatarFallback className="bg-emerald-500/20 text-emerald-500 text-xl font-bold">
                                            {project.founder?.full_name?.charAt(0) || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-card bg-emerald-500"></div>
                                </div>
                            </div>

                            <CardContent className="pt-12 text-center pb-6">
                                <h3 className="font-bold text-lg text-foreground">{project.founder?.full_name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4 flex items-center justify-center gap-1.5">
                                    <Clock className="size-3.5" />
                                    {project.founder?.domain} • {project.founder?.year}
                                </p>
                                <p className="text-xs text-card-foreground/70 mb-6 leading-relaxed">
                                    {project.founder?.bio || 'Passionate about building impactful projects.'}
                                </p>

                                <div className="flex flex-col gap-3">
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium">
                                        View Profile
                                    </Button>
                                    <Button variant="outline" className="w-full border-border/60 rounded-full hover:bg-secondary">
                                        Message
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Details Sidebar Card */}
                        <Card className="bg-card border-border/50 shadow-sm rounded-2xl">
                            <CardHeader className="pb-4">
                                <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Project Details</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="size-4" /> Posted On</div>
                                    <span className="font-medium text-foreground">{project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" /> Domain</div>
                                    <span className="font-medium text-foreground">{project.domain}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">Status</div>
                                    <Badge variant="outline" className="border-orange-500/30 text-orange-500 bg-orange-500/10 font-medium px-2 py-0">
                                        {project.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resources Placeholder Card */}
                        <Card className="bg-card border-border/50 shadow-sm rounded-2xl">
                            <CardHeader className="pb-4">
                                <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Resources</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {['Repository', 'Design File', 'Documentation'].map((resource) => (
                                    <Button key={resource} variant="ghost" className="w-full justify-between h-auto py-3 px-4 bg-secondary/30 hover:bg-secondary/60 rounded-xl">
                                        <span className="text-sm font-medium text-foreground">{resource}</span>
                                        <span className="text-muted-foreground opacity-50 text-xs">↗</span>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
