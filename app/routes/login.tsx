import { Link, redirect, useFetcher } from 'react-router'
import { supabase } from '../lib/supabase/client'
import type { Route } from './+types/login'

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formData = await request.formData()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
    }
  }

  return redirect('/')
}

export default function Login() {
  const fetcher = useFetcher<typeof clientAction>()
  const error = fetcher.data?.error
  const loading = fetcher.state === 'submitting'

  return (
    <div>
      <h1>Login Page</h1>
      <p>This is the login page of the application.</p>

      <fetcher.Form method='post'>
        <label>
          Email:
          <input type='email' name='email' required />
        </label>
        <label>
          Password:
          <input type='password' name='password' required />
        </label>
        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </fetcher.Form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to='/'>Go back to Home</Link>
    </div>
  )
}
