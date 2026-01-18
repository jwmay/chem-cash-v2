import { redirect } from 'react-router'

export const clientLoader = () => {
  // Perform any necessary checks or logic here
  // For example, if a user is not authenticated, redirect to login
  // if (!isLoggedIn()) {
  //   return redirect("/login");
  // }
  return redirect('/teacher/accounts') // Redirect to the /teacher/accounts route
}
