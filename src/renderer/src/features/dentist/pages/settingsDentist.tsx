import React from 'react'
import styles from '../styles/settingsDentist.module.css'
import NavBar from '../components/navBar'

const Patients: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <h1>Configuraciones</h1>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Patients
