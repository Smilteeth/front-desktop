import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/coursesIconActive.module.css'
import coursesIcon from '@renderer/assets/icons/CourseIcon.svg'

const CoursesIcon: React.FC = () => {
  const navigate = useNavigate()

  const handleBack: () => void = () => {
    navigate(-1)
  }

  return (
    <div className={styles.container}>
      <img
        src={coursesIcon}
        alt="Courses Icone"
        className={styles.coursesIcon}
        onClick={handleBack}
      />
    </div>
  )
}

export default CoursesIcon
