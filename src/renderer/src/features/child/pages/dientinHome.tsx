import CoursesIcon from '../components/coursesIcon'
import styles from '../styles/dientinMenu.module.css'
import React from 'react'
import TeethIconActive from '../components/teethIconActive'
import { Header } from '../components/childHeader'
import { MenuButtons } from '../components/teethStoreButton'
import { useNavigate } from 'react-router-dom'
import { ToothCharacter } from '../components/mascotaDientin'

// import { openNotifications } from '@renderer/utils/notifications';
// import { useNavigate } from 'react-router-dom';

export default function DentistScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const handleToothClick = (): void => {
    console.log('¡Diente clickeado!')
    // Aquí puedes agregar lógica adicional
  }

  return (
    <div className={styles['dientin-body']}>
      <Header
        childName="María"
        coins={1500}
        profileAvatar="👧"
        // onNotificationClick={() => openNotifications()}
      />
      <main className={styles['main-content']}>
        <MenuButtons
          onStoreClick={() => navigate('/store')}
          onCustomizeClick={() => navigate('/customize')}
        />
        <div className={styles['tooth-character-container']}>
          <ToothCharacter onClick={handleToothClick} />
        </div>
      </main>

      {/* <div className='dientin-character-container'>
        <ToothCharacter onClick={handleToothClick}/>
      </div> */}

      <footer className={styles['navigation-footer']}>
        <button className={styles['nav-button']}>
          {/*onClick={() => navigate('/courses')}> */}
          <CoursesIcon />
          <span>Cursos</span>
        </button>
        <button className={`${styles['nav-button']} ${styles.active}`}>
          <TeethIconActive />
          <span>Dientin</span>
        </button>
      </footer>
    </div>
  )
}
