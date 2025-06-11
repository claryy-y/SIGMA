"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
  permission: PermissionState | null
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
    permission: null,
  })

  // Use ref to store options to prevent unnecessary re-renders
  const optionsRef = useRef(options)
  optionsRef.current = options

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      loading: false,
      permission: "granted",
    })
  }, [])

  const updateError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = "Gagal mendapatkan lokasi"

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Akses lokasi ditolak oleh pengguna"
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Informasi lokasi tidak tersedia"
        break
      case error.TIMEOUT:
        errorMessage = "Permintaan lokasi timeout"
        break
    }

    setState((prev) => ({
      ...prev,
      error: errorMessage,
      loading: false,
      permission: "denied",
    }))
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation tidak didukung oleh browser ini",
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...optionsRef.current,
    }

    navigator.geolocation.getCurrentPosition(updatePosition, updateError, defaultOptions)
  }, [updatePosition, updateError])

  // Only run once on mount
  useEffect(() => {
    requestLocation()
  }, []) // Remove requestLocation from dependencies

  return {
    ...state,
    requestLocation,
  }
}
