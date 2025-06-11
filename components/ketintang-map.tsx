"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { MapPin, Zap, Shield, AlertTriangle } from "lucide-react"
import {
  ketintangAreas,
  getCurrentRiskLevel,
  getRiskColor,
  getRiskOpacity,
  type KetintangArea,
} from "../utils/ketintang-areas"
import { useGeolocation } from "../hooks/use-geolocation"

// Simple map component using HTML5 Canvas
export default function KetintangMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedArea, setSelectedArea] = useState<KetintangArea | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { latitude, longitude, loading: locationLoading } = useGeolocation()

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = (lat: number, lng: number, canvasWidth: number, canvasHeight: number) => {
    // Bounds for Ketintang area
    const bounds = {
      north: -7.305,
      south: -7.32,
      east: 112.735,
      west: 112.72,
    }

    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * canvasWidth
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * canvasHeight

    return { x, y }
  }

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    const canvasWidth = rect.width
    const canvasHeight = rect.height

    // Clear canvas
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw grid
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvasWidth
      const y = (i / 10) * canvasHeight

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }

    // Draw areas
    ketintangAreas.forEach((area) => {
      const currentRisk = getCurrentRiskLevel(area)
      const color = getRiskColor(currentRisk)
      const opacity = getRiskOpacity(currentRisk)

      const { x, y } = latLngToCanvas(area.coordinates.lat, area.coordinates.lng, canvasWidth, canvasHeight)

      // Draw area circle
      ctx.fillStyle =
        color +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0")
      ctx.beginPath()
      ctx.arc(x, y, 30, 0, 2 * Math.PI)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw area name
      ctx.fillStyle = "#ffffff"; // Warna teks putih
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // Teks di tengah vertikal
      ctx.shadowColor = "rgba(0,0,0,0.5)"; // Tambahkan bayangan agar kontras
      ctx.shadowBlur = 4;
      ctx.fillText(area.name, x, y);
      ctx.shadowBlur = 0; // Reset bayangan setelahnya

    })

    // Draw user location if available
    if (latitude && longitude) {
      const { x, y } = latLngToCanvas(latitude, longitude, canvasWidth, canvasHeight)

      // Draw user marker
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fill()

      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw pulse effect
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI)
      ctx.stroke()
    }
  }, [currentTime, latitude, longitude])

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is on any area
    ketintangAreas.forEach((area) => {
      const { x: areaX, y: areaY } = latLngToCanvas(area.coordinates.lat, area.coordinates.lng, rect.width, rect.height)
      const distance = Math.sqrt((x - areaX) ** 2 + (y - areaY) ** 2)

      if (distance <= 30) {
        setSelectedArea(area)
      }
    })
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Peta Area Ketintang</h3>
          </div>
          <div className="text-sm opacity-90">
            {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64 sm:h-80 md:h-96 cursor-pointer"
          onClick={handleCanvasClick}
          style={{ width: "100%", height: "320px" }}
        />

        {locationLoading && (
          <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">Mencari lokasi...</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Keterangan:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Risiko Tinggi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
            <span>Risiko Sedang</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span>Risiko Rendah</span>
          </div>
        </div>
        {latitude && longitude && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Lokasi Anda</span>
          </div>
        )}
      </div>

      {/* Area Details Modal */}
      {selectedArea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setSelectedArea(null)}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedArea.name}</h3>
                <button onClick={() => setSelectedArea(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                {getCurrentRiskLevel(selectedArea) === "high" && <AlertTriangle className="w-6 h-6 text-red-500" />}
                {getCurrentRiskLevel(selectedArea) === "medium" && <Zap className="w-6 h-6 text-amber-500" />}
                {getCurrentRiskLevel(selectedArea) === "low" && <Shield className="w-6 h-6 text-emerald-500" />}
                <div>
                  <div className="font-medium">
                    Tingkat Risiko:{" "}
                    {getCurrentRiskLevel(selectedArea) === "high"
                      ? "Tinggi"
                      : getCurrentRiskLevel(selectedArea) === "medium"
                        ? "Sedang"
                        : "Rendah"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Saat ini: {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Deskripsi:</div>
                <div className="text-sm text-gray-600">{selectedArea.description}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Jumlah Kejadian:</div>
                <div className="text-sm text-gray-600">{selectedArea.incidents} kasus tercatat</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Jam Rawan:</div>
                <div className="text-sm text-gray-600">
                  {selectedArea.dangerousHours.length > 0
                    ? `${selectedArea.dangerousHours.map((h) => h.toString().padStart(2, "0")).join(", ")}:00`
                    : "Tidak ada jam khusus"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
