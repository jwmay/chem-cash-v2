import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export default [
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  layout('routes/protected.tsx', [
    index('routes/home.tsx'),
    ...prefix('admin', [
      layout('layouts/AdminLayout.tsx', [
        index('pages/admin/AdminPage.tsx'),
        route('settings', 'pages/admin/AdminSettingsPage.tsx'),
        route('teachers', 'pages/admin/AdminTeachersPage.tsx'),
      ]),
    ]),
    ...prefix('student', [
      layout('layouts/StudentLayout.tsx', [
        index('pages/student/StudentPage.tsx'),
        route('account', 'pages/student/StudentAccountPage.tsx'),
        route('passes', 'pages/student/StudentPassesPage.tsx'),
        route('settings', 'pages/student/StudentSettingsPage.tsx'),
        route('songs', 'pages/student/StudentSongsPage.tsx'),
        route('store', 'pages/student/StudentStorePage.tsx'),
      ]),
    ]),
    ...prefix('teacher', [
      layout('layouts/TeacherLayout.tsx', [
        index('pages/teacher/TeacherPage.tsx'),
        route('accounts', 'pages/teacher/TeacherAccountsPage.tsx'),
        route('courses', 'pages/teacher/TeacherCoursesPage.tsx'),
        route('settings', 'pages/teacher/TeacherSettingsPage.tsx'),
        route('songs', 'pages/teacher/TeacherSongsPage.tsx'),
        route('store', 'pages/teacher/TeacherStorePage.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig
