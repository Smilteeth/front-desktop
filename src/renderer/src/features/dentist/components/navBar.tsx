import { Link, useLocation } from 'react-router-dom'
import styles from '../styles/navBar.module.css'
import HomeIcon from '@renderer/assets/images/home_icon.svg'
import AppointmentIcon from '@renderer/assets/images/appointment_icon.svg'
import PatientIcon from '@renderer/assets/images/patient_icon.svg'
import ProfileIcon from '@renderer/assets/images/profile_icon.svg'
import SettingsIcon from '@renderer/assets/images/settings_icon.svg'
import HomeIconActive from '@renderer/assets/images/home_icon_active.svg'
import AppointmentIconActive from '@renderer/assets/images/appointment_icon_active.svg'
import PatientIconActive from '@renderer/assets/images/patient_icon_active.svg'
import ProfileIconActive from '@renderer/assets/images/profile_icon_active.svg'
import SettingsIconActive from '@renderer/assets/images/settings_icon_active.svg'

const NavBar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string): boolean => location.pathname === path

  return (
    <nav className={styles.navBar}>
      <Link
        to="/dentistDashboard"
        className={`${styles.container} ${isActive('/dentistDashboard') ? styles.active : ''}`}
      >
        <img src={isActive('/dentistDashboard') ? HomeIconActive : HomeIcon} alt="Inicio" />
        <span>Inicio</span>
      </Link>
      <Link
        to="/citasDentist"
        className={`${styles.container} ${isActive('/citasDentist') ? styles.active : ''}`}
      >
        <img
          src={isActive('/citasDentist') ? AppointmentIconActive : AppointmentIcon}
          alt="Citas"
        />
        <span>Citas</span>
      </Link>
      <Link
        to="/pacientes"
        className={`${styles.container} ${isActive('/pacientes') ? styles.active : ''}`}
      >
        <img src={isActive('/pacientes') ? PatientIconActive : PatientIcon} alt="Pacientes" />
        <span>Pacientes</span>
      </Link>
      <Link
        to="/perfil"
        className={`${styles.container} ${isActive('/perfil') ? styles.active : ''}`}
      >
        <img src={isActive('/perfil') ? ProfileIconActive : ProfileIcon} alt="Perfil" />
        <span>Perfil</span>
      </Link>
      <Link
        to="/configuracion"
        className={`${styles.container} ${isActive('/configuracion') ? styles.active : ''}`}
      >
        <img
          src={isActive('/configuracion') ? SettingsIconActive : SettingsIcon}
          alt="Configuración"
        />
        <span>Configuración</span>
      </Link>
    </nav>
  )
}

export default NavBar
