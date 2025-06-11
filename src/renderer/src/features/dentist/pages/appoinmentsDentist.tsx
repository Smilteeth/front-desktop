import React, { useState, useEffect } from 'react'
import styles from '../styles/appointmentsDentist.module.css'
import NavBar from '../components/navBar'
import Calendar from '@renderer/components/calendar'
import AppointmentCard from '@renderer/components/appointmentCard'
import CancelAppointmentModal from '@renderer/features/parent/components/cancelAppointment'
import RescheduleAppointmentModal from '@renderer/features/parent/components/rescheduleAppointment'
import RescheduleSuccess from '@renderer/features/parent/components/rescheduleSuccess'
import CancelSuccess from '@renderer/features/parent/components/cancelSuccess'
import {
  getAppointmentsService,
  cancelAppointmentService,
  rescheduleAppointmentService
} from '@renderer/features/parent/services/appointmentService'
import { AppointmentResponse } from '@renderer/features/parent/services/appointmentService'

interface CancelModalData {
  appointmentId: string
}

interface RescheduleModalData {
  appointment: AppointmentResponse
}

const AppointmentDentist: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [allAppointments, setAllAppointments] = useState<AppointmentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para modales de cancelación
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelModalData, setCancelModalData] = useState<CancelModalData | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelSuccess, setShowCancelSuccess] = useState(false)

  // Estados para modales de reagendamiento
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [rescheduleModalData, setRescheduleModalData] = useState<RescheduleModalData | null>(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [showRescheduleSuccess, setShowRescheduleSuccess] = useState(false)
  const [rescheduleNewDateTime, setRescheduleNewDateTime] = useState<string>('')

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const appointments = await getAppointmentsService()
      setAllAppointments(appointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setError('Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  const getAppointmentsForDate = (date: Date): AppointmentResponse[] => {
    return allAppointments.filter((appointment) => {
      if (!appointment.isActive) return false

      const appointmentDate = new Date(appointment.appointmentDatetime)
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const appointments = getAppointmentsForDate(selectedDate)

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long'
    }).format(date)
  }

  const isAppointmentInPast = (appointmentDateTime: string): boolean => {
    const appointmentDate = new Date(appointmentDateTime)
    const now = new Date()
    return appointmentDate <= now
  }

  // Manejo de reagendamiento
  const handleReschedule = (appointmentId: string): void => {
    const appointment = allAppointments.find((a) => a.appointmentId.toString() === appointmentId)

    if (!appointment) {
      alert('Cita no encontrada')
      return
    }

    if (isAppointmentInPast(appointment.appointmentDatetime)) {
      alert('No se pueden reagendar citas que ya han pasado')
      return
    }

    const modalData: RescheduleModalData = {
      appointment
    }

    setRescheduleModalData(modalData)
    setIsRescheduleModalOpen(true)
  }

  const handleRescheduleConfirm = async (newDateTime: string, reason: string): Promise<void> => {
    if (!rescheduleModalData) return

    try {
      setIsRescheduling(true)

      await rescheduleAppointmentService(rescheduleModalData.appointment.appointmentId, reason)

      setRescheduleNewDateTime(newDateTime)

      // Recargar las citas después del reagendamiento
      await loadAppointments()

      setIsRescheduleModalOpen(false)
      setRescheduleModalData(null)
      setShowRescheduleSuccess(true)
    } catch (error) {
      console.error('Error al reagendar cita:', error)
      alert(error instanceof Error ? error.message : 'Error al reagendar la cita')
    } finally {
      setIsRescheduling(false)
    }
  }

  const handleRescheduleModalClose = (): void => {
    if (isRescheduling) return
    setIsRescheduleModalOpen(false)
    setRescheduleModalData(null)
  }

  const handleRescheduleSuccessContinue = (): void => {
    setShowRescheduleSuccess(false)
    setRescheduleNewDateTime('')
  }

  // Manejo de cancelación
  const handleCancel = (appointmentId: string): void => {
    const appointment = allAppointments.find((a) => a.appointmentId.toString() === appointmentId)

    if (!appointment) {
      alert('Cita no encontrada')
      return
    }

    if (isAppointmentInPast(appointment.appointmentDatetime)) {
      alert('No se pueden cancelar citas que ya han pasado')
      return
    }

    const modalData: CancelModalData = {
      appointmentId
    }

    setCancelModalData(modalData)
    setIsCancelModalOpen(true)
  }

  const handleCancelConfirm = async (reason: string): Promise<void> => {
    if (!cancelModalData) return

    try {
      setIsCancelling(true)

      await cancelAppointmentService(parseInt(cancelModalData.appointmentId), reason)

      // Recargar las citas después de la cancelación
      await loadAppointments()

      setIsCancelModalOpen(false)
      setCancelModalData(null)
      setShowCancelSuccess(true)
    } catch (error) {
      console.error('Error al cancelar cita:', error)
      alert(error instanceof Error ? error.message : 'Error al cancelar la cita')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleCancelModalClose = (): void => {
    if (isCancelling) return
    setIsCancelModalOpen(false)
    setCancelModalData(null)
  }

  const handleCancelSuccessContinue = (): void => {
    setShowCancelSuccess(false)
  }

  const calculateMinutesUntil = (appointmentDateTime: string): number => {
    const appointmentTime = new Date(appointmentDateTime)
    const now = new Date()
    const diffMs = appointmentTime.getTime() - now.getTime()
    return Math.floor(diffMs / 60000)
  }

  const formatTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <p className={styles.loading}>Cargando citas...</p>
            </div>
          </div>
          <NavBar />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <p className={styles.loading}>Error</p>
              <p>{error}</p>
            </div>
          </div>
          <NavBar />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Citas agendadas</h1>
            <div className={styles.calendarContainer}>
              <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
          </div>
          <div className={styles.appointments}>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.appointmentId}
                  id={appointment.appointmentId.toString()}
                  patientName={appointment.child || 'Paciente desconocido'}
                  time={formatTime(appointment.appointmentDatetime)}
                  minutesUntil={calculateMinutesUntil(appointment.appointmentDatetime)}
                  description={appointment.reason}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div className={styles.noAppointments}>
                <p>No hay citas para el {formatDate(selectedDate)}</p>
              </div>
            )}
          </div>
        </div>
        <NavBar />
      </div>

      {/* Modal de cancelación de cita */}
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        isLoading={isCancelling}
      />

      {/* Modal de reagendamiento de cita */}
      <RescheduleAppointmentModal
        isOpen={isRescheduleModalOpen}
        onClose={handleRescheduleModalClose}
        onConfirm={handleRescheduleConfirm}
        appointment={rescheduleModalData?.appointment || null}
        existingAppointments={allAppointments}
        isLoading={isRescheduling}
      />

      {/* Modal de éxito para cancelación */}
      <CancelSuccess isOpen={showCancelSuccess} onContinue={handleCancelSuccessContinue} />

      {/* Modal de éxito para reagendamiento */}
      <RescheduleSuccess
        isOpen={showRescheduleSuccess}
        onContinue={handleRescheduleSuccessContinue}
        newDateTime={rescheduleNewDateTime}
      />
    </div>
  )
}

export default AppointmentDentist
