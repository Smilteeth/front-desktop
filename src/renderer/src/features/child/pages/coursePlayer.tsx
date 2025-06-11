import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from '../styles/coursePlayer.module.css'
import BackButton from '@renderer/components/backButton'
import { useParams, useNavigate } from 'react-router-dom'
import { courseService } from '../services/apiService'

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

const CoursePlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<CourseWithLessons | null>(null)
  const [hasQuestions, setHasQuestions] = useState(false)

  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()

  const fetchLessonData = async (): Promise<void> => {
    if (!courseId || !lessonId) {
      setError('Parámetros de URL inválidos')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const courseData = await courseService.getCourseById(Number(courseId))
      if (!courseData.isActive) throw new Error('Este curso no está disponible')

      const lesson = courseData.lessons.find(l => l.lessonId === Number(lessonId) && l.isActive)
      if (!lesson) throw new Error('Lección no encontrada o no disponible')

      setCourse(courseData)
      setCurrentLesson(lesson)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching lesson data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLessonData()
  }, [courseId, lessonId])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const checkQuestions = async () => {
      try {
        const questions = await courseService.getQuestionsForLesson(Number(lessonId))
        setHasQuestions(questions.length > 0)
      } catch {
        setHasQuestions(false)
      }
    }
    if (lessonId) checkQuestions()
  }, [lessonId])

  const updateProgressBar = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const { currentTime: ct, duration: dur = 1 } = video
    setProgress((ct / dur) * 100)
    setCurrentTime(ct)

    if (ct >= dur - 0.1) {
      if (hasQuestions) {
        const confirmQuiz = window.confirm(
          'Has completado la lección. Para avanzar, debes responder un pequeño cuestionario. ¿Deseas comenzar ahora?'
        )
        if (confirmQuiz) navigate(`/courses/course/${courseId}/lesson/${lessonId}/quiz`)
        else {
          video.currentTime = 0
          setIsPlaying(false)
        }
      } else {
        alert('Lección completada')
        navigateToNextLesson()
      }
    }
  }, [courseId, lessonId, navigate, hasQuestions, course, currentLesson])

  const navigateToNextLesson = (): void => {
    if (!course || !currentLesson) return
    const currentIndex = course.lessons.findIndex(l => l.lessonId === currentLesson.lessonId)
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1]
      const confirmNext = window.confirm('Has completado esta lección. ¿Deseas continuar con la siguiente?')
      if (confirmNext) navigate(`/courses/course/${courseId}/lesson/${nextLesson.lessonId}`)
    } else {
      const confirmEnd = window.confirm('Has completado todas las lecciones. ¿Deseas volver al inicio del curso?')
      if (confirmEnd) navigate(`/courses/course/${courseId}`)
    }
  }

  const togglePlayPause = (): void => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) video.pause()
    else video.play().catch(() => alert('Error al reproducir el video'))
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    setShowControls(true)
    if (isPlaying) controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000)
  }, [isPlaying])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleLoadedMetadata = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateProgressBar)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', () => setIsPlaying(true))
    video.addEventListener('pause', () => setIsPlaying(false))
    video.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('timeupdate', updateProgressBar)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', () => setIsPlaying(true))
      video.removeEventListener('pause', () => setIsPlaying(false))
      video.removeEventListener('ended', () => setIsPlaying(false))
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    }
  }, [updateProgressBar])

  useEffect(() => {
    resetControlsTimer()
  }, [resetControlsTimer])

  if (loading || !currentLesson || !course) {
    return (
      <div className={styles['video-player-container']}>
        <BackButton />
        <p>{loading ? 'Cargando lección...' : 'Lección no encontrada'}</p>
      </div>
    )
  }

  return (
    <div
      className={styles['video-player-container']}
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
    >
      <div className={`${styles.header} ${showControls ? styles.visible : styles.hidden}`}>
        <BackButton />
        <div className={styles['title-container']}>
          <h1 className={styles.title}>{course.name}</h1>
          <h2 className={styles.subtitle}>{currentLesson.name}</h2>
        </div>
      </div>

      <div className={styles['video-wrapper']}>
        <video
          ref={videoRef}
          className={styles['video-element']}
          src={currentLesson.contentUrl}
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

      <div className={`${styles.controls} ${showControls ? styles.visible : styles.hidden}`}>
        <div className={styles['time-display']}>
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className={styles['progress-bar']} ref={progressBarRef}>
          <div className={styles['progress-filled']} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles['lesson-info']}>
          <span className={styles['lesson-number']}>
            {course.lessons.findIndex((l) => l.lessonId === currentLesson.lessonId) + 1} /{' '}
            {course.lessons.length}
          </span>
        </div>

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
