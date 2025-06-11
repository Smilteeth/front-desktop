import React from 'react'
import Modal from '@renderer/features/parent/components/modal'
import styles from '../styles/editDentistSucces.module.css'

interface EditSuccessProps {
  isOpen: boolean
  onContinue: () => void
}

const EditDentistSucces: React.FC<EditSuccessProps> = ({ isOpen, onContinue }) => {
  return (
    <Modal isOpen={isOpen} onClose={onContinue} title="">
      <div className={styles.successContainer}>
        <h2 className={styles.successTitle}>Datos actualizados correctamente</h2>
        <button className={styles.continueButton} onClick={onContinue}>
          Continuar
        </button>
      </div>
    </Modal>
  )
}

export default EditDentistSucces
