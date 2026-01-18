import { redirect, type ClientLoaderFunctionArgs } from 'react-router'
import { supabase } from '~/lib/supabase/client'

interface Profile {
  user_id: string
  first_name: string
  last_name: string
  user_role: string
  email: string
}

// In-memory cache for profile data
let profileCache: {
  user_id: string
  profile: Profile
  timestamp: number
} | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper to clear cache (useful for profile updates)
export function clearProfileCache() {
  profileCache = null
}

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log('[1] protected clientLoader >> request.url:', request.url)
  console.log('[2] protected clientLoader >> session:', user, 'error:', error)

  if (error || !user) {
    console.error(
      '[E1] protected.tsx >> clientLoader >> getUser() >> error:',
      error
    )
    return redirect('/login')
  }

  if (user.id) {
    let profile: Profile | null = null

    // Check if we have a valid cached profile in memory
    const now = Date.now()
    if (
      profileCache &&
      profileCache.user_id === user.id &&
      now - profileCache.timestamp < CACHE_DURATION
    ) {
      console.log('[3] Using cached profile from memory')
      profile = profileCache.profile
    } else {
      // Try sessionStorage cache
      const cachedProfile = sessionStorage.getItem('userProfile')
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile)
          if (parsed.user_id === user.id) {
            console.log('[4] Using cached profile from sessionStorage')
            profile = parsed
            // Update memory cache
            profileCache = {
              user_id: user.id,
              profile: parsed,
              timestamp: now,
            }
          }
        } catch (e) {
          console.error('[E2] Error parsing cached profile:', e)
        }
      }

      // Fetch fresh profile data if no valid cache
      if (!profile) {
        const { data: fetchedProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error || !fetchedProfile) {
          console.error(
            '[E3] protected.tsx >> clientLoader >> getProfile >> error:',
            error
          )
          return redirect('/login')
        }

        // Cache the profile in both memory and sessionStorage
        profile = fetchedProfile
        profileCache = {
          user_id: user.id,
          profile: fetchedProfile,
          timestamp: now,
        }
        sessionStorage.setItem('userProfile', JSON.stringify(fetchedProfile))
        console.log('[5] Fetched and cached new profile')
      }
    }

    console.log('[6] protected clientLoader >> profile:', profile)

    // Safety check - this should never happen but TypeScript requires it
    if (!profile) {
      return redirect('/login')
    }

    // Get the current path to check role-based access
    const url = new URL(request.url)
    const path = url.pathname
    const userRole = profile.user_role

    // Define role-based route patterns
    const roleRoutes: Record<string, RegExp> = {
      admin: /^\/admin/,
      teacher: /^\/teacher/,
      student: /^\/student/,
    }

    // Check if user is accessing a role-specific route they don't have access to
    for (const [role, pattern] of Object.entries(roleRoutes)) {
      if (pattern.test(path) && role !== userRole) {
        console.log(`[7] Redirecting ${userRole} away from ${role} route`)
        return redirect(`/${userRole}`)
      }
    }

    // If accessing root or a non-role-specific protected route, redirect to their role page
    if (
      path === '/' ||
      (!roleRoutes[userRole]?.test(path) &&
        !Object.values(roleRoutes).some((pattern) => pattern.test(path)))
    ) {
      return redirect(`/${userRole}`)
    }

    // User has correct role for this route, allow access
    return { session: user, profile }
  }

  return redirect('/login')
}
