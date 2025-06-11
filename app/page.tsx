import MotorcycleTheftTable from "../motorcycle-theft-table"
import LocationMonitor from "../components/location-monitor"
import KetintangMap from "../components/ketintang-map"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LocationMonitor />

      {/* Header Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sistem Monitoring Curanmor</h1>
          <p className="text-sm sm:text-base text-gray-600">Tracking dan Monitoring Pencurian Motor Area Ketintang</p>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <KetintangMap />
        </div>

        {/* Table Section */}
        <MotorcycleTheftTable />
      </div>
    </div>
  )
}
