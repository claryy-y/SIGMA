"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SafeAreaNotificationProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

export default function SafeAreaNotification({
  isOpen,
  onClose,
  title = "Area Aman",
  message = "✔️ Anda berada di area aman. Tidak terdeteksi kasus curanmor di daerah ini dalam waktu rawan belakangan ini. Tetap waspada dan pastikan kendaraan Anda dalam keadaan terkunci.",
}: SafeAreaNotificationProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)

      // Auto close after 7 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 7000)

      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)

      return () => {
        document.removeEventListener("keydown", handleEscape)
        clearTimeout(timer)
      }
    }
  }, [isOpen, onClose])

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const notificationContent = (
    <div
      className="fixed top-4 inset-x-0 mx-auto z-50 max-w-sm animate-in slide-in-from-top-5 duration-300"
      role="alert"
      aria-live="polite"
    >
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
              <div className="mt-3 flex">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm text-green-600 bg-green-50 hover:bg-green-100 border-green-200"
                  onClick={onClose}
                >
                  Saya Mengerti
                </Button>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                ref={closeButtonRef}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={onClose}
                aria-label="Tutup notifikasi"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Progress bar for auto-close */}
        <div className="bg-green-100 h-1 w-full">
          <div className="bg-green-500 h-1 animate-[shrink_7s_linear_forwards]" style={{ transformOrigin: "left" }} />
        </div>
      </div>
    </div>
  )

  // Use portal to render notification at document body level
  return typeof document !== "undefined" ? createPortal(notificationContent, document.body) : null
}
