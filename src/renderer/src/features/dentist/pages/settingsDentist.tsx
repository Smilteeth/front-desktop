import React from 'react'
import styles from '../styles/settingsDentist.module.css'
import NavBar from '../components/navBar'
import ArrowBack from '@renderer/assets/icons/arrowBack.svg'
import Button from '@renderer/components/button'

const Patients: React.FC = () => {
  const handleLogout = (): void => {
    localStorage.clear()
    window.location.href = '/'
  }

  const handleDeleteAccount = (): void => {
    console.log('Eliminar cuenta')
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Configuraciones</h1>
            <div className={styles.changeEmail}>
              <p>Cambiar correo electronico</p>
              <img src={ArrowBack} alt="Boton regresar" />
            </div>
            <div className={styles.changePassword}>
              <p>Cambiar contraseña</p>
              <img src={ArrowBack} alt="Boton regresar" />
            </div>
          </div>
          <div className={styles.buttons}>
            <Button name={'Cerrar sesión'} type={'button'} onClick={handleLogout} />
            <button type="button" onClick={handleDeleteAccount} className={styles.buttonDelete}>
              Eliminar cuenta
            </button>
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Patients
