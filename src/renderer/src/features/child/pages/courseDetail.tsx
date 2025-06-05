import { useState, useEffect } from 'react'
import BackButton from '@renderer/components/backButton'
import Toothbrush from '@renderer/components/Toothbrush'
import styles from '../styles/courseDetail.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { courseService } from '../services/apiService'

// Interfaces para la API
interface Lesson {
  lessonId: number
  courseId: number
  name: string
  contentUrl: string
  duration: string
  creationDate: string
  lastModificationDate: string | null
  isActive: boolean
}

interface CourseWithLessons {
  courseId: number
  name: string
  description: string
  creationDate: string
  isActive: boolean
  lessons: Lesson[]
}

interface LessonButtonProps {
  lesson: Lesson
  position: 'left' | 'right'
  color: string
  index: number
}

// Colores predefinidos para las lecciones
const lessonColors = ['#FEA29B', '#FDE064', '#A8E6CF', '#D4A5FF', '#FFB6C1']

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function CourseDetail() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<CourseWithLessons | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()

  // Función para obtener el curso y sus lecciones de la API
  const fetchCourseDetails = async (): Promise<void> => {
    if (!courseId) {
      setError('ID del curso no válido')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const courseData = await courseService.getCourseById(Number(courseId))

      if (!courseData.isActive) {
        throw new Error('Este curso no está disponible')
      }

      courseData.lessons = courseData.lessons.filter((lesson) => lesson.isActive)
      setCourse(courseData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching course details:', err)
    } finally {
      setLoading(false)
    }
  }

  // Cargar detalles del curso al montar el componente
  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const handleLessonClick = (lesson: Lesson): void => {
    setSelectedLesson(lesson)
    navigate(`/courses/course/${courseId}/lesson/${lesson.lessonId}`)
  }

  // Función para determinar la posición de la lección (alternando izquierda/derecha)
  const getLessonPosition = (index: number): 'left' | 'right' => {
    return index % 2 === 0 ? 'right' : 'left'
  }

  // Función para obtener el color de la lección
  const getLessonColor = (index: number): string => {
    return lessonColors[index % lessonColors.length]
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  const LessonButton = ({ lesson, position, color, index }: LessonButtonProps) => (
    <div
      key={lesson.lessonId}
      className={`
        ${styles['lesson-button']}
        ${styles[`position-${position}`]}
        ${styles.available}
      `}
      onClick={() => handleLessonClick(lesson)}
    >
      <Toothbrush
        color={color}
        align={position}
        title={lesson.name}
        onPlay={() => handleLessonClick(lesson)}
      />
      <div className={styles['lesson-info']}>
        <span className={styles['lesson-duration']}>{lesson.duration}</span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={styles['course-detail-screen']}>
        <div className={styles.container}>
          <BackButton />
          <div className={styles['loading-container']}>
            <p>Cargando curso...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles['course-detail-screen']}>
        <div className={styles.container}>
          <BackButton />
          <div className={styles['error-container']}>
            <h2>¡Oops!</h2>
            <p>{error}</p>
            <button onClick={fetchCourseDetails} className={styles['retry-button']}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className={styles['course-detail-screen']}>
        <div className={styles.container}>
          <BackButton />
          <div className={styles['error-container']}>
            <p>Curso no encontrado</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['course-detail-screen']}>
      <div className={styles.container}>
        <BackButton />

        {/* Información del curso */}
        <div className={styles['course-header']}>
          <h1 className={styles['course-title']}>{course.name}</h1>
          <p className={styles['course-description']}>{course.description}</p>
          <div className={styles['course-meta']}>
            <span className={styles['lessons-count']}>
              {course.lessons.length} lecciones
            </span>
          </div>
        </div>

        {/* Lecciones */}
        {course.lessons.length > 0 ? (
          course.lessons.map((lesson, index) => (
            <LessonButton
              key={lesson.lessonId}
              lesson={lesson}
              position={getLessonPosition(index)}
              color={getLessonColor(index)}
              index={index}
            />
          ))
        ) : (
          <div className={styles['no-lessons']}>
            <p>Este curso no tiene lecciones disponibles aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}
