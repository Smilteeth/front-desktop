import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@renderer/features/auth/components/protectedRoute'
import Login from '@renderer/features/auth/pages/login'
import Singup from '@renderer/features/auth/pages/signUp'
import FormDentis from '@renderer/features/dentist/pages/formDentis'
import DentistDashboard from '@renderer/features/dentist/pages/dentistDashboard'
import AppointmentDentist from '@renderer/features/dentist/pages/appoinmentsDentist'
import Patients from '@renderer/features/dentist/pages/patients'
import SettingsDentist from '@renderer/features/dentist/pages/settingsDentist'
import ProfileDentist from '@renderer/features/dentist/pages/profile'

function AuthRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Singup />} />

      {/* Routes for Dentist */}
      <Route path="/formDentist" element={<FormDentis />} />
      <Route path="/dentistDashboard" element={<DentistDashboard />} />
      <Route path="/citasDentist" element={<AppointmentDentist />} />
      <Route path="/pacientes" element={<Patients />} />
      <Route path="/configuracion" element={<SettingsDentist />} />
      <Route path="/perfil" element={<ProfileDentist />} />

      {/* Routes for Patient */}
      {/* <Route path="/patientDashboard" element={<PatientDashboard />} /> */}

      {/* Routes for Receptionist */}
      {/* <Route path="/receptionistDashboard" element={<ReceptionistDashboard />} /> */}

      {/* Routes for Dentist */}
      {/* <Route path="/dentistDashboard" element={<DentistDashboard />} /> */}

      {/* Routes for Admin */}
      {/* <Route path="/adminDashboard" element={<AdminDashboard />} /> */}

      {/* Routes for Mother */}
      {/* <Route path="/motherDashboard" element={<MotherDashboard />} /> */}

      {/* Routes for Child */}
      {/* <Route path="/childDashboard" element={<ChildDashboard />} /> */}

      {/* Routes for Father */}
      {/* <Route path="/fatherDashboard" element={<FatherDashboard />} /> */}
    </Routes>
  )
}

export default AuthRoutes
