"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useGeolocation } from "../hooks/use-geolocation"
import { checkDangerZone, getDangerMessage, type DangerZone } from "../utils/danger-zones"
import WarningModal from "./warning-modal"
import { MapPin, Shield, AlertTriangle } from "lucide-react"
import SafeAreaNotification from "./safe-area-notification"

export default function LocationMonitor() {
  const { latitude, longitude, error, loading, permission, requestLocation } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000, // 1 minute
  })

  const [showWarning, setShowWarning] = useState(false)
  const [currentDangerZone, setCurrentDangerZone] = useState<DangerZone | null>(null)
  const [lastWarningTime, setLastWarningTime] = useState<number>(0)
  const [locationStatus, setLocationStatus] = useState<"safe" | "danger" | "unknown">("unknown")
  const [showSafeNotification, setShowSafeNotification] = useState(false)
  const [lastSafeNotificationTime, setLastSafeNotificationTime] = useState<number>(0)

  // Use refs to track previous values and prevent unnecessary updates
  const lastCheckedLocation = useRef<{ lat: number; lng: number } | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fungsi untuk mengecek lokasi dan menampilkan peringatan
  const checkLocation = useCallback(() => {
    if (!latitude || !longitude) return

    // Only check if location has changed significantly (more than 10 meters)
    if (lastCheckedLocation.current) {
      const distance = Math.sqrt(
        Math.pow((latitude - lastCheckedLocation.current.lat) * 111000, 2) +
          Math.pow((longitude - lastCheckedLocation.current.lng) * 111000, 2),
      )
      if (distance < 10) return // Skip if moved less than 10 meters
    }

    lastCheckedLocation.current = { lat: latitude, lng: longitude }

    const dangerZone = checkDangerZone(latitude, longitude)

    if (dangerZone) {
      setCurrentDangerZone(dangerZone)
      setLocationStatus("danger")

      // Tampilkan peringatan hanya jika belum ditampilkan dalam 10 menit terakhir
      const now = Date.now()
      if (now - lastWarningTime > 10 * 60 * 1000) {
        // 10 menit
        setShowWarning(true)
        setLastWarningTime(now)
      }
    } else {
      setCurrentDangerZone(null)
      setLocationStatus("safe")

      // Show safe notification if not shown in the last 30 minutes
      const now = Date.now()
      if (now - lastSafeNotificationTime > 30 * 60 * 1000) {
        setShowSafeNotification(true)
        setLastSafeNotificationTime(now)
      }
    }
  }, [latitude, longitude, lastWarningTime, lastSafeNotificationTime])

  // Monitor lokasi setiap 30 detik
  useEffect(() => {
    if (latitude && longitude) {
      checkLocation()

      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Set new interval
      intervalRef.current = setInterval(() => {
        requestLocation()
      }, 30000) // 30 detik

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [latitude, longitude, requestLocation]) // Remove checkLocation from dependencies

  // Separate effect for checking location when coordinates change
  useEffect(() => {
    if (latitude && longitude) {
      checkLocation()
    }
  }, [latitude, longitude, checkLocation])

  // Status indicator component
  const LocationStatus = () => {
    if (loading) {
      return (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 z-40">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-medium">Mendeteksi lokasi...</span>
        </div>
      )
    }

    if (error || permission === "denied") {
      return (
        <div className="fixed top-4 right-4 bg-gray-100 text-gray-800 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 z-40">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Lokasi tidak tersedia</span>
          <button onClick={requestLocation} className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline">
            Aktifkan
          </button>
        </div>
      )
    }

    if (locationStatus === "danger" && currentDangerZone) {
      return (
        <div className="fixed top-4 right-4 bg-red-100 text-red-800 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 z-40 animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Area Rawan - {currentDangerZone.name}</span>
        </div>
      )
    }

    if (locationStatus === "safe") {
      return (
        <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 z-40">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Area Aman</span>
        </div>
      )
    }

    return null
  }

  return (
    <>
      <LocationStatus />

      {currentDangerZone && (
        <WarningModal
          isOpen={showWarning}
          onClose={() => setShowWarning(false)}
          title="Peringatan Area Rawan!"
          message={getDangerMessage(currentDangerZone)}
          zone={currentDangerZone}
        />
      )}
      {/* Safe Area Notification */}
      <SafeAreaNotification isOpen={showSafeNotification} onClose={() => setShowSafeNotification(false)} />
    </>
  )
}
