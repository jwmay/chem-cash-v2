import Button from '~/components/ui/button'
import FlyAwayButton from '~/components/ui/fly-away-button'
import Icon from '~/components/icon'
import Logo from '~/components/logo'
import { useEffect, useState } from 'react'
import { redirect, useFetcher } from 'react-router'
import { supabase } from '~/lib/supabase/client'
import type { Route } from './+types/login'

export const clientLoader = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    return redirect('/')
  }
  return null
}

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
  const [error, setError] = useState<string | null>(null)
  const fetcher = useFetcher<typeof clientAction>()
  const loading = fetcher.state === 'submitting'

  useEffect(() => {
    if (fetcher.data?.error) {
      setError(fetcher.data.error)
    } else if (fetcher.data && !fetcher.data.error) {
      setError(null)
    }
  }, [fetcher.data])

  function handleInputChange() {
    setError(null)
  }

  return (
    <div className='bg-cover bg-[url(/img/chemistry-background.jpg)] grid h-dvh place-items-center lg:place-items-end'>
      <div className='border border-gray-300 glass p-12 rounded-lg shadow-2xl w-sm md:w-lg lg:h-dvh lg:rounded-none lg:w-xl transition-[width] duration-500'>
        <fetcher.Form className='flex flex-col gap-8' method='post'>
          <Logo className='max-w-40 mx-auto' />

          <label className='input input-lg validator w-full'>
            <Icon name='user' />
            <input
              autoFocus
              name='email'
              onChange={handleInputChange}
              placeholder='Username'
              required
              type='email'
            />
          </label>

          <label className='input input-lg validator w-full'>
            <Icon name='lock' />
            <input
              name='password'
              onChange={handleInputChange}
              placeholder='Password'
              required
              type='password'
            />
          </label>

          {/* <Button disabled={loading} type='submit'>
            {loading ? (
              <span className='loading loading-dots loading-xl'></span>
            ) : (
              <span>
                <Icon name='arrow-right' /> Login
              </span>
            )}
          </Button> */}
          <FlyAwayButton
            icon={<Icon name='arrow-right' />}
            loading={loading}
            type='submit'
          >
            Login
          </FlyAwayButton>

          {error && !loading && (
            <div className='alert alert-error' role='alert'>
              <Icon name='bomb' />
              <span>{error}</span>
            </div>
          )}
        </fetcher.Form>
      </div>
    </div>
  )
}
