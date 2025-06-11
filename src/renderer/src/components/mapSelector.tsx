import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapSelectorProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
}

const MapSelector: React.FC<MapSelectorProps> = ({ latitude, longitude, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current).setView([latitude, longitude], 15)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    const marker = L.marker([latitude, longitude], { draggable: true }).addTo(map)
    markerRef.current = marker

    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      onLocationChange(lat, lng)
    })

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      onLocationChange(lat, lng)
    })

    return () => {
      map.remove()
    }
  }, [latitude, longitude, onLocationChange])

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude])
      mapInstanceRef.current?.setView([latitude, longitude])
    }
  }, [latitude, longitude])

  return <div ref={mapRef} style={{ height: '300px', width: '100%', borderRadius: '30px' }} />
}

export default MapSelector
