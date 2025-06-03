import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '@renderer/features/auth/pages/login'
import Signup from '@renderer/features/auth/pages/signUp'

/* FIXME: Solucion breve de conflictos */

// <<<<<<< HEAD
// import HomePage from '@renderer/features/parent/pages/home'
// import ProfileSelection from '@renderer/features/parent/pages/profileSelection'
// import Courses from '@renderer/features/child/pages/courses'
// import CourseDetail from '@renderer/features/child/pages/courseDetail'
// import CoursePlayer from '@renderer/features/child/pages/coursePlayer'
// import Dientin from '@renderer/features/child/pages/dientin'
// =======

import FormDentis from '@renderer/features/dentist/pages/formDentis'
import DentistDashboard from '@renderer/features/dentist/pages/dentistDashboard'
import ProfileSelection from '@renderer/features/parent/pages/profileSelection'
import FatherDashboard from '@renderer/features/parent/pages/fatherDashboard'
import AppointmentsFather from '@renderer/features/parent/pages/appointmentsFather'
import DentisDirectory from '@renderer/features/parent/pages/dentistsDirectory'
import DentistDetail from '@renderer/features/parent/pages/dentistDetail'
import AppointmentDentist from '@renderer/features/dentist/pages/appoinmentsDentist'
import Patients from '@renderer/features/dentist/pages/patients'
import SettingsDentist from '@renderer/features/dentist/pages/settingsDentist'
import ProfileDentist from '@renderer/features/dentist/pages/profile'
import ChildrenPage from '../features/parent/pages/childrenPage'
import ChildDetail from '@renderer/features/parent/pages/childDetail'
import { ProtectedRoute } from '@renderer/features/auth/components/protectedRoute'


function AuthRoutes(): React.JSX.Element {
  return (
    <Routes>

{/* <<<<<<< HEAD
      <Route path="/" element={<Courses />} />
      <Route path="/singup" element={<Singup />} />
      <Route path="/formDentist" element={<FormDentis />} />
      <Route path="/coursePlayer" element={<CoursePlayer />} />
      <Route path="/courseDetail" element={<CourseDetail />} />
      <Route path="/dientin" element={<Dientin />} />
======= */}


      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Routes for Dentist */}
      <Route
        path="/formDentist"
        element={
          <ProtectedRoute>
            <FormDentis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dentistDashboard"
        element={
          <ProtectedRoute>
            <DentistDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citasDentist"
        element={
          <ProtectedRoute>
            <AppointmentDentist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pacientes"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracion"
        element={
          <ProtectedRoute>
            <SettingsDentist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <ProfileDentist />
          </ProtectedRoute>
        }
      />

      {/* Routes for Father */}
      <Route
        path="/profile-selection"
        element={
          <ProtectedRoute>
            <ProfileSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fatherDashboard"
        element={
          <ProtectedRoute>
            <FatherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointmentFather"
        element={
          <ProtectedRoute>
            <AppointmentsFather />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dentistDirectory"
        element={
          <ProtectedRoute>
            <DentisDirectory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dentist/:dentistId"
        element={
          <ProtectedRoute>
            <DentistDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/children"
        element={
          <ProtectedRoute>
            <ChildrenPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/child/:childId"
        element={
          <ProtectedRoute>
            <ChildDetail />
          </ProtectedRoute>
        }
      />
{/* >>>>>>> a4a7ab5f26c9375243372c71b90ed8a4ed4f2af6 */}
    </Routes>
  )
}

export default AuthRoutes
