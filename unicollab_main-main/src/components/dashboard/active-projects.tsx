"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users } from "lucide-react"
import api from "@/lib/api"

interface Project {
  id: number
  title: string
  description: string
  status: string
  required_skills: string
  team_size: number
  team_members: any[]
  progress?: number
}

export function ActiveProjects() {
  const [activeProjects, setActiveProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveProjects()
  }, [])

  const fetchActiveProjects = async () => {
    try {
      const { data } = await api.get("/projects/my-projects")
      const filtered = data.filter(
        (p: Project) => p.status === "active" || p.status === "recruiting"
      )
      setActiveProjects(filtered)
    } catch (error) {
      console.error("Failed to fetch active projects", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground p-4">Loading active projects...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Active Projects</h2>
      {activeProjects.length === 0 ? (
        <div className="rounded-2xl bg-card p-5 text-center text-sm text-muted-foreground">
          No active projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {activeProjects.slice(0, 4).map((project) => {
            let skills: string[] = []
            if (project.required_skills) {
              if (Array.isArray(project.required_skills)) {
                skills = project.required_skills
              } else if (typeof project.required_skills === "string") {
                skills = project.required_skills.split(", ")
              }
            }
            const currentMembers = project.team_members ? project.team_members.length : 0

            return (
              <div
                key={project.id}
                className="group rounded-2xl bg-card p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-card-foreground/70 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <Badge
                    className={
                      project.status === "recruiting"
                        ? "shrink-0 ml-2 border-0 bg-accent/20 text-accent"
                        : "shrink-0 ml-2 border-0 bg-primary/20 text-primary"
                    }
                  >
                    {project.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-card-foreground/70">
                    <span>Progress</span>
                    <span className="text-primary">{project.progress || 0}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-1.5 bg-secondary" />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-card-foreground/70">
                  <Users className="size-3.5" />
                  <span>
                    {currentMembers}/{project.team_size} members
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
