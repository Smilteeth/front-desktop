export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'TuAppDentista/1.0'
        }
      }
    )

    if (!response.ok) throw new Error('Fallo al obtener la dirección')

    const data = await response.json()
    return data.display_name || null
  } catch (error) {
    console.error('Error en reverseGeocode:', error)
    return null
  }
}
