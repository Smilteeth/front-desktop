import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '@renderer/features/auth/pages/login'
import Singup from '@renderer/features/auth/pages/signUp'
import FormDentis from '@renderer/features/dentist/pages/formDentis'
import HomePage from '@renderer/features/parent/pages/home'
import ProfileSelection from '@renderer/features/parent/pages/profileSelection'
import Courses from '@renderer/features/child/pages/courses'
import CourseDetail from '@renderer/features/child/pages/courseDetail'
import CoursePlayer from '@renderer/features/child/pages/coursePlayer'
import Dientin from '@renderer/features/child/pages/dientin'

function AuthRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Courses />} />
      <Route path="/singup" element={<Singup />} />
      <Route path="/formDentist" element={<FormDentis />} />
      <Route path="/coursePlayer" element={<CoursePlayer />} />
      <Route path="/courseDetail" element={<CourseDetail />} />
      <Route path="/dientin" element={<Dientin />} />
    </Routes>
  )
}

export default AuthRoutes
