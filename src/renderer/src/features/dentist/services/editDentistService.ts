import { EditDentistCredentials, EditDentistResponse } from '../types/dentistTypes'

const API_EDIT_DENTIST = 'https://smiltheet-api.rafabeltrans17.workers.dev/api/dentist/edit'

export const editDentistService = async (
  credentials: EditDentistCredentials
): Promise<EditDentistResponse> => {
  const authToken = localStorage.getItem('authToken')

  try {
    const response = await fetch(API_EDIT_DENTIST, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data: EditDentistResponse = await response.json()
    return data
  } catch (error) {
    console.error('Failed to edit dentist:', error)
    throw error
  }
}
