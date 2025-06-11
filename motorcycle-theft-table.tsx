"use client"

import { useState, useMemo } from "react"
import { Search, ChevronUp, ChevronDown, Filter, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MotorcycleTheftData {
  tanggal: string
  hari: string
  waktu: string
  lokasi: string
  keterangan: string
  sumber: string
}

const data: MotorcycleTheftData[] = [
  {
    tanggal: "29 Mei 2025",
    hari: "Kamis",
    waktu: "06:00 WIB",
    lokasi: "Minimarket, Jalan Ketintang",
    keterangan: "Pelaku kepergok mencuri motor milik ibu rumah tangga, dihajar massa.",
    sumber:
      "https://jatim.idntimes.com/news/jatim/ardiansyah-fajar/maling-sepeda-motor-di-ketintang-pria-ini-dihajar-massa",
  },
  {
    tanggal: "11 April 2025",
    hari: "Jumat",
    waktu: "10:21 WIB",
    lokasi: "Minimarket, Ketintang",
    keterangan: "Dua pemuda mencuri motor pengunjung minimarket, terekam CCTV.",
    sumber: "https://www.instagram.com/reel/DIT4mBShk9l/",
  },
  {
    tanggal: "24 Januari 2024",
    hari: "Rabu",
    waktu: "19:34 WIB",
    lokasi: "Jalan Ketintang",
    keterangan: "Pelaku mencuri motor, terekam CCTV.",
    sumber: "https://m.facebook.com/story.php?id=100053320962436&story_fbid=1415867295685277",
  },
  {
    tanggal: "12 Oktober 2024",
    hari: "Sabtu",
    waktu: "-",
    lokasi: "Jalan Ketintang Baru XV, Gayungan",
    keterangan: "Dua pelaku mencuri motor, terekam CCTV, diduga juga beraksi di Ngagel.",
    sumber:
      "https://radarsurabaya.jawapos.com/surabaya/775197993/pencuri-motor-di-ketintang-baru-surabaya-diduga-juga-beraksi-di-kawasan-ngagel",
  },
  {
    tanggal: "9 Januari 2024",
    hari: "Selasa",
    waktu: "14:15 WIB",
    lokasi: "Aspol Ketintang, Surabaya",
    keterangan: "Sindikat pencurian motor terbongkar; dua pelaku dan seorang penadah ditangkap.",
    sumber:
      "https://mili.id/baca-10250-cerita-dibalik-terbongkarnya-sindikat-pencurian-motor-di-aspol-ketintang-surabaya",
  },
  {
    tanggal: "12 Juni 2023",
    hari: "Senin",
    waktu: "17:45 WIB",
    lokasi: "Warkop Barokah, Jalan Ngagel Rejo Kidul",
    keterangan: "Pelaku mencuri motor di warkop, bagian dari sindikat yang juga beraksi di Aspol Ketintang.",
    sumber:
      "https://mili.id/baca-10250-cerita-dibalik-terbongkarnya-sindikat-pencurian-motor-di-aspol-ketintang-surabaya",
  },
  {
    tanggal: "31 Desember 2023",
    hari: "Minggu",
    waktu: "18:00 WIB",
    lokasi: "Jalan Mustika Baru, Ngagel",
    keterangan: "Pelaku mencuri motor, bagian dari sindikat yang juga beraksi di Aspol Ketintang.",
    sumber:
      "https://mili.id/baca-10250-cerita-dibalik-terbongkarnya-sindikat-pencurian-motor-di-aspol-ketintang-surabaya",
  },
  {
    tanggal: "2 September 2024",
    hari: "Senin",
    waktu: "-",
    lokasi: "Wilayah Polsek Wonocolo, Surabaya",
    keterangan: "Motor Vario dengan plat nomor L 2212 GD dilaporkan hilang di area Ketintang.",
    sumber: "https://example.com/laporan-polisi",
  },
  {
    tanggal: "14 September 2024",
    hari: "Sabtu",
    waktu: "-",
    lokasi: "Wilayah Polsek Wonocolo, Surabaya",
    keterangan: "Motor Beat dengan plat nomor L 3709 BAD dilaporkan hilang di area Ketintang.",
    sumber: "https://example.com/laporan-polisi",
  },
  {
    tanggal: "14 September 2024",
    hari: "Sabtu",
    waktu: "-",
    lokasi: "Wilayah Polsek Wonocolo, Surabaya",
    keterangan: "Motor Beat dengan plat nomor W 3662 dilaporkan hilang di area Ketintang.",
    sumber: "https://example.com/laporan-polisi",
  },
  {
    tanggal: "2 September 2024",
    hari: "Senin",
    waktu: "00:30 WIB",
    lokasi: "Jalan Tambak Arum, Surabaya",
    keterangan: "Komplotan pencuri motor beraksi, salah satu pelaku ditangkap di Nganjuk.",
    sumber: "https://kabarjawatimur.com/sindikat-curi-motor-dan-hp-l-dibekuk-jatanras-polrestabes-surabaya/",
  },
  {
    tanggal: "27 September 2024",
    hari: "Jumat",
    waktu: "-",
    lokasi: "FBS Unesa, Ketintang",
    keterangan: "Dua motor mahasiswa dicuri saat acara malam hari, terekam CCTV.",
    sumber: "https://mojok.co/terminal/fbs-unesa-surganya-para-maling-motor/",
  },
  {
    tanggal: "18 Juni 2021",
    hari: "Jumat",
    waktu: "-",
    lokasi: "Jalan Ketintang Barat No. 57",
    keterangan: "Pelaku dihajar massa setelah dipergoki mencuri motor.",
    sumber: "https://radarsurabaya.jawapos.com/surabaya/77973904/jatuh-saat-curi-motor-pemuda-dimassa-warga",
  },
  {
    tanggal: "13 April 2022",
    hari: "Rabu",
    waktu: "-",
    lokasi: "Ketintang Baru, Surabaya",
    keterangan: "Dua motor dicuri saat pemilik salat Tarawih, terekam CCTV.",
    sumber:
      "https://www.facebook.com/KompasTV/videos/aksi-maling-motor-terekam-cctv-saat-pemilik-salat-tarawih/726174175084804/",
  },
  {
    tanggal: "2023",
    hari: "-",
    waktu: "03:30 WIB",
    lokasi: "Jalan Ketintang Barat, Surabaya",
    keterangan: "Komplotan pencuri motor beraksi, pelaku ditangkap.",
    sumber: "https://kabarjawatimur.com/sindikat-curi-motor-dan-hp-l-dibekuk-jatanras-polrestabes-surabaya/",
  },
  {
    tanggal: "1 November 2024",
    hari: "Jumat",
    waktu: "-",
    lokasi: "Jemursari, Polsek Wonocolo, Surabaya",
    keterangan: "Motor Beat 2019 dengan plat nomor L 4611 JW dilaporkan hilang di area terkait Ketintang.",
    sumber: "https://example.com/laporan-polisi",
  },
  {
    tanggal: "5 November 2024",
    hari: "Selasa",
    waktu: "-",
    lokasi: "Jetis Kulon, Polsek Wonokromo, Surabaya",
    keterangan: "Motor Beat 2019 dengan plat nomor N 4120 NK dilaporkan hilang di area terkait Ketintang.",
    sumber: "https://example.com/laporan-polisi",
  },
  {
    tanggal: "7 November 2024",
    hari: "Kamis",
    waktu: "-",
    lokasi: "Jetis Kulon, Polsek Wonokromo, Surabaya",
    keterangan: "Motor Beat 2014 dengan plat nomor L 3406 WK dilaporkan hilang di area terkait Ketintang.",
    sumber: "https://example.com/laporan-polisi",
  },
  {
    tanggal: "7 November 2024",
    hari: "Kamis",
    waktu: "-",
    lokasi: "Rungkut Madya, Polsek Rungkut, Surabaya",
    keterangan: "Motor Nmax 2017 dengan plat nomor L 4065 FW dilaporkan hilang di area terkait Ketintang.",
    sumber: "https://example.com/laporan-polisi",
  },
]

type SortField = "tanggal" | "hari" | "waktu"
type SortOrder = "asc" | "desc"

export default function MotorcycleTheftTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dayFilter, setDayFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("tanggal")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
  const timeRanges = [
    { label: "Pagi (06:00-12:00)", value: "morning" },
    { label: "Siang (12:00-18:00)", value: "afternoon" },
    { label: "Malam (18:00-24:00)", value: "evening" },
    { label: "Dini Hari (00:00-06:00)", value: "dawn" },
  ]

  const getTimeRange = (waktu: string) => {
    if (waktu === "-") return "unknown"
    const timeMatch = waktu.match(/(\d{2}):(\d{2})/)
    if (!timeMatch) return "unknown"

    const hour = Number.parseInt(timeMatch[1])
    if (hour >= 6 && hour < 12) return "morning"
    if (hour >= 12 && hour < 18) return "afternoon"
    if (hour >= 18 && hour < 24) return "evening"
    if (hour >= 0 && hour < 6) return "dawn"
    return "unknown"
  }

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) => {
      const matchesSearch =
        item.tanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hari.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keterangan.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDay = dayFilter === "all" || item.hari === dayFilter
      const matchesTime = timeFilter === "all" || getTimeRange(item.waktu) === timeFilter

      return matchesSearch && matchesDay && matchesTime
    })

    // Sort the filtered data
    filtered.sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      switch (sortField) {
        case "tanggal":
          // Convert date to comparable format
          aValue = new Date(a.tanggal.replace(/(\d+) (\w+) (\d+)/, "$2 $1, $3")).getTime() || 0
          bValue = new Date(b.tanggal.replace(/(\d+) (\w+) (\d+)/, "$2 $1, $3")).getTime() || 0
          break
        case "hari":
          aValue = days.indexOf(a.hari)
          bValue = days.indexOf(b.hari)
          break
        case "waktu":
          // Convert time to minutes for comparison
          const getMinutes = (time: string) => {
            if (time === "-") return -1
            const match = time.match(/(\d{2}):(\d{2})/)
            return match ? Number.parseInt(match[1]) * 60 + Number.parseInt(match[2]) : -1
          }
          aValue = getMinutes(a.waktu)
          bValue = getMinutes(b.waktu)
          break
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, dayFilter, timeFilter, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Data Pencurian Motor</h2>
        <p className="text-sm sm:text-base text-gray-600">Sistem Tracking dan Monitoring Curanmor</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari berdasarkan tanggal, lokasi, atau keterangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Day Filter */}
            <div className="flex-1">
              <Select value={dayFilter} onValueChange={setDayFilter}>
                <SelectTrigger className="text-sm sm:text-base">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Hari</SelectItem>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Filter */}
            <div className="flex-1">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="text-sm sm:text-base">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-600">
          Menampilkan {filteredAndSortedData.length} dari {data.length} data
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("tanggal")}
                    className="font-semibold text-gray-900 hover:bg-gray-100 p-0 h-auto text-xs sm:text-sm"
                  >
                    Tanggal {getSortIcon("tanggal")}
                  </Button>
                </th>
                <th className="px-2 sm:px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("hari")}
                    className="font-semibold text-gray-900 hover:bg-gray-100 p-0 h-auto text-xs sm:text-sm"
                  >
                    Hari {getSortIcon("hari")}
                  </Button>
                </th>
                <th className="px-2 sm:px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("waktu")}
                    className="font-semibold text-gray-900 hover:bg-gray-100 p-0 h-auto text-xs sm:text-sm"
                  >
                    Waktu {getSortIcon("waktu")}
                  </Button>
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-900 text-xs sm:text-sm">Lokasi</th>
                <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-900 text-xs sm:text-sm">
                  Keterangan
                </th>
                <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-900 text-xs sm:text-sm">Sumber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                    <span
                      className={`inline-flex px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${
                        item.hari === "Sabtu" || item.hari === "Minggu"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.hari}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                    <span
                      className={`inline-flex px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${
                        item.waktu === "-"
                          ? "bg-gray-100 text-gray-800"
                          : getTimeRange(item.waktu) === "dawn" || getTimeRange(item.waktu) === "evening"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.waktu}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                    <div className="max-w-[120px] sm:max-w-xs truncate" title={item.lokasi}>
                      {item.lokasi}
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                    <div className="max-w-[150px] sm:max-w-md line-clamp-2" title={item.keterangan}>
                      {item.keterangan}
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm">
                    <a
                      href={item.sumber}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline">Lihat</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-500 text-base sm:text-lg">Tidak ada data yang ditemukan</div>
            <div className="text-gray-400 text-xs sm:text-sm mt-2">Coba ubah kriteria pencarian atau filter</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs sm:text-sm text-gray-500">
        Data pencurian motor di wilayah Ketintang dan sekitarnya
      </div>
    </div>
  )
}
