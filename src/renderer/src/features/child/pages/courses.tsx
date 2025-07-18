import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/courseCatalog.module.css'
import CoursesIconActive from '../components/coursesIconeActive'
import TeethIcon from '../components/teethIcon'
import { courseService, Course, errorHandler } from '../services/apiService'
import { Header } from '../components/childHeader'

interface CourseCardProps {
  course: Course
}

const Courses: FC = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [childName, setChildName] = useState('Cargando...')
  const [coins, setCoins] = useState(0)

  const fetchCourses = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const activeCourses = await courseService.getActiveCourses()
      setCourses(activeCourses)
    } catch (err) {
      const errorMessage = errorHandler.getErrorMessage(err)
      setError(errorMessage)
      errorHandler.logError('fetchCourses', err)
    } finally {
      setLoading(false)
    }
  }

  const searchCourses = async (term: string): Promise<void> => {
    if (!term.trim()) {
      await fetchCourses()
      return
    }

    try {
      setSearchLoading(true)
      const searchResults = await courseService.searchCourses(term)
      setCourses(searchResults)
    } catch (err) {
      const errorMessage = errorHandler.getErrorMessage(err)
      setError(errorMessage)
      errorHandler.logError('searchCourses', err)
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchChildData = async () => {
      try {
        const childIdStr = localStorage.getItem('childId')
        if (!childIdStr) throw new Error('childId no encontrado')
        const childId = parseInt(childIdStr)
        const [name, totalCoins] = await Promise.all([
          courseService.getChildName(childId),
          courseService.getChildCoins(childId)
        ])
        setChildName(name)
        setCoins(totalCoins)
      } catch (error) {
        console.error('Error obteniendo datos del niño:', error)
      }
    }

    fetchChildData()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCourses(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const recommendedCourses = courses.slice(0, 2)
  const allCourses = courses

  const CourseCard: FC<CourseCardProps> = ({ course }) => {
    const [cardLoading, setCardLoading] = useState<boolean>(false)

    const handleClick = async (): Promise<void> => {
      try {
        setCardLoading(true)
        const isValid = await courseService.validateCourse(course.courseId)
        if (isValid) {
          navigate(`/courses/course/${course.courseId}`)
        } else {
          alert('Este curso no está disponible en este momento')
        }
      } catch (err) {
        errorHandler.logError('CourseCard click', err)
        alert('Error al acceder al curso')
      } finally {
        setCardLoading(false)
      }
    }

    return (
      <div
        className={`${styles['course-card']} ${cardLoading ? styles.loading : ''}`}
        onClick={handleClick}
      >
        <div className={styles['thumbnail-container']}>
          <div className={styles['thumbnail']}>
            <div className={styles['play-button']}>
              {cardLoading ? (
                <div className={styles.spinner}>⏳</div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              )}
            </div>
          </div>
        </div>
        <h3 className={styles['course-title']}>{course.name}</h3>
        <p className={styles['course-description']}>{course.description}</p>
        <div className={styles['course-meta']}>
          <span className={styles['creation-date']}>
            {new Date(course.creationDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = (): void => {
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className={styles['courses-container']}>
        <div className={styles['loading-container']}>
          <div className={styles.spinner}>🦷</div>
          <p>Cargando cursos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles['courses-container']}>
        <div className={styles['error-container']}>
          <h2>¡Oops!</h2>
          <p>{error}</p>
          <button onClick={fetchCourses} className={styles['retry-button']}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['courses-container']}>
      <Header childName={childName} coins={coins} profileAvatar="👧" />
      <div className={styles.header}>
        <h1>Mis Cursos</h1>
      </div>

      <main className={styles['courses-main']}>
        <div className={styles['search-box']}>
          <input
            type="text"
            placeholder="Buscar cursos..."
            className={styles['search-input']}
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className={styles['search-controls']}>
            {searchLoading && <div className={styles['search-spinner']}>🔍</div>}
            {searchTerm && (
              <button
                onClick={clearSearch}
                className={styles['clear-search']}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
            <button className={styles['search-button']}>🔍</button>
          </div>
        </div>

        {recommendedCourses.length > 0 && !searchTerm && (
          <section className={styles['recommended-courses']}>
            <h2 className={styles['section-title']}>Recomendados por el odontólogo</h2>
            <div className={styles['course-grid']}>
              {recommendedCourses.map((course) => (
                <CourseCard key={course.courseId} course={course} />
              ))}
            </div>
          </section>
        )}

        <section className={styles['all-courses']}>
          <h2 className={styles['section-title']}>
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los cursos'}
            <span className={styles['course-count']}>({allCourses.length})</span>
          </h2>

          {allCourses.length > 0 ? (
            <div className={styles['course-grid']}>
              {allCourses.map((course) => (
                <CourseCard key={course.courseId} course={course} />
              ))}
            </div>
          ) : (
            <div className={styles['no-courses']}>
              <div className={styles['no-courses-icon']}>📚</div>
              <p>
                {searchTerm ?
                  'No se encontraron cursos que coincidan con tu búsqueda' :
                  'No hay cursos disponibles en este momento'
                }
              </p>
              {searchTerm && (
                <button onClick={clearSearch} className={styles['clear-search-button']}>
                  Ver todos los cursos
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className={styles['navigation-footer']}>
        <button className={`${styles['nav-button']} ${styles.active}`}>
          <CoursesIconActive />
          <span>Cursos</span>
        </button>
        <button className={styles['nav-button']}>
          <TeethIcon />
          <span>Dientin</span>
        </button>
      </footer>
    </div>
  )
}

export default Courses
