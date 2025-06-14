import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '@renderer/features/auth/pages/login'
import Signup from '@renderer/features/auth/pages/signUp'
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
import FormFather from '@renderer/features/parent/pages/formFather'
import CourseDetail from '@renderer/features/child/pages/courseDetail'
import Courses from '@renderer/features/child/pages/courses'
import CoursePlayer from '@renderer/features/child/pages/coursePlayer'
import Dientin from '@renderer/features/child/pages/dientinHome'
import LessonQuiz from '@renderer/features/child/pages/quiz'

function AuthRoutes(): React.JSX.Element {
  return (
    <Routes>
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
      <Route path="/formFather" element={<FormFather />} />
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
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/course/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/course/:courseId/lesson/:lessonId"
        element={
          <ProtectedRoute>
            <CoursePlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pet"
        element={
          <ProtectedRoute>
            <Dientin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/course/:courseId/lesson/:lessonId/quiz"
        element={
          <ProtectedRoute>
            <LessonQuiz/>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AuthRoutes
