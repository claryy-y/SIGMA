// Data area Ketintang dengan koordinat dan informasi risiko
export interface KetintangArea {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
  riskLevel: "high" | "medium" | "low"
  dangerousHours: number[]
  description: string
  incidents: number // jumlah kejadian berdasarkan data
}

export const ketintangAreas: KetintangArea[] = [
  {
    id: "ketintang-madya",
    name: "Ketintang Madya",
    coordinates: { lat: -7.3105, lng: 112.727 },
    bounds: { north: -7.3095, south: -7.3115, east: 112.728, west: 112.726 },
    riskLevel: "medium",
    dangerousHours: [0, 1, 2, 3, 4, 5, 18, 19, 20, 21, 22, 23],
    description: "Area perumahan dengan akses ke jalan utama",
    incidents: 2,
  },
  {
    id: "ketintang-selatan",
    name: "Ketintang Selatan",
    coordinates: { lat: -7.3125, lng: 112.7275 },
    bounds: { north: -7.3115, south: -7.3135, east: 112.7285, west: 112.7265 },
    riskLevel: "medium",
    dangerousHours: [0, 1, 2, 3, 4, 5, 17, 18, 19, 20, 21, 22, 23],
    description: "Area perumahan dengan beberapa ruko dan warung",
    incidents: 1,
  },
  {
    id: "ketintang-ptt",
    name: "Ketintang PTT",
    coordinates: { lat: -7.3095, lng: 112.7285 },
    bounds: { north: -7.3085, south: -7.3105, east: 112.7295, west: 112.7275 },
    riskLevel: "high",
    dangerousHours: [0, 1, 2, 3, 4, 5, 17, 18, 19, 20, 21, 22, 23],
    description: "Area dekat kantor PTT dengan aktivitas komersial",
    incidents: 3,
  },
  {
    id: "ketintang-wiyata",
    name: "Ketintang Wiyata",
    coordinates: { lat: -7.3115, lng: 112.7265 },
    bounds: { north: -7.3105, south: -7.3125, east: 112.7275, west: 112.7255 },
    riskLevel: "medium",
    dangerousHours: [18, 19, 20, 21, 22, 23],
    description: "Area dekat institusi pendidikan",
    incidents: 2,
  },
  {
    id: "ketintang-pratama",
    name: "Ketintang Pratama",
    coordinates: { lat: -7.3135, lng: 112.726 },
    bounds: { north: -7.3125, south: -7.3145, east: 112.727, west: 112.725 },
    riskLevel: "low",
    dangerousHours: [0, 1, 2, 3, 4, 5],
    description: "Area perumahan yang relatif tenang",
    incidents: 0,
  },
  {
    id: "ketintang-permai",
    name: "Ketintang Permai",
    coordinates: { lat: -7.3145, lng: 112.7275 },
    bounds: { north: -7.3135, south: -7.3155, east: 112.7285, west: 112.7265 },
    riskLevel: "low",
    dangerousHours: [0, 1, 2, 3, 4, 5],
    description: "Kompleks perumahan dengan keamanan baik",
    incidents: 0,
  },
  {
    id: "ketintang-baru",
    name: "Ketintang Baru",
    coordinates: { lat: -7.3125, lng: 112.7285 },
    bounds: { north: -7.3115, south: -7.3135, east: 112.7295, west: 112.7275 },
    riskLevel: "high",
    dangerousHours: [0, 1, 2, 3, 4, 5, 14, 15, 17, 18, 19, 20, 21, 22, 23],
    description: "Area dengan tingkat kejahatan tinggi, banyak minimarket",
    incidents: 4,
  },
  {
    id: "ketintang-utama",
    name: "Ketintang",
    coordinates: { lat: -7.3115, lng: 112.7277 },
    bounds: { north: -7.3105, south: -7.3125, east: 112.7287, west: 112.7267 },
    riskLevel: "high",
    dangerousHours: [0, 1, 2, 3, 4, 5, 6, 10, 18, 19, 20, 21, 22, 23],
    description: "Jalan utama Ketintang dengan aktivitas tinggi",
    incidents: 5,
  },
]

// Fungsi untuk mendapatkan tingkat risiko berdasarkan waktu
export function getCurrentRiskLevel(area: KetintangArea): "high" | "medium" | "low" {
  const currentHour = new Date().getHours()

  if (area.dangerousHours.includes(currentHour)) {
    // Tingkatkan level risiko pada jam rawan
    if (area.riskLevel === "low") return "medium"
    if (area.riskLevel === "medium") return "high"
    return "high"
  }

  return area.riskLevel
}

// Fungsi untuk mendapatkan warna berdasarkan tingkat risiko
export function getRiskColor(riskLevel: "high" | "medium" | "low"): string {
  switch (riskLevel) {
    case "high":
      return "#ef4444" // red-500
    case "medium":
      return "#f59e0b" // amber-500
    case "low":
      return "#10b981" // emerald-500
    default:
      return "#6b7280" // gray-500
  }
}

// Fungsi untuk mendapatkan opacity berdasarkan tingkat risiko
export function getRiskOpacity(riskLevel: "high" | "medium" | "low"): number {
  switch (riskLevel) {
    case "high":
      return 0.7
    case "medium":
      return 0.5
    case "low":
      return 0.3
    default:
      return 0.2
  }
}
