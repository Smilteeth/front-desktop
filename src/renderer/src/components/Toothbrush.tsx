import React from 'react'
import styles from '../styles/tootbrush.module.css'

export interface ToothbrushProps {
  color: string // ej. "#FEA29B" o "#FDE064"
  align: 'left' | 'right'
  title: string
  onPlay: () => void
}

const Toothbrush: React.FC<ToothbrushProps> = ({ color, align, title, onPlay }) => {
  // Elegimos la clase de alineado
  const alignClass = align === 'left' ? styles.alignLeft : styles.alignRight

  return (
    <div
      className={`${styles.container} ${alignClass}`}
      // Definimos la variable --color para el mango y la base
      style={{ '--color': color } as React.CSSProperties}
    >
      <div className={styles.bristleBase} />
      <div className={styles.bridge} />
      <div className={styles.handle} />
      <div className={styles.bristles}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.bristle} />
        ))}
      </div>

      <div className={styles.popup}>
        <div style={{ fontWeight: 'bold' }}>{title}</div>
        <div className={styles.play} onClick={onPlay}>
          <svg viewBox="0 0 24 24" width="32" height="32">
            <circle cx="12" cy="12" r="10" fill="#4A9FFF" />
            <path d="M10 8l6 4-6 4V8z" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Toothbrush
