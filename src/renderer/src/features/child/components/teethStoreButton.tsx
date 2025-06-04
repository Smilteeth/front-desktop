import React, { useState } from 'react'
import styles from '../styles/teethButtons.module.css'

interface MenuButtonsProps {
  onStoreClick?: () => void
  onCustomizeClick?: () => void
}

export const MenuButtons: React.FC<MenuButtonsProps> = () => {
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false)
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false)

  const handleStoreClick = (): void => {
    setShowStoreModal(true)
  }

  const handleCustomizeClick = (): void => {
    setShowCustomizeModal(true)
  }

  const closeModals = (): void => {
    setShowStoreModal(false)
    setShowCustomizeModal(false)
  }

  return (
    <div className={styles.menuButtons}>
      <button
        className={`${styles.menuBtn} ${styles.storeBtn}`}
        onClick={handleStoreClick}
        aria-label="Abrir tienda"
      >
        <div className={styles.menuBtnIcon}>🏪</div>
        <span>Tienda</span>
      </button>
      <button
        className={`${styles.menuBtn} ${styles.customizeBtn}`}
        onClick={handleCustomizeClick}
        aria-label="Personalizar"
      >
        <div className={styles.menuBtnIcon}>🎨</div>
        <span>Personalizar</span>
      </button>

      <div className={styles.menuButtons}>
        {/* Botones existentes - no cambiar */}

        {/* Modal de Tienda */}
        {showStoreModal && (
          <div className={styles.modalOverlay} onClick={closeModals}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>Tienda</h2>
              <div className={styles.itemGrid}>
                <div className={styles.itemCard}>🦷 Cepillo Especial</div>
                <div className={styles.itemCard}>✨ Pasta Brillante</div>
                <div className={styles.itemCard}>🎵 Canción Dental</div>
                <div className={styles.itemCard}>🏆 Trofeo Oro</div>
              </div>
              <button className={styles.closeBtn} onClick={closeModals}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Personalizar */}
        {showCustomizeModal && (
          <div className={styles.modalOverlay} onClick={closeModals}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>Personalizar</h2>
              <div className={styles.itemGrid}>
                <div className={styles.itemCard}>🎨 Colores</div>
                <div className={styles.itemCard}>👕 Ropa</div>
                <div className={styles.itemCard}>🎩 Sombreros</div>
                <div className={styles.itemCard}>👓 Gafas</div>
              </div>
              <button className={styles.closeBtn} onClick={closeModals}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
