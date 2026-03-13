import { Link } from "react-router-dom"
import { Users, Plus } from "lucide-react"

export default function TeamsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Teams</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your teams and current members.
                    </p>
                </div>
                <button
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 cursor-not-allowed opacity-50"
                >
                    <Plus className="size-4" />
                    Create Team
                </button>
            </div>

            {/* Main Content */}
            <div className="rounded-2xl border border-border bg-secondary p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                <Users className="size-12 opacity-50" />
                <h2 className="text-lg font-semibold text-foreground">No Teams Available</h2>
                <p className="text-sm">You are not part of any teams right now. Create or join a project to start collaborating!</p>
            </div>
        </div>
    )
}
