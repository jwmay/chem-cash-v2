import { NavLink } from 'react-router'
import type { SizeProp } from '@fortawesome/fontawesome-svg-core'

import Icon from '~/components/icon'

interface DockProps {
  userRole: 'admin' | 'student' | 'teacher'
}

export default function Dock({ userRole }: DockProps) {
  const dockButtons = {
    admin: [
      { name: 'Teachers', icon: 'users' },
      { name: 'Settings', icon: 'gear' },
    ],
    student: [
      { name: 'Account', icon: 'money-bill-wave' },
      { name: 'Passes', icon: 'ticket' },
      { name: 'Songs', icon: 'music' },
      { name: 'Store', icon: 'shop' },
      { name: 'Settings', icon: 'gear' },
    ],
    teacher: [
      { name: 'Accounts', icon: 'money-bill-wave' },
      { name: 'Songs', icon: 'music' },
      { name: 'Store', icon: 'shop' },
      { name: 'Courses', icon: 'book' },
      { name: 'Settings', icon: 'gear' },
    ],
  }

  const iconSize: SizeProp = '2x'

  return (
    <div className='dock dock-xl'>
      {dockButtons[userRole].map((button) => (
        <NavLink
          className={({ isActive }) => (isActive ? 'dock-active' : '')}
          key={button.name}
          to={`${userRole}/${button.name.toLowerCase()}`}
        >
          <Icon name={button.icon} size={iconSize} />
          <span className='dock-label'>{button.name}</span>
        </NavLink>
      ))}
    </div>
  )
}
