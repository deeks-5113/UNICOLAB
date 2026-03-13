"use client"

import { useState, useEffect } from "react"
import { StatCards } from "@/components/dashboard/stat-cards"
import { ActiveProjects } from "@/components/dashboard/active-projects"
import { ProjectRequests } from "@/components/dashboard/project-requests"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import api from "@/lib/api"

export default function DashboardPage() {
  const [firstName, setFirstName] = useState("User")

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/users/profile")
      const name = data.profile?.full_name || data.email.split("@")[0]
      setFirstName(name.split(" ")[0])
    } catch (error) {
      console.error("Failed to fetch user in DashboardPage", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {firstName}! Here is your collaboration overview.
          </p>
        </div>
        <Link
          to="/projects/create"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Plus className="size-4" />
          Add New Project
        </Link>
      </div>

      {/* Stat Cards */}
      <StatCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ProjectRequests />
          <ActiveProjects />
          <RecentActivity />
        </div>
        <div>
          <ProfileCard />
        </div>
      </div>
    </div>
  )
}
