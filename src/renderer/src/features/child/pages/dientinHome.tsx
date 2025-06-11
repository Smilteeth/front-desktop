import CoursesIcon from '../components/coursesIcon'
import styles from '../styles/dientinMenu.module.css'
import TeethIconActive from '../components/teethIconActive'
import { MenuButtons } from '../components/teethStoreButton'
import { ToothCharacter } from '../components/mascotaDientin'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Header } from '../components/childHeader'
import { courseService } from '../services/apiService'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function DientinHome(): React.JSX.Element {
  const navigate = useNavigate()
  const [childName, setChildName] = useState('Cargando...')
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchChildData = async () => {
      try {
        const childIdStr = localStorage.getItem('childId')
        if (!childIdStr) {
          throw new Error('childId no encontrado en localStorage')
        }

        const childId = parseInt(childIdStr)
        const name = await courseService.getChildName(childId)
        const totalCoins = await courseService.getChildCoins(childId)

        setChildName(name)
        setCoins(totalCoins)
      } catch (error) {
        console.error('Error al obtener datos del niño:', error)
      }
    }

    fetchChildData()
  }, [])

  return (
    <div className={styles['dientin-body']}>
      <Header
        childName={childName}
        coins={coins}
        profileAvatar="👧"
        // onNotificationClick={() => openNotifications()}
      />
      <main className={styles['main-content']}>
        <MenuButtons
          onStoreClick={() => navigate('/store')}
          onCustomizeClick={() => navigate('/customize')}
        />
        <div className={styles['tooth-character-container']}>
          <ToothCharacter />
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
