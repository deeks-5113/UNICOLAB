"use client"

import { useState, useEffect } from "react"
import { Search, Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import api from "@/lib/api"

export function TopNavbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/users/profile")
      setUser(data)
    } catch (error) {
      console.error("Failed to fetch user in TopNavbar", error)
    }
  }

  // Calculate initials like "Alex Rivera" -> "AR"
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
  const domain = user?.profile?.domain || "Unknown Domain"
  const initials = getInitials(name)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6">
      {/*...hamburger menu...*/}
      <button
        onClick={onMenuToggle}
        className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects, people, skills..."
          className="h-10 w-full rounded-xl border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button className="relative flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            3
          </span>
        </button>

        {/* Profile */}
        <Link to="/profile" className="flex items-center gap-2">
          <Avatar className="size-9 bg-card text-card-foreground">
            <AvatarFallback className="bg-card text-card-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-foreground leading-none">
              {name}
            </p>
            <p className="text-xs text-muted-foreground">{domain}</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
