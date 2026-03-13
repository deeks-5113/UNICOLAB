"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  FolderKanban,
  Users,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "My Projects", href: "/projects", icon: FolderKanban },
  { label: "My Teams", href: "/teams", icon: Users },
]

export function AppSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { pathname } = useLocation()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-secondary border-r border-border transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              UniCollab
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card/50 hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-1 flex-col gap-1 px-3 pt-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            <LogOut className="size-5 shrink-0" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
