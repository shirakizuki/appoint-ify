// IMPORT LIBRARY
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
// IMPORT HOOKS
import { Routes, Route } from 'react-router-dom';
// IMPORT COMPONENTS DEFAULT
import Home from '../src/app/pages/BasePages/Homepage/Home'
import OneTimePin from './app/pages/students/StudentAppointment/OneTimePin';
// IMPORT COMPONENTS TEACHER
import Login from './app/pages/BasePages/LoginPage/Login'
import TeacherHomepage from './app/pages/teacher/TeacherHomepage/TeacherHomepage';
import TeacherSettings from './app/pages/teacher/TeacherSettings/TeacherSettings';
import AdminHome from './app/pages/admin/AdminHome/AdminHome'
import AdminDashboard from './app/pages/admin/AdminDashboard/AdminDashboard';
import AdminCalendar from './app/pages/admin/AdminCalendar/AdminCalendar'
import AdminAppointment from './app/pages/admin/AdminAppointment/AdminAppointment'
import AdminTeacher from './app/pages/admin/AdminTeacher/AdminTeacher'
// IMPORT COMPONENTS STUDENT
import StudentAppointment from './app/pages/students/StudentAppointment/StudentAppointment';
import SuccessPage from './app/pages/students/StudentAppointment/SuccessPage';
// IMPORT COMPONENTS ADMIN
import AdminAppointments from './app/pages/admin/AdminAppointments/AdminAppointments';
import AdminTeachers from './app/pages/admin/AdminTeachers/AdminTeachers';

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
      <main>
        <AuthProvider store={store}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/appointment' element={<StudentAppointment />} />
            <Route path='/appointment/otp' element={<OneTimePin />} />
            <Route path='/appointment/success' element={<SuccessPage />} />
            <Route element={<AuthOutlet fallbackPath='/login'/>}>
              <Route path='/teacher/home' element={<TeacherHomepage />} />
              <Route path='/teacher/settings' element={<TeacherSettings/>} />
            </Route>
            <Route element={<AuthOutlet fallbackPath='/login'/>}>
              <Route path='/admin/home' element={<AdminAppointments />} />
              <Route path='/admin/teachers' element={<AdminTeachers />} />
            </Route>
          </Routes>
        </AuthProvider>
      </main>
    </>
  )
}

export default App
