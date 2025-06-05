import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from '../styles/coursePlayer.module.css'
import BackButton from '@renderer/components/backButton'

// Definición de interfaces para las props y otros tipos
interface VideoPlayerScreenProps {
  videoUrl?: string
  courseTitle?: string
  onBack?: () => void
}

// Mock de datos de video para pruebas
const MOCK_VIDEO_URL = '/../../../assets/images/prueba.mp4'
const MOCK_COURSE_TITLE = 'Cepillado Correcto'

// Componente principal de reproducción de video
const CoursePlayer: React.FC<VideoPlayerScreenProps> = ({
  videoUrl = MOCK_VIDEO_URL,
  courseTitle = MOCK_COURSE_TITLE
}) => {
  // Referencias a elementos DOM
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Estados para controlar la UI y comportamiento
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [showControls, setShowControls] = useState<boolean>(true)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)

  // Referencia para el temporizador de ocultar controles
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Actualiza la barra de progreso durante la reproducción
  const updateProgressBar = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const { currentTime: ct, duration: dur = 1 } = video
    const percent = (ct / dur) * 100

    setProgress(percent)
    setCurrentTime(ct)

    if (ct >= dur - 0.5) {
      // aviso de finalización
      setTimeout(() => alert('¡Muy bien! ¡Has completado esta lección! 🎉'), 300)
    }
  }, [])

  // Maneja el clic en la barra de progreso para saltar a diferentes partes del video
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const clickPosition = e.clientX - rect.left
      const barWidth = rect.width
      const seekPercent = clickPosition / barWidth
      videoRef.current.currentTime = seekPercent * videoRef.current.duration
    }
  }

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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleLoadedMetadata = () => {
      if (video) setDuration(video.duration)
    }

    if (!video) return
    // Evento para detectar cuando los metadatos del video están cargados

    // Evento para actualizar el progreso
    video.addEventListener('timeupdate', updateProgressBar)

    // Evento para obtener la duración cuando los metadatos están listos
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    // Eventos para actualizar el estado de reproducción
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
  }, [updateProgressBar])

  // Reinicia el temporizador de controles cuando cambia el estado de reproducción
  useEffect(() => {
    resetControlsTimer()
  }, [resetControlsTimer])

  return (
    <div
      className={styles['video-player-container']}
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
    >
      {/* ─── Encabezado ───────────────────────────── */}
      <div className={`${styles.header} ${showControls ? styles.visible : styles.hidden}`}>
        <BackButton />
        <h1 className={styles.title}>{courseTitle}</h1>
      </div>

      {/* ─── Video ───────────────────────────────── */}
      <div className={styles['video-wrapper']}>
        <video
          ref={videoRef}
          className={styles['video-element']}
          src={videoUrl}
          onClick={togglePlayPause}
          playsInline
        />

        {!isPlaying && (
          <button className={styles['play-pause-button']} onClick={togglePlayPause}>
            {/* SVG play icon */}
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
          onClick={handleProgressBarClick}
        >
          <div className={styles['progress-filled']} style={{ width: `${progress}%` }} />
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
