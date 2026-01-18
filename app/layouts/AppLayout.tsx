import { Outlet } from 'react-router'
import Dock from '~/components/dock'
import Navbar from '~/components/navbar'

interface AppLayoutProps {
  userRole: 'admin' | 'student' | 'teacher'
}

export default function AppLayout({ userRole }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <main className='pt-8 wrapper'>
        <Outlet />
      </main>
      <Dock userRole={userRole} />
    </>
  )
}
