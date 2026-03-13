"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { ExternalLink } from "lucide-react"
import api from "@/lib/api"

export function ProfileCard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/users/profile")
      setUser(data)
    } catch (error) {
      console.error("Failed to fetch user in ProfileCard", error)
    }
  }

  // Calculate initials
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const name = user?.profile?.full_name || user?.email?.split("@")[0] || "User"
  const initials = getInitials(name)
  const domain = user?.profile?.domain || "Unknown Domain"
  const year = user?.profile?.year_of_study || "Unknown Year"
  const bio = user?.profile?.interests || "No bio available."
  const skills = user?.profile?.skills || []
  const portfolio = user?.profile?.portfolio_links || []

  return (
    <div className="rounded-2xl bg-card p-5">
      <div className="flex flex-col items-center text-center">
        <Avatar className="size-16 bg-accent text-accent-foreground">
          <AvatarFallback className="bg-accent text-accent-foreground text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-3 font-semibold text-card-foreground">{name}</h3>
        <p className="text-sm text-card-foreground/70">{domain} &middot; {year}</p>
        <p className="mt-2 text-xs text-card-foreground/60 leading-relaxed">{bio}</p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-card-foreground/50 mb-2">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {skills.length > 0 ? (
            skills.map((skill: string) => (
              <span
                key={skill}
                className="rounded-lg bg-primary/20 px-2 py-0.5 text-xs text-primary"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No skills added</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-card-foreground/50 mb-2">Portfolio</p>
        <div className="space-y-1">
          {portfolio.length > 0 ? (
            portfolio.map((link: string, index: number) => (
              <a
                key={index}
                href={link.startsWith("http") ? link : `https://${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="size-3" />
                {link}
              </a>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No links added</span>
          )}
        </div>
      </div>

      <Link
        to="/profile"
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-accent py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
      >
        View Full Profile
      </Link>
    </div>
  )
}
