import React from 'react'
import styles from '../styles/patients.module.css'
import NavBar from '../components/navBar'
import PatientsCard from '../components/patientsCard'

const Patients: React.FC = () => {
  const patients = [
    { name: 'Juan Pérez', birthDate: '1990-01-01' },
    { name: 'María López', birthDate: '1985-05-15' },
    { name: 'Carlos García', birthDate: '2000-10-20' },
    { name: 'Ana Martínez', birthDate: '1995-03-30' },
    { name: 'Luis Fernández', birthDate: '1988-07-25' },
    { name: 'Laura Sánchez', birthDate: '1992-12-12' },
    { name: 'Pedro Gómez', birthDate: '1980-11-11' },
    { name: 'Sofía Torres', birthDate: '1993-09-09' },
    { name: 'Diego Ramírez', birthDate: '1991-04-04' },
    { name: 'Valentina Díaz', birthDate: '1987-06-06' },
    { name: 'Andrés Morales', birthDate: '1994-08-08' },
    { name: 'Camila Herrera', birthDate: '1996-02-02' },
    { name: 'Javier Castro', birthDate: '1989-03-03' },
    { name: 'Isabella Romero', birthDate: '1997-05-05' },
    { name: 'Sebastián Ruiz', birthDate: '1998-07-07' },
    { name: 'Natalia Vargas', birthDate: '1992-09-09' },
    { name: 'Felipe Ortega', birthDate: '1986-10-10' }
  ]

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Pacientes bajo su cuidado</h1>
          <div className={styles.patientsList}>
            {patients.map((patient, index) => (
              <PatientsCard key={index} name={patient.name} birthDate={patient.birthDate} />
            ))}
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Patients
