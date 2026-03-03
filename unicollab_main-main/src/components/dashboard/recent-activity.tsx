"use client"

import { Activity } from "lucide-react"

export function RecentActivity() {
  return (
    <div className="rounded-2xl bg-card p-5">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h2>
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Activity className="size-8 text-muted-foreground mb-2 opacity-50" />
          <p className="text-sm text-foreground font-medium">No recent activity</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your latest updates will appear here
          </p>
        </div>
      </div>
    </div>
  )
}
