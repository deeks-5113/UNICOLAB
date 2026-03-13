"use client"

import { useState, useEffect } from "react"
import { FolderKanban, Users, Inbox, UsersRound } from "lucide-react"
import api from "@/lib/api"

export function StatCards() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get("/dashboard/analytics")
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics", error)
    } finally {
      setLoading(false)
    }
  }

  const defaultStats = [
    {
      label: "Active Projects",
      value: analytics ? analytics.active_projects.toString() : "0",
      icon: FolderKanban,
      change: "Current",
    },
    {
      label: "Associated Teammates",
      value: analytics ? analytics.total_teammates.toString() : "0",
      icon: Users,
      change: "All active",
    },
    {
      label: "Collaboration Requests",
      value: analytics ? analytics.total_requests.toString() : "0",
      icon: Inbox,
      change: "Total",
    },
    {
      label: "Total Projects",
      value: analytics ? analytics.total_projects.toString() : "0",
      icon: UsersRound,
      change: "Created & Joined",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {defaultStats.map((stat) => (
        <div
          key={stat.label}
          className="group flex items-center gap-4 rounded-2xl bg-card p-5 transition-transform hover:-translate-y-0.5"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
            <stat.icon className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">
              {loading ? "-" : stat.value}
            </p>
            <p className="text-sm text-card-foreground/70">{stat.label}</p>
            <p className="mt-0.5 text-xs text-primary">{stat.change}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
