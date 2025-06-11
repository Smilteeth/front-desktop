import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/teethIconActive.module.css'
import teethIcon from '@renderer/assets/icons/DientinIcon.svg'

const TeethIcon: React.FC = () => {
  const navigate = useNavigate()

  const handleBack: () => void = () => {
    navigate('/pet')
  }

  return (
    <div className={styles.container}>
      <img
        src={teethIcon}
        alt="Teeth Icone"
        className={styles.teethIcon}
        onClick={handleBack}
      />
    </div>
  )
}

export default TeethIcon
