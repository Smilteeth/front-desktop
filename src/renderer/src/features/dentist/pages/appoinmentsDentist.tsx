import React from 'react'
import styles from '../styles/appointmentsDentist.module.css'
import NavBar from '../components/navBar'

const AppointmentDentist: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Citas agendadas</h1>
          </div>
          <div className={styles.appointments}></div>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default AppointmentDentist
