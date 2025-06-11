/**
 * Validate a university.
 *
 * @param university University to validate.
 * @returns An error message if the university is not valid.
 */
export function validateUniversity(university: string): string | null {
  if (university.length > 255) {
    return 'La universidad debe tener menos de 255 caracteres'
  }
  return null
}

/**
 * Validate a speciality.
 *
 * @param speciality Speciality to validate.
 * @returns An error message if the speciality is not valid.
 */
export function validateSpeciality(speciality: string): string | null {
  if (speciality.length > 255) {
    return 'La especialidad debe tener menos de 255 caracteres'
  }
  return null
}

/**
 * validate a about.
 *
 * @param about About me to validate.
 * @returns An error message if the about is not valid.
 */
export function validateAbout(about: string): string | null {
  if (about.length > 255) {
    return 'El texto debe tener menos de 255 caracteres'
  }
  return null
}

/**
 * Validate a service start time.
 *
 * @param serviceStartTime Start time to validate.
 * @returns An error message if the start time is not valid, or 'null' if it is valid.
 */
export function validateServiceStartTime(serviceStartTime: string): string | null {
  const startTimeRegex = /^\d{2}:\d{2}$/
  if (!startTimeRegex.test(serviceStartTime)) {
    return 'La hora de inicio no tiene un formato válido (HH:MM)'
  }
  return null
}

/**
 * Validate a service end time.
 *
 * @param serviceEndTime End time to validate.
 * @returns An error message if the end time is not valid, or 'null' if it is valid.
 */
export function validateServiceEndTime(serviceEndTime: string): string | null {
  const endTimeRegex = /^\d{2}:\d{2}$/
  if (!endTimeRegex.test(serviceEndTime)) {
    return 'La hora de fin no tiene un formato válido (HH:MM)'
  }
  return null
}

/**
 * Validate a phone number.
 *
 * @param phoneNumber Phone number to validate.
 * @returns An error message if the phone number is not valid, or 'null' if it is valid.
 */
export function validatePhoneNumber(phoneNumber: string): string | null {
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(phoneNumber)) {
    return 'El teléfono debe tener exactamente 10 dígitos'
  }
  return null
}
