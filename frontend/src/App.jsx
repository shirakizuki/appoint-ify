// IMPORT LIBRARY
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
// IMPORT HOOKS
import { Routes, Route, useLocation } from 'react-router-dom';
// IMPORT COMPONENTS
// DEFAULT
import Home from '../src/app/pages/home/Home'
// TEACHER
import Login from '../src/app/pages/teacher/TeacherLogin/Login'
import AdminLogin from './app/pages/admin/AdminLogin/AdminLogin';
import TeacherHomepage from './app/pages/teacher/TeacherHomepage/TeacherHomepage';
import TeacherSettings from './app/pages/teacher/TeacherSettings/TeacherSettings';
import AdminHome from './app/pages/admin/AdminHome/AdminHome'
import AdminDashboard from './app/pages/admin/AdminDashboard/AdminDashboard';
import AdminCalendar from './app/pages/admin/AdminCalendar/AdminCalendar'
import AdminAppointment from './app/pages/admin/AdminAppointment/AdminAppointment'
import AdminTeacher from './app/pages/admin/AdminTeacher/AdminTeacher'

/**
 * The main App component.
 *
 * This component is the main entry point for the app. It renders a counter
 * that increments when the user clicks on the button.
 *
 * @returns {React.ReactElement} The App component.
 */
function App() {
  const store = createStore({
    authName:'_auth',
    authType:'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'http:',
  })
  return (
    <>
      <AuthProvider store={store}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/teacher/login' element={<Login />} />
          <Route element={<AuthOutlet fallbackPath='/teacher/login'/>}>
            <Route path='/teacher/home' element={<TeacherHomepage />} />
            <Route path='/teacher/settings' element={<TeacherSettings/>} />
          </Route>
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route element={<AuthOutlet fallbackPath='/admin/login'/>}>
            <Route path='/admin/home' element={<AdminHome/>}/>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/appointment' element={<AdminAppointment />} />
            <Route path='/admin/calendar' element={<AdminCalendar />} />
            <Route path='/admin/teacher' element={<AdminTeacher />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
