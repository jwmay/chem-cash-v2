import { Link, useLocation } from 'react-router'
import Logo from '~/components/logo'
import Icon from '~/components/icon'

export type UserProfile = {
  email: string
  first_name: string
  last_name: string
  user_role: string
}

function DropdownMenu({ profile }: { profile: UserProfile | null }) {
  return (
    <div className='dropdown dropdown-end dropdown-hover'>
      <div tabIndex={0} role='button' className='cursor-pointer'>
        <div className='avatar avatar-placeholder group relative overflow-hidden'>
          <div className='bg-secondary mask mask-hexagon-2 rounded-full text-primary w-12 flex items-center justify-center'>
            <span className='text-xl absolute transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:-translate-x-full'>
              {(() => {
                const userProfile = sessionStorage.getItem('userProfile')
                if (!userProfile) return 'CC'
                try {
                  const profile = JSON.parse(userProfile)
                  const firstName = profile.first_name?.trim()
                  const lastName = profile.last_name?.trim()
                  return firstName && lastName
                    ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
                    : 'CC'
                } catch {
                  return 'CC'
                }
              })()}
            </span>
            <Icon
              className='w-6 h-6 absolute opacity-0 translate-x-full transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-x-0'
              name='bars'
              size='xl'
            />
          </div>
        </div>
      </div>
      <ul
        className='dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow'
        tabIndex={0}
      >
        <li className='menu-title'>
          <div className='flex items-center text-base-content'>
            <Icon name='user' size='xl' className='mr-2' />
            <div>
              <span className='block'>
                {profile?.first_name} {profile?.last_name}
              </span>
              <span className='block font-light opacity-70 text-sm'>
                {profile?.email}
              </span>
            </div>
          </div>
        </li>
        <div className='divider my-0'></div>
        <li>
          <Link to={`${profile?.user_role}/settings`}>
            <Icon name='gear' size='lg' />
            Settings
          </Link>
        </li>
        <li>
          <Link to='/logout'>
            <Icon name='arrow-right-from-bracket' size='lg' />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default function Navbar() {
  const userProfile = sessionStorage.getItem('userProfile')
  const profile = userProfile ? JSON.parse(userProfile) : null

  const location = useLocation()

  function getPageName() {
    const path = location.pathname
    const page = path.split('/').pop()
    return page ? page.charAt(0).toUpperCase() + page.slice(1) : 'Home'
  }

  return (
    <nav className='navbar bg-primary shadow-md wrapper'>
      <div className='navbar-start'>
        <Link to={`${profile?.user_role}`}>
          <Logo className='h-18' />
        </Link>
      </div>
      <div className='navbar-center'>
        <h1 className='text-primary-content text-3xl'>{getPageName()}</h1>
      </div>
      <div className='navbar-end'>
        <DropdownMenu profile={profile} />
      </div>
    </nav>
  )
}
