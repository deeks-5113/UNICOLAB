import { ActiveProjects } from "@/components/dashboard/active-projects"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your active projects and collaboration requests.
                    </p>
                </div>
                <Link
                    to="/projects/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                    <Plus className="size-4" />
                    Create Project
                </Link>
            </div>

            {/* Main Content */}
            <div className="rounded-2xl border border-border bg-secondary p-6">
                <ActiveProjects />
            </div>
        </div>
    )
}
