import React, { useState } from 'react'
import styles from '../styles/toothCharacter.module.css'
import dientinIcon from '../../../assets/icons/Tito.svg'

interface ToothCharacterProps {
  onClick?: () => void
}

export const ToothCharacter: React.FC<ToothCharacterProps> = ({ onClick }) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleClick = (): void => {
    setIsAnimating(true)

    setTimeout(() => {
      setIsAnimating(false)
    }, 600)

    if (onClick) {
      onClick()
    }
  };

  return (
    <div
      className={`${styles.toothContainer} ${isAnimating ? styles.clicked : ''}`}
      onClick={handleClick}
    >
      <img src={dientinIcon} alt="Dientin" className={styles.toothIcon} />
    </div>
  )
}
