"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import WarningModal from "./warning-modal"

export default function DemoWarningButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" />
        Tampilkan Peringatan
      </Button>

      <WarningModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
