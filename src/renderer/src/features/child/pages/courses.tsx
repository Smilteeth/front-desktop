import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/courseCatalog.module.css'
import CoursesIconActive from '@renderer/components/coursesIconeActive'
import TeethIcon from '@renderer/components/teethIcon'

interface Course {
  id: number
  title: string
  thumbnail: string
}

interface CourseCardProps {
  course: Course
}

const Courses: FC = () => {
  const navigate = useNavigate()

  const courses = {
    inProgress: [
      { id: 1, title: 'Cepillado correcto', thumbnail: './assets/course1.png' },
      { id: 2, title: 'Uso del hilo dental', thumbnail: './assets/course2.png' }
    ],
    recommended: [{ id: 3, title: 'Alimentos saludables', thumbnail: './assets/course3.png' }],
    all: [
      { id: 1, title: 'Cepillado correcto', thumbnail: './assets/course1.png' },
      { id: 2, title: 'Uso del hilo dental', thumbnail: './assets/course2.png' },
      { id: 3, title: 'Alimentos saludables', thumbnail: './assets/course3.png' },
      { id: 4, title: 'Visita al dentista', thumbnail: './assets/course4.png' },
      { id: 5, title: 'Cuidado de brackets', thumbnail: './assets/course5.png' },
      { id: 6, title: 'Mi primer diente', thumbnail: './assets/course6.png' }
    ]
  }

  const CourseCard: FC<CourseCardProps> = ({ course }) => {
    const handleClick = (): void => {
      navigate(`/courses/course/${course.id}`)
    }

    return (
      <div className={styles['course-card']} onClick={handleClick}>
        <div className={styles['thumbnail-container']}>
          <div className={styles['thumbnail']}>
            <div className={styles['play-button']}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
        <h3 className={styles['course-title']}>{course.title}</h3>
      </div>
    )
  }

  return (
    <div className={styles['courses-container']}>
      {/* Header */}
      <div>{/* Aquí el header con perfil, monedas y notificaciones */}</div>

      <main className={styles['courses-main']}>
        {/* Sección de búsqueda */}
        <div className={styles['search-box']}>
          <input type="text" placeholder="Buscar cursos..." className={styles['search-input']} />
          <button className={styles['search-button']}>{/* Icono */}</button>
        </div>

        <section className={styles['recommended-courses']}>
          <h2 className={styles['section-title']}>Recomendados por el odontólogo</h2>
          <div className={styles['course-grid']}>
            {courses.recommended.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        <section className={styles['all-courses']}>
          <h2 className={styles['section-title']}>Todos los cursos</h2>
          <div className={styles['course-grid']}>
            {courses.all.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>

      <footer className={styles['navigation-footer']}>
        <button className={`${styles['nav-button']} ${styles.active}`}>
          <CoursesIconActive />
          <span>Cursos</span>
        </button>
        <button className={styles['nav-button']}>
          {/* Aquí tu ruta a Dientin */}
          <TeethIcon />
          <span>Dientin</span>
        </button>
      </footer>
    </div>
  )
}

export default Courses
