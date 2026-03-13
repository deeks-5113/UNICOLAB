import { supabase } from './supabase'

/**
 * Resolves the Supabase profile ID for the currently logged-in user.
 * Auth is handled by FastAPI which stores user_email in localStorage.
 * We use that email to fetch the matching profile from Supabase.
 */
export const getCurrentSupabaseProfileId = async (): Promise<string | null> => {
    // Fast path: check if already cached from login sync
    const cachedId = localStorage.getItem('supabase_profile_id')
    if (cachedId) return cachedId

    const email = localStorage.getItem('user_email')
    console.log('[Auth] Looking up Supabase profile for email:', email)

    if (!email) {
        console.warn('[Auth] No user_email found in localStorage. Keys:', Object.keys(localStorage))
        return null
    }

    // Try exact match first
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', email.trim())
        .maybeSingle()

    if (error) {
        console.error('[Auth] Supabase profile lookup error:', error)
        return null
    }

    if (!data) {
        console.warn('[Auth] No profile found for email:', email,
            '— user may need to re-register or profile not synced')
        return null
    }

    // Cache it for future calls
    localStorage.setItem('supabase_profile_id', data.id)
    console.log('[Auth] Found Supabase profile id:', data.id)
    return data.id
}


export interface Profile {
    id: string
    full_name: string
    domain: string
    year: string
    bio: string
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
    required_skills: string[]
    status: string
    team_size_required: number
    created_at: string
    founder: Profile
    teams: TeamMember[]
}

export const getProjectById = async (projectId: string): Promise<ProjectData | null> => {
    const { data, error } = await supabase
        .from('projects')
        .select(`
      *,
      founder:profiles(*),
      teams(
        *,
        member:profiles(*)
      )
    `)
        .eq('id', projectId)
        .single()

    if (error) {
        console.error('Error fetching project:', error)
        return null
    }

    return data as unknown as ProjectData
}

export const createJoinRequest = async (projectId: string, userId: string, message: string) => {
    // First, fetch the project to get the founder_id (receiver)
    const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('founder_id')
        .eq('id', projectId)
        .single()

    if (projectError || !projectData) {
        throw new Error('Could not find project to send request to.')
    }

    const { data, error } = await supabase
        .from('collaboration_requests')
        .insert([
            {
                id: crypto.randomUUID(),
                project_id: projectId,
                sender_id: userId,
                receiver_id: projectData.founder_id,
                message,
                status: 'pending'
            }
        ])
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export const getSimilarProjects = async (domain: string, currentProjectId: string) => {
    const { data, error } = await supabase
        .from('projects')
        .select(`
      *,
      founder:profiles(full_name),
      teams(id)
    `)
        .eq('domain', domain)
        .eq('status', 'OPEN')
        .neq('id', currentProjectId)
        .limit(4)

    if (error) {
        console.error('Error fetching similar projects:', error)
        return []
    }

    return data
}

export const checkJoinRequestStatus = async (projectId: string, userId: string): Promise<string | null> => {
    const { data, error } = await supabase
        .from('collaboration_requests')
        .select('status')
        .eq('project_id', projectId)
        .eq('sender_id', userId)
        .maybeSingle()

    if (error) {
        console.error('Error checking join request:', error)
        return null
    }

    return data ? data.status : null
}
