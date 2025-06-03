import { useState } from 'react'
import BackButton from '@renderer/components/backButton'
import Toothbrush from '@renderer/components/Toothbrush'
import styles from '../styles/courseDetail.module.css'

interface Lesson {
  id: number
  title: string
  available: boolean
  position: 'left' | 'right'
  color: string
}

const lessons: Lesson[] = [
  { id: 1, title: 'Mi primer diente', available: true, position: 'right', color: '#FEA29B' },
  { id: 2, title: 'Yaelito me tocó', available: true, position: 'left', color: '#FDE064' },
  { id: 3, title: 'Erick dios', available: true, position: 'right', color: '#A8E6CF' },
  { id: 4, title: 'Título de lección', available: true, position: 'left', color: '#D4A5FF' }
]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function CourseDetail() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const handleLessonClick = (lesson: Lesson): void => {
    setSelectedLesson(lesson)
    // aquí disparas tu lógica de reproducción de video
  }

  return (
    <div className={styles['course-detail-screen']}>
      <div className={styles.container}>
        <BackButton />

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`
            ${styles['lesson-button']}
            ${styles[`position-${lesson.position}`]}
            ${lesson.available ? styles.available : ''}
          `}
            onClick={() => handleLessonClick(lesson)}
          >
            {lesson.available ? (
              <Toothbrush
                color={lesson.color}
                align={lesson.position}
                title={lesson.title}
                onPlay={() => handleLessonClick(lesson)}
              />
            ) : (
              <div className={styles['lesson-locked']}>{lesson.title}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
