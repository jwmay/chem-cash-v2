import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import { type Session } from '@supabase/supabase-js'

interface Profile {
  firstName: string
  lastName: string
  userRole: string
}

type SessionProviderProps = { children: React.ReactNode }

const SessionContext = createContext<{
  isLoading?: boolean
  profile: Profile | null
  session: Session | null
}>({
  isLoading: true,
  profile: null,
  session: null,
})

function SessionProvider({ children }: SessionProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null)
      } else {
        setSession(session)
      }
      setIsLoading(false)
      console.log(
        '[8] onAuthStateChange >> Auth event:',
        event,
        'Session:',
        session
      )
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user.id) {
        // Try to get cached profile from sessionStorage first
        const cachedProfile = sessionStorage.getItem('userProfile')
        if (cachedProfile) {
          try {
            const parsed = JSON.parse(cachedProfile)
            console.log('[9] Using cached profile from sessionStorage')
            setProfile(parsed)
            return // Use cached version, skip fetch
          } catch (e) {
            console.error('[E4] Error parsing cached profile:', e)
          }
        }

        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        console.log(
          '[10] fetchUserProfile() >> User Profile:',
          userProfile,
          'Error:',
          error
        )

        if (error) {
          console.error('[E5] Error fetching user profile:', error)
        } else {
          setProfile(userProfile)
          // Cache profile in sessionStorage
          sessionStorage.setItem('userProfile', JSON.stringify(userProfile))
        }
      } else {
        setProfile(null)
        sessionStorage.removeItem('userProfile')
      }
    }

    fetchUserProfile()
  }, [session])

  return (
    <SessionContext.Provider value={{ isLoading, profile, session }}>
      {children}
    </SessionContext.Provider>
  )
}

function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

export { SessionProvider, useSession }
