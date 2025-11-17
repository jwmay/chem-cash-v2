import { redirect } from 'react-router'
import { supabase } from '~/lib/supabase/client'

export async function clientLoader() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error)
    return { success: false, error: error.message }
  }

  throw redirect('/')
}
