"use client"

import { useState, useEffect } from "react"
import { domains } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Users, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import api from "@/lib/api"
import { toast } from "sonner"
import { useApplications } from "@/hooks/useApplications"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  title: string
  description: string
  domain: string
  status: string
  required_skills: string[]
  team_size_required: number
  teams: any[]
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { applyToProject } = useApplications()

  const handleApply = async (projectId: string) => {
    try {
      await applyToProject(projectId, "I'm interested in collaborating on this project!")
      toast.success("Application sent successfully!")
    } catch (error: any) {
      toast.error(`Failed to apply: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/marketplace/projects')
      setProjects(data || [])
    } catch (error: any) {
      console.error(error)
      toast.error("Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((project: Project) => {
    const skills: string[] = Array.isArray(project.required_skills) ? project.required_skills : []

    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some((s: string) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      project.domain.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDomain =
      !selectedDomain || project.domain === selectedDomain

    return matchesSearch && matchesDomain
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Discover projects and find your next collaboration
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by skills, domain, keywords..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDomain(null)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${!selectedDomain
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
            >
              All
            </button>
            {domains.map((domain: string) => (
              <button
                key={domain}
                onClick={() =>
                  setSelectedDomain(selectedDomain === domain ? null : domain)
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedDomain === domain
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project: Project) => {
            const skills: string[] = Array.isArray(project.required_skills) ? project.required_skills : []
            const currentMembers = project.teams ? project.teams.length : 0
            return (
              <div
                key={project.id}
                className="group flex flex-col rounded-2xl bg-card p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <Badge
                    className={
                      project.status.toUpperCase() === "IN_PROGRESS"
                        ? "border-0 bg-accent/20 text-accent"
                        : "border-0 bg-primary/20 text-primary"
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
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-card-foreground/70">
                    <Users className="size-3.5" />
                    <span>
                      {currentMembers}/{project.team_size_required}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 px-3"
                      onClick={() => handleApply(project.id)}
                    >
                      Apply
                    </Button>
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                    >
                      <Eye className="size-3" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="size-10 text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No projects found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}
