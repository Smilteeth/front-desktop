import React from 'react'
// import { useNavigate } from 'react-router-dom'
import styles from '../styles/coursesIconActive.module.css'
import coursesIconActive from '@renderer/assets/icons/CourseIcon-active.svg'

const CoursesIconActive: React.FC = () => {
  // const navigate = useNavigate()

  // const handleBack: () => void = () => {
  //   navigate(-1)
  // }

  return (
    <div className={styles.container}>
      <img
        src={coursesIconActive}
        alt="Courses Icone"
        className={styles.coursesIconActive}
        // onClick={handleBack}
      />
    </div>
  )
}

export default CoursesIconActive
