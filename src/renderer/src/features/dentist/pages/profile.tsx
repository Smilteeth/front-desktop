import React, { useState, useEffect } from 'react'
import styles from '../styles/profile.module.css'
import Phone from '@renderer/assets/icons/phone.svg'
import Mail from '@renderer/assets/icons/mail.svg'
import NavBar from '../components/navBar'
import { getAppointmentsService } from '@renderer/features/parent/services/appointmentService'
import { getDentistByIdService } from '@renderer/features/parent/services/dentistService'
import { AppointmentResponse, DentistResponse, EditDentistCredentials } from '../types/dentistTypes'
import EditDentistModal from '../components/editDentistModal'
import { editDentistService } from '../services/editDentistService'

const Profile: React.FC = () => {
  const [, setAppointmentsData] = useState<AppointmentResponse[]>([])
  const [dentist, setDentist] = useState<DentistResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const appointments = await getAppointmentsService()
        setAppointmentsData(appointments)
        if (appointments.length > 0 && appointments[0].dentistId) {
          localStorage.setItem('dentistId', appointments[0].dentistId.toString())

          const dentistData = await getDentistByIdService(appointments[0].dentistId)
          const dentistMapped: DentistResponse = {
            userId: dentistData.userId,
            name: dentistData.name,
            lastName: dentistData.lastName,
            university: dentistData.university,
            speciality: dentistData.speciality,
            professionalLicense: dentistData.professionalLicense,
            serviceStartTime: dentistData.serviceStartTime,
            serviceEndTime: dentistData.serviceEndTime,
            phoneNumber: dentistData.phoneNumber,
            email: dentistData.email,
            about: dentistData.about,
            latitude: dentistData.latitude,
            longitude: dentistData.longitude
          }
          setDentist(dentistMapped)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEditProfile = (): void => {
    console.log('Editar perfil')
    setIsEditModalOpen(true)
  }

  const handleEditModalClose = (): void => {
    if (isUpdating) return
    setIsEditModalOpen(false)
  }

  const handleEditConfirm = async (updatedData: Partial<DentistResponse>): Promise<void> => {
    if (!dentist) return

    try {
      setIsUpdating(true)

      // Crear el objeto credentials solo con los campos que tienen valores válidos
      const credentials: Partial<EditDentistCredentials> = {}

      // Solo agregar campos que tienen valores válidos (no null, undefined o string vacío)
      if (
        updatedData.university !== undefined &&
        updatedData.university !== null &&
        updatedData.university.trim() !== ''
      ) {
        credentials.university = updatedData.university.trim()
      }

      if (
        updatedData.speciality !== undefined &&
        updatedData.speciality !== null &&
        updatedData.speciality.trim() !== ''
      ) {
        credentials.speciality = updatedData.speciality.trim()
      }

      if (
        updatedData.about !== undefined &&
        updatedData.about !== null &&
        updatedData.about.trim() !== ''
      ) {
        credentials.about = updatedData.about.trim()
      }

      if (
        updatedData.serviceStartTime !== undefined &&
        updatedData.serviceStartTime !== null &&
        updatedData.serviceStartTime !== ''
      ) {
        credentials.serviceStartTime = updatedData.serviceStartTime
      }

      if (
        updatedData.serviceEndTime !== undefined &&
        updatedData.serviceEndTime !== null &&
        updatedData.serviceEndTime !== ''
      ) {
        credentials.serviceEndTime = updatedData.serviceEndTime
      }

      if (
        updatedData.phoneNumber !== undefined &&
        updatedData.phoneNumber !== null &&
        updatedData.phoneNumber.trim() !== ''
      ) {
        credentials.phoneNumber = updatedData.phoneNumber.trim()
      }

      if (updatedData.latitude !== undefined && updatedData.latitude !== null) {
        credentials.latitude = updatedData.latitude
      }

      if (updatedData.longitude !== undefined && updatedData.longitude !== null) {
        credentials.longitude = updatedData.longitude
      }

      // Verificar que hay al menos un campo para actualizar
      if (Object.keys(credentials).length === 0) {
        console.log('No hay cambios válidos para enviar')
        return
      }

      console.log('Enviando credenciales:', credentials)
      await editDentistService(credentials as EditDentistCredentials)

      // Actualizar el estado local con los datos que se enviaron exitosamente
      const updatedDentist = { ...dentist }

      if (credentials.university) updatedDentist.university = credentials.university
      if (credentials.speciality) updatedDentist.speciality = credentials.speciality
      if (credentials.about) updatedDentist.about = credentials.about
      if (credentials.serviceStartTime)
        updatedDentist.serviceStartTime = credentials.serviceStartTime
      if (credentials.serviceEndTime) updatedDentist.serviceEndTime = credentials.serviceEndTime
      if (credentials.phoneNumber) updatedDentist.phoneNumber = credentials.phoneNumber
      if (credentials.latitude) updatedDentist.latitude = credentials.latitude
      if (credentials.longitude) updatedDentist.longitude = credentials.longitude

      setDentist(updatedDentist)
      console.log('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error al actualizar perfil:', error)

      let errorMessage = 'Error al actualizar el perfil'

      if (error instanceof Error) {
        if (error.message.includes('400')) {
          errorMessage = 'Los datos enviados no son válidos. Verifica la información.'
        } else if (error.message.includes('409')) {
          errorMessage = 'Los datos ingresados ya están en uso por otro dentista.'
        } else {
          errorMessage = error.message
        }
      }

      alert(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatPhoneNumber = (phone: string): string => {
    if (phone && phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    }
    return phone
  }

  const getMapUrl = (lat: number, lon: number): string => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`
  }

  const getMapLinkUrl = (lat: number, lon: number): string => {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`
  }

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <p className={styles.loading}>Cargando perfil...</p>
          </div>
          <NavBar />
        </div>
      </div>
    )
  }

  if (error || !dentist) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <p className={styles.loading}>{error || 'Error al cargar el perfil'}</p>
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
          <h1>Tu perfil</h1>
          <div className={styles.profileSection}>
            <div className={styles.profileImage}></div>

            <div className={styles.profileInfo}>
              <h2 className={styles.name}>
                {dentist.name} {dentist.lastName}
              </h2>
              {dentist.university && <p className={styles.university}>{dentist.university}</p>}
              {dentist.speciality && <p className={styles.speciality}>{dentist.speciality}</p>}

              <p className={styles.license}>Cédula profesional: {dentist.professionalLicense}</p>

              <p className={styles.schedule}>
                Horario de atención: {dentist.serviceStartTime} a {dentist.serviceEndTime}
              </p>
            </div>

            <div className={styles.actionSection}>
              <button className={styles.scheduleButton} onClick={handleEditProfile}>
                Editar perfil
              </button>

              <div className={styles.contactSection}>
                <h3 className={styles.contactTitle}>Contacto</h3>
                <div className={styles.contactItem}>
                  <img src={Phone} alt="Teléfono" className={styles.contactIcon} />
                  <span>{formatPhoneNumber(dentist.phoneNumber)}</span>
                </div>
                <div className={styles.contactItem}>
                  <img src={Mail} alt="Correo" className={styles.contactIcon} />
                  <span>{dentist.email}</span>
                </div>
              </div>
            </div>
          </div>

          {dentist.about && (
            <div className={styles.aboutSection}>
              <h2 className={styles.sectionTitle}>Acerca de ti</h2>
              <p className={styles.aboutText}>{dentist.about}</p>
            </div>
          )}

          {dentist.latitude && dentist.longitude && (
            <div className={styles.locationSection}>
              <h2 className={styles.locationTitle}>Me encuentras en</h2>
              <div className={styles.mapContainer}>
                <iframe
                  width="100%"
                  height="100%"
                  src={getMapUrl(dentist.latitude, dentist.longitude)}
                  title="Ubicación del consultorio"
                ></iframe>
              </div>
              <div className={styles.addressInfo}>
                <a
                  href={getMapLinkUrl(dentist.latitude, dentist.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewMapLink}
                >
                  Ver mapa completo
                </a>
              </div>
            </div>
          )}
        </div>
        <NavBar />
      </div>

      {/* Modal de edición de perfil */}
      <EditDentistModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onConfirm={handleEditConfirm}
        isLoading={isUpdating}
        dentistData={dentist}
      />
    </div>
  )
}

export default Profile
