import { redirect } from 'react-router'

export function clientLoader() {
  // Perform any necessary checks or logic here
  // For example, if a user is not authenticated, redirect to login
  // if (!isLoggedIn()) {
  //   return redirect("/login");
  // }
  return redirect('/admin/teachers') // Redirect to the /admin/teachers route
}
