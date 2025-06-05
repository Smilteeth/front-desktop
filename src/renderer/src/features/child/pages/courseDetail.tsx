import { useState } from 'react'
import BackButton from '@renderer/components/backButton'
import Toothbrush from '@renderer/components/Toothbrush'
import styles from '../styles/courseDetail.module.css'
import { useNavigate, useParams } from 'react-router-dom'

interface Lesson {
  id: number
  title: string
  available: boolean
  position: 'left' | 'right'
  color: string
}

const lessons: Lesson[] = [
  { id: 1, title: 'Leccion 1', available: true, position: 'right', color: '#FEA29B' },
  { id: 2, title: 'Leccion 2', available: true, position: 'left', color: '#FDE064' },
  { id: 3, title: 'Leccion 3', available: true, position: 'right', color: '#A8E6CF' },
  { id: 4, title: 'Leccion final', available: true, position: 'left', color: '#D4A5FF' }
]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function CourseDetail() {
  // FIXME: No se porque da error selected lesson, revisar
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>() // obtener el ID del curso

  const handleLessonClick = (lesson: Lesson): void => {
    setSelectedLesson(lesson)
    navigate(`/courses/course/${courseId}/lesson/${lesson.id}`)
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
