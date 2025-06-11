import React, { useState, useEffect, FormEvent, useCallback } from 'react'
import {
  validateUniversity,
  validateSpeciality,
  validateAbout,
  validateServiceEndTime,
  validateServiceStartTime,
  validatePhoneNumber
} from '../utils/validators'
import { editDentistService } from '../services/editDentistService'
import { EditDentistCredentials, DentistResponse } from '../types/dentistTypes'
import { reverseGeocode } from '../utils/reverseGeocode'
import InputForm from '@renderer/components/inputForm'
import TextareaInput from '@renderer/components/textareaInput'
import styles from '../styles/editDentistModal.module.css'
import Modal from '@renderer/features/parent/components/modal'
import MapSelector from '@renderer/components/mapSelector'
import Button from '@renderer/components/button'
import EditDentistSucces from './editDentistSucces'

interface EditDentistModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: (updatedData: Partial<DentistResponse>) => Promise<void>
  onSuccess?: () => void
  isLoading?: boolean
  dentistData?: DentistResponse | null
}

const EditDentistModal: React.FC<EditDentistModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSuccess,
  isLoading = false,
  dentistData
}) => {
  const [university, setUniversity] = useState<string>('')
  const [speciality, setSpeciality] = useState<string>('')
  const [about, setAbout] = useState<string>('')
  const [serviceStartTime, setServiceStartTime] = useState<string>('')
  const [serviceEndTime, setServiceEndTime] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    university?: string
    speciality?: string
    about?: string
    serviceStartTime?: string
    serviceEndTime?: string
    phoneNumber?: string
    latitude?: string
    longitude?: string
  }>({})

  useEffect(() => {
    if (isOpen && !showSuccess) {
      if (dentistData) {
        setUniversity('')
        setSpeciality('')
        setAbout('')
        setServiceStartTime('')
        setServiceEndTime('')
        setPhoneNumber('')
        setLatitude('')
        setLongitude('')
        setError(null)
        setErrors({})
      } else {
        setUniversity('')
        setSpeciality('')
        setAbout('')
        setServiceStartTime('')
        setServiceEndTime('')
        setPhoneNumber('')
        setLatitude('')
        setLongitude('')
        setError(null)
        setErrors({})
      }
    }
  }, [isOpen, showSuccess, dentistData])

  useEffect(() => {
    if (!isOpen) {
      setUniversity('')
      setSpeciality('')
      setAbout('')
      setServiceStartTime('')
      setServiceEndTime('')
      setPhoneNumber('')
      setLatitude('')
      setLongitude('')
      setAddress(null)
      setError(null)
      setErrors({})
      setShowSuccess(false)
    }
  }, [isOpen])

  const resetForm = (): void => {
    setUniversity('')
    setSpeciality('')
    setAbout('')
    setServiceStartTime('')
    setServiceEndTime('')
    setPhoneNumber('')
    setLatitude('')
    setLongitude('')
    setAddress(null)
    setError(null)
    setErrors({})
  }

  const handleLocationChange = useCallback(async (lat: number, lng: number) => {
    setLatitude(lat.toString())
    setLongitude(lng.toString())

    const resolvedAddress = await reverseGeocode(lat, lng)
    setAddress(resolvedAddress)
  }, [])

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (university.trim()) {
      const universityError = validateUniversity(university)
      if (universityError) newErrors.university = universityError
    }

    if (speciality.trim()) {
      const specialityError = validateSpeciality(speciality)
      if (specialityError) newErrors.speciality = specialityError
    }

    if (about.trim()) {
      const aboutError = validateAbout(about)
      if (aboutError) newErrors.about = aboutError
    }

    if (serviceStartTime) {
      const serviceStartTimeError = validateServiceStartTime(serviceStartTime)
      if (serviceStartTimeError) newErrors.serviceStartTime = serviceStartTimeError
    }

    if (serviceEndTime) {
      const serviceEndTimeError = validateServiceEndTime(serviceEndTime)
      if (serviceEndTimeError) newErrors.serviceEndTime = serviceEndTimeError
    }

    if (phoneNumber.trim()) {
      const phoneNumberError = validatePhoneNumber(phoneNumber)
      if (phoneNumberError) newErrors.phoneNumber = phoneNumberError
    }

    if (latitude.trim()) {
      const lat = parseFloat(latitude)
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'La latitud debe estar entre -90 y 90'
      }
    }

    if (longitude.trim()) {
      const lng = parseFloat(longitude)
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'La longitud debe estar entre -180 y 180'
      }
    }

    if ((latitude.trim() && !longitude.trim()) || (!latitude.trim() && longitude.trim())) {
      newErrors.latitude = 'Debe proporcionar tanto latitud como longitud'
      newErrors.longitude = 'Debe proporcionar tanto latitud como longitud'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      setError('Por favor corrija los errores en el formulario')
      return
    }

    const updatedData: Partial<DentistResponse> = {}

    if (university.trim()) {
      updatedData.university = university.trim()
    }

    if (speciality.trim()) {
      updatedData.speciality = speciality.trim()
    }

    if (about.trim()) {
      updatedData.about = about.trim()
    }

    if (serviceStartTime) {
      updatedData.serviceStartTime = serviceStartTime
    }

    if (serviceEndTime) {
      updatedData.serviceEndTime = serviceEndTime
    }

    if (phoneNumber.trim()) {
      updatedData.phoneNumber = phoneNumber.trim()
    }

    if (latitude.trim()) {
      updatedData.latitude = parseFloat(latitude)
    }

    if (longitude.trim()) {
      updatedData.longitude = parseFloat(longitude)
    }

    if (Object.keys(updatedData).length === 0) {
      setError('Debe modificar al menos un campo')
      return
    }

    try {
      setIsUpdating(true)
      setError(null)

      if (onConfirm) {
        await onConfirm(updatedData)
      } else {
        const credentials: Partial<EditDentistCredentials> = {}

        if (updatedData.university) credentials.university = updatedData.university
        if (updatedData.speciality) credentials.speciality = updatedData.speciality
        if (updatedData.about) credentials.about = updatedData.about
        if (updatedData.serviceStartTime)
          credentials.serviceStartTime = updatedData.serviceStartTime
        if (updatedData.serviceEndTime) credentials.serviceEndTime = updatedData.serviceEndTime
        if (updatedData.phoneNumber) credentials.phoneNumber = updatedData.phoneNumber
        if (updatedData.latitude !== undefined) credentials.latitude = updatedData.latitude
        if (updatedData.longitude !== undefined) credentials.longitude = updatedData.longitude

        await editDentistService(credentials as EditDentistCredentials)
      }

      setShowSuccess(true)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          setError('Datos inválidos. Verifica que todos los campos estén correctos.')
        } else if (error.message.includes('409')) {
          setError('Conflicto: Los datos ingresados ya están en uso por otro dentista.')
        } else {
          setError(error.message)
        }
      } else {
        setError('Error al actualizar información del dentista')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSuccessContinue = (): void => {
    setShowSuccess(false)

    resetForm()

    if (onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 100)
    } else {
      onClose()
    }
  }

  const handleClose = (): void => {
    if (isLoading || isUpdating) return
    resetForm()
    onClose()
  }

  const mapLatitude = latitude ? parseFloat(latitude) : 18.143036
  const mapLongitude = longitude ? parseFloat(longitude) : -94.476026

  if (showSuccess) {
    return <EditDentistSucces isOpen={true} onContinue={handleSuccessContinue} />
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar perfil">
      <div className={styles.modalContent}>
        {(isLoading || isUpdating) && (
          <div className={styles.loadingIndicator}>
            <p>{isUpdating ? 'Actualizando información...' : 'Cargando...'}</p>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.warningMessage}>
            <p>
              🔔 Modifica solo los campos que deseas actualizar. Los campos vacíos mantendrán su
              valor actual.
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <InputForm
              label="Universidad"
              name="university"
              type="text"
              value={university}
              placeholder="Ingresa tu universidad"
              onChange={(e) => setUniversity(e.target.value)}
            />
            {errors.university && <div className={styles.errorMessage}>{errors.university}</div>}
          </div>

          <div className={styles.formGroup}>
            <InputForm
              label="Especialidad"
              name="speciality"
              type="text"
              value={speciality}
              placeholder="Ingresa tu especialidad"
              onChange={(e) => setSpeciality(e.target.value)}
            />
            {errors.speciality && <div className={styles.errorMessage}>{errors.speciality}</div>}
          </div>

          <div className={styles.formGroup}>
            <TextareaInput
              label="Sobre mí"
              name="about"
              value={about}
              placeholder="Describe tu experiencia y servicios"
              onChange={(e) => setAbout(e.target.value)}
            />
            {errors.about && <div className={styles.errorMessage}>{errors.about}</div>}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.timeGroup}>
              <div>
                <InputForm
                  label="Inicio de atención"
                  name="serviceStartTime"
                  type="time"
                  value={serviceStartTime}
                  placeholder="Hora de inicio"
                  onChange={(e) => setServiceStartTime(e.target.value)}
                />
                {errors.serviceStartTime && (
                  <div className={styles.errorMessage}>{errors.serviceStartTime}</div>
                )}
              </div>
              <div>
                <InputForm
                  label="Fin de atención"
                  name="serviceEndTime"
                  type="time"
                  value={serviceEndTime}
                  placeholder="Hora de fin"
                  onChange={(e) => setServiceEndTime(e.target.value)}
                />
                {errors.serviceEndTime && (
                  <div className={styles.errorMessage}>{errors.serviceEndTime}</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <InputForm
              label="Número de teléfono"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              placeholder="Ingresa tu número de teléfono"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errors.phoneNumber && <div className={styles.errorMessage}>{errors.phoneNumber}</div>}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.addressGroup}>
              <p>Ubicacion seleccionada: </p>
              <p>{address || 'No se ha seleccionado una ubicación'}</p>
            </div>
            <MapSelector
              latitude={mapLatitude}
              longitude={mapLongitude}
              onLocationChange={handleLocationChange}
            />
            {errors.latitude && <div className={styles.errorMessage}>{errors.latitude}</div>}
            {errors.longitude && <div className={styles.errorMessage}>{errors.longitude}</div>}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isLoading || isUpdating}
            >
              Cancelar
            </button>
            <Button
              name={isUpdating ? 'Actualizando...' : 'Guardar cambios'}
              type={'submit'}
              disabled={isLoading || isUpdating}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditDentistModal
