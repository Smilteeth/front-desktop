import CoursesIcon from '@renderer/components/coursesIcon'
import styles from '../styles/dientinMenu.module.css'

import React from 'react'
// import { useNavigate } from 'react-router-dom';
import TeethIconActive from '@renderer/components/teethIconActive'
import { Header } from '../components/childHeader'
import { MenuButtons } from '../components/teethStoreButton'
// import { openNotifications } from '@renderer/utils/notifications';
import { useNavigate } from 'react-router-dom'

export default function DentistScreen(): React.JSX.Element {
  const navigate = useNavigate()

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
      </main>

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
