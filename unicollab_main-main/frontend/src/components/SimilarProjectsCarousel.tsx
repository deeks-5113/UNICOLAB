import { useEffect, useState } from 'react'
import { getSimilarProjects } from '@/lib/project-service'
import { Badge } from '@/components/ui/badge'
import { Users, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// From marketplace page design
export function SimilarProjectsCarousel({ domain, currentProjectId }: { domain: string, currentProjectId: string }) {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSimilar() {
            try {
                const data = await getSimilarProjects(domain, currentProjectId)
                setProjects(data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (domain && currentProjectId) {
            fetchSimilar()
        }
    }, [domain, currentProjectId])

    if (loading) {
        return <div className="text-muted-foreground">Loading similar projects...</div>
    }

    if (projects.length === 0) {
        return <div className="text-muted-foreground">No similar projects found.</div>
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {projects.map((project) => {
                const skills = project.required_skills || []
                const currentMembers = project.teams ? project.teams.length : 0

                return (
                    <div
                        key={project.id}
                        className="group flex flex-col rounded-2xl bg-card p-5 transition-transform hover:-translate-y-1 min-w-[300px] sm:min-w-[340px] snap-center shrink-0 border border-transparent hover:border-border/50"
                    >
                        <div className="flex items-start justify-between">
                            <Badge
                                className={
                                    project.status === "IN_PROGRESS"
                                        ? "border-0 bg-accent/20 text-accent"
                                        : "border-0 bg-emerald-500/20 text-emerald-500"
                                }
                            >
                                {project.status.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-card-foreground/50">{project.domain}</span>
                        </div>
                        <h3 className="mt-3 font-semibold text-card-foreground text-balance">
                            {project.title}
                        </h3>
                        <p className="mt-1.5 flex-1 text-sm text-card-foreground/70 line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {skills.slice(0, 3).map((skill: string) => (
                                <span
                                    key={skill}
                                    className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                                >
                                    {skill}
                                </span>
                            ))}
                            {skills.length > 3 && (
                                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                                    +{skills.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-card-foreground/70">
                                <Users className="size-4" />
                                <span>
                                    {currentMembers}/{project.team_size_required}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                                >
                                    View <span className="text-[10px]">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
