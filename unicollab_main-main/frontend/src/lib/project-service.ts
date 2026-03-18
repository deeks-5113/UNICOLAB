import api from './api'

/**
 * Resolves the Supabase profile ID for the currently logged-in user.
 * Auth is handled by FastAPI which stores user_email in localStorage.
 * We use that email to fetch the matching profile from Supabase.
 */
export const getCurrentSupabaseProfileId = async (): Promise<string | null> => {
    // With backend-only architecture, we use the backend profile ID.
    try {
        const { data } = await api.get('/users/profile')
        return data.id
    } catch {
        return null
    }
}


export interface Profile {
    id: string
    full_name: string
    domain: string
    year?: string
    year_of_study?: string
    branch?: string
    bio?: string
    interests?: string
    avatar_url: string
}

export interface TeamMember {
    id: string
    project_id: string
    member_id: string
    role_in_team: string
    joined_at: string
    member: Profile
}

// Replaced by TeamMember

export interface ProjectData {
    id: string
    founder_id: string
    title: string
    tagline: string
    description: string
    problem_statement: string
    goals: string
    expected_outcome: string
    domain: string
    domains: string[]
    required_skills: string[]
    eligible_years: string[]
    eligible_branches: string[]
    status: string
    requests_enabled: boolean
    team_size_required: number
    created_at: string
    founder: Profile
    teams: TeamMember[]
}

export const getProjectById = async (projectId: string): Promise<ProjectData | null> => {
    try {
        const { data } = await api.get(`/projects/${projectId}`)
        return data
    } catch (error) {
        console.error('Error fetching project:', error)
        return null
    }
}

export const createJoinRequest = async (projectId: string, userId: string, message: string) => {
    try {
        const { data } = await api.post('/requests/send', {
            project_id: projectId,
            message: message
        })
        return data
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || error.message)
    }
}

export const getSimilarProjects = async (domain: string, currentProjectId: string) => {
    try {
        const { data } = await api.get(`/marketplace/projects?domain=${domain}`)
        // Filter out the current project and limit to 4
        return (data || []).filter((p: any) => p.id !== currentProjectId).slice(0, 4)
    } catch (error) {
        console.error('Error fetching similar projects:', error)
        return []
    }
}

export const checkJoinRequestStatus = async (projectId: string, userId: string): Promise<string | null> => {
    try {
        const { data: sentRequests } = await api.get('/requests/sent')
        const myRequest = sentRequests.find((r: any) => r.project_id === projectId)
        return myRequest ? myRequest.status : null
    } catch (err) {
        console.error('Error checking join request:', err)
        return null
    }
}
