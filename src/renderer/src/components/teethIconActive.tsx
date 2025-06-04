import React from 'react'
// import { useNavigate } from 'react-router-dom'
import styles from '../styles/teethIconActive.module.css'
import teethIconActive from '@renderer/assets/icons/DientinIcon-active.svg'

const TeethIconActive: React.FC = () => {
  // const navigate = useNavigate()

  // const handleBack: () => void = () => {
  //   navigate(-1)
  // }

  return (
    <div className={styles.container}>
      <img
        src={teethIconActive}
        alt="Teeth Icone"
        className={styles.teethIconActive}
        // onClick={handleBack}
      />
    </div>
  )
}

export default TeethIconActive
