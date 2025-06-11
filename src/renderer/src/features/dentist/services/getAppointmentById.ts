import { AppointmentResponse } from '../types/dentistTypes'

const API_URL = 'https://smiltheet-api.rafabeltrans17.workers.dev/api/appointment/'

export async function getAppointmentById(appointmentId: number): Promise<AppointmentResponse> {
  const response = await fetch(`${API_URL}${appointmentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!response.ok) {
    throw new Error(`Error fetching appointment: ${response.statusText}`)
  }

  const data: AppointmentResponse = await response.json()
  return data
}
