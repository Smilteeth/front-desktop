import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from '../styles/coursePlayer.module.css'
import BackButton from '@renderer/components/backButton'
import { useParams, useNavigate } from 'react-router-dom'
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

interface VideoPlayerScreenProps {
  videoUrl?: string
  courseTitle?: string
  lessonTitle?: string
  onBack?: () => void
}

// Componente principal de reproducción de video
const CoursePlayer: React.FC<VideoPlayerScreenProps> = () => {
  // Referencias a elementos DOM
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Estados para controlar la UI y comportamiento
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [showControls, setShowControls] = useState<boolean>(true)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<CourseWithLessons | null>(null)

  // Parámetros de la URL
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()

  // Referencia para el temporizador de ocultar controles
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Función para obtener los datos del curso y la lección
  const fetchLessonData = async (): Promise<void> => {
    if (!courseId || !lessonId) {
      setError('Parámetros de URL inválidos')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const courseData = await courseService.getCourseById(Number(courseId))

      if (!courseData.isActive) {
        throw new Error('Este curso no está disponible')
      }

      const lesson = courseData.lessons.find(
        (l) => l.lessonId === Number(lessonId) && l.isActive
      )

      if (!lesson) {
        throw new Error('Lección no encontrada o no disponible')
      }

      setCourse(courseData)
      setCurrentLesson(lesson)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching lesson data:', err)
    } finally {
      setLoading(false)
    }
  }


  // Cargar datos de la lección al montar el componente
  useEffect(() => {
    fetchLessonData()
  }, [courseId, lessonId])

  // Maneja la reproducción y pausa del video
  const togglePlayPause = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error al reproducir el video:', error)
          // Muestra un mensaje amigable para niños en caso de error
          alert('¡Ups! No pudimos reproducir el video. ¡Inténtalo otra vez!')
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

// Función modificada para manejar el final del video
  const updateProgressBar = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const { currentTime: ct, duration: dur = 1 } = video
    const percent = (ct / dur) * 100

    setProgress(percent)
    setCurrentTime(ct)

    if (ct >= dur - 0.1) {
      // Mostrar confirmación antes de redirigir al cuestionario
      const userConfirmed = window.confirm(
        '¡Felicidades! Has completado la lección.\n\nAhora debes responder el cuestionario para continuar.\n\n¿Listo para comenzar?'
      )

      if (userConfirmed) {
        // Redirigir al cuestionario de la lección actual
        navigate(`/courses/course/${courseId}/lesson/${lessonId}/quiz`)
      } else {
        // Si el usuario cancela, reiniciar el video al inicio
        video.currentTime = 0
        setIsPlaying(false)
      }
    }
  }, [courseId, lessonId, navigate])

  // Función modificada para navegar a la siguiente lección
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigateToNextLesson = (): void => {
    if (!course || !currentLesson) return

    const currentIndex = course.lessons.findIndex(l => l.lessonId === currentLesson.lessonId)
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1]
      // Mostrar confirmación antes de redirigir
      const userConfirmed = window.confirm(
        '¡Lección completada!\n\n¿Deseas continuar con la siguiente lección?'
      )

      if (userConfirmed) {
        navigate(`/courses/course/${courseId}/lesson/${nextLesson.lessonId}`)
      }
    } else {
      // Mostrar confirmación para el final del curso
      const userConfirmed = window.confirm(
        '¡Felicidades! Has completado todo el curso.\n\n¿Deseas volver al inicio del curso?'
      )

      if (userConfirmed) {
        navigate(`/courses/course/${courseId}`)
      }
    }
  }

  // Maneja el clic en la barra de progreso para saltar a diferentes partes del video
  // const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>): void => {
  //   if (videoRef.current && progressBarRef.current) {
  //     const rect = progressBarRef.current.getBoundingClientRect()
  //     const clickPosition = e.clientX - rect.left
  //     const barWidth = rect.width
  //     const seekPercent = clickPosition / barWidth
  //     videoRef.current.currentTime = seekPercent * videoRef.current.duration
  //   }
  // }

  // Formatea el tiempo en formato MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Muestra/oculta los controles automáticamente
  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current)
    }

    setShowControls(true)

    // Oculta los controles después de 3 segundos de inactividad
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }, [isPlaying])

  // Configuración de eventos cuando el componente se monta
  useEffect(() => {
    const video = videoRef.current

    const handleLoadedMetadata = (): void => {
      if (video) setDuration(video.duration)
    }

    if (!video) return

    // Eventos del video
    video.addEventListener('timeupdate', updateProgressBar)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', () => setIsPlaying(true))
    video.addEventListener('pause', () => setIsPlaying(false))
    video.addEventListener('ended', () => setIsPlaying(false))

    // Limpieza de eventos cuando el componente se desmonta
    return () => {
      if (video) {
        video.removeEventListener('timeupdate', updateProgressBar)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('play', () => setIsPlaying(true))
        video.removeEventListener('pause', () => setIsPlaying(false))
        video.removeEventListener('ended', () => setIsPlaying(false))
      }

      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current)
      }
    }
  }, [updateProgressBar, currentLesson])

  // Reinicia el temporizador de controles cuando cambia el estado de reproducción
  useEffect(() => {
    resetControlsTimer()
  }, [resetControlsTimer])

  if (loading) {
    return (
      <div className={styles['video-player-container']}>
        <div className={styles['loading-container']}>
          <BackButton />
          <p>Cargando lección...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles['video-player-container']}>
        <div className={styles['error-container']}>
          <BackButton />
          <h2>¡Oops!</h2>
          <p>{error}</p>
          <button onClick={fetchLessonData} className={styles['retry-button']}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!currentLesson || !course) {
    return (
      <div className={styles['video-player-container']}>
        <div className={styles['error-container']}>
          <BackButton />
          <p>Lección no encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={styles['video-player-container']}
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
    >
      {/* ─── Encabezado ───────────────────────────── */}
      <div className={`${styles.header} ${showControls ? styles.visible : styles.hidden}`}>
        <BackButton />
        <div className={styles['title-container']}>
          <h1 className={styles.title}>{course.name}</h1>
          <h2 className={styles.subtitle}>{currentLesson.name}</h2>
        </div>
      </div>

      {/* ─── Video ───────────────────────────────── */}
      <div className={styles['video-wrapper']}>
        <video
          ref={videoRef}
          className={styles['video-element']}
          src= {currentLesson.contentUrl}
          onClick={togglePlayPause}
          playsInline
          crossOrigin="anonymous"
        />

        {!isPlaying && (
          <button className={styles['play-pause-button']} onClick={togglePlayPause}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>

      {/* ─── Controles inferiores ─────────────────── */}
      <div className={`${styles.controls} ${showControls ? styles.visible : styles.hidden}`}>
        {/* Tiempo */}
        <div className={styles['time-display']}>
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Barra de progreso */}
        <div
          className={styles['progress-bar']}
          ref={progressBarRef}
          // onClick={handleProgressBarClick}
        >
          <div className={styles['progress-filled']} style={{ width: `${progress}%` }} />
        </div>

        {/* Información de la lección */}
        <div className={styles['lesson-info']}>
          <span className={styles['lesson-number']}>
            {course.lessons.findIndex(l => l.lessonId === currentLesson.lessonId) + 1} / {course.lessons.length}
          </span>
        </div>

        {/* Dientes */}
        <div className={styles['teeth-illustrations']}>
          <div className={`${styles.tooth} ${styles['tooth-1']}`} />
          <div className={`${styles.tooth} ${styles['tooth-2']}`} />
          <div className={`${styles.tooth} ${styles['tooth-3']}`} />
        </div>
      </div>
    </div>
  )
}

export default CoursePlayer
