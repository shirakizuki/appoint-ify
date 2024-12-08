import React from 'react';
import ProtectedRoute from './app/context/ProtectedRoute';

import { Routes, Route } from 'react-router-dom';

import LandingPage from './app/pages/BasePages/LandingPage/LandingPage';
import LoginPage from './app/pages/BasePages/LoginPage/LoginPage';
import AboutUsPage from './app/pages/BasePages/AboutUsPage/AboutUsPage';

import AdminHome from './app/pages/AdminPages/Homepage/AdminHome';

import Homepage from './app/pages/TeacherPages/Homepage/Homepage';

import AppointmentPage from './app/pages/AppointmentPages/AppointPage';
import StepsPage from './app/pages/AppointmentPages/StepperPage/StepsPage';


function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/appointment" element={<AppointmentPage />} />
      <Route path='/appointment/steps' element={<StepsPage />} />
      <Route element={<ProtectedRoute fallbackPath='/login' />}>
        <Route path='/admin/home' element={<AdminHome />} />
        <Route path='/teacher/home' element={<Homepage />} />
      </Route>
    </Routes>
  )
}

export default App