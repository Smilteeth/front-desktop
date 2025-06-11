import React from 'react'
import styles from '../styles/appointmentCard.module.css'

interface AppointmentCardProps {
  id: string
  patientName: string
  time: string
  minutesUntil: number
  description: string
  doctorName?: string
  onReschedule: (id: string) => void
  onCancel: (id: string) => void
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  patientName,
  time,
  minutesUntil,
  description,
  doctorName,
  onReschedule,
  onCancel
}) => {
  const renderTimeRemaining = (): string | null => {
    if (minutesUntil < 0) {
      return null
    }

    if (minutesUntil < 1440) {
      const hoursUntil = Math.ceil(minutesUntil / 60)

      if (minutesUntil === 0) {
        return 'Ahora'
      } else if (hoursUntil === 1) {
        return 'en 1 hora'
      } else {
        return `en ${hoursUntil} horas`
      }
    } else {
      const daysUntil = Math.ceil(minutesUntil / 1440)

      if (daysUntil === 1) {
        return 'en 1 día'
      } else {
        return `en ${daysUntil} días`
      }
    }
  }

  const timeRemainingElement = renderTimeRemaining()

  return (
    <div className={styles.appointmentCard}>
      <div className={styles.timeBlock}>
        <div className={styles.appointmentTime}>{time}</div>
        {timeRemainingElement && <div className={styles.timeRemaining}>{timeRemainingElement}</div>}
      </div>
      <div className={styles.appointmentDetails}>
        <div className={styles.appointmentActions}>
          {timeRemainingElement == null ? (
            <div className={styles.pastAppointment}>Cita pasada</div>
          ) : (
            <div className={styles.actionButtons}>
              <button className={styles.rescheduleButton} onClick={() => onReschedule(id)}>
                Reagendar cita
              </button>
              <button className={styles.cancelButton} onClick={() => onCancel(id)}>
                Cancelar cita
              </button>
            </div>
          )}
        </div>
        <h3 className={styles.patientName}>{patientName}</h3>
        <p className={styles.appointmentDescription}>{description}</p>
        <p className={styles.doctorName}>{doctorName}</p>
      </div>
    </div>
  )
}

export default AppointmentCard
