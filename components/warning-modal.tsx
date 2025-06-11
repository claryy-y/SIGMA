"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DangerZone {
  name: string
  riskLevel: string
}

interface WarningModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  zone?: DangerZone
}

export default function WarningModal({
  isOpen,
  onClose,
  title = "Peringatan!",
  message = "⚠️ Anda berada di daerah rawan curanmor. Harap waspada dan pastikan kendaraan Anda dalam kondisi terkunci!",
  zone,
}: WarningModalProps) {
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
      document.body.style.overflow = "hidden"

      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // Trap focus within modal
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in zoom-in-95"
        onKeyDown={handleKeyDown}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="p-6 pt-8">
          {/* Warning icon */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h2 id="modal-title" className="text-2xl font-bold text-center text-red-600 mb-4">
            {title}
          </h2>

          {/* Message */}
          <p id="modal-description" className="text-gray-700 text-center leading-relaxed mb-4 px-2">
            {zone ? (
              <>
                ⚠️ Anda berada di daerah rawan curanmor area <strong>{zone.name}</strong> pada jam rawan{" "}
                <strong>
                  {new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                  })}{" "}
                  WIB
                </strong>
                . Harap waspada dan pastikan kendaraan Anda dalam kondisi terkunci!
              </>
            ) : (
              message
            )}
          </p>

          {/* Zone info if available */}
          {zone && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-sm text-red-800">
                <div className="font-medium">Lokasi: {zone.name}</div>
                <div>
                  Tingkat Risiko: <span className="uppercase font-bold">{zone.riskLevel}</span>
                </div>
                <div>
                  Waktu:{" "}
                  {new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                  })}{" "}
                  WIB
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Saya Mengerti
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-red-300 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Tutup
            </Button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-b-2xl"></div>
      </div>
    </div>
  )

  // Use portal to render modal at document body level
  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null
}
