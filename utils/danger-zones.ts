// Definisi area berbahaya berdasarkan data pencurian motor
export interface DangerZone {
  id: string
  name: string
  center: {
    lat: number
    lng: number
  }
  radius: number // dalam meter
  riskLevel: "high" | "medium" | "low"
  dangerousHours: number[] // jam dalam format 24 jam
}

export const dangerZones: DangerZone[] = [
  {
    id: "ketintang-main",
    name: "Jalan Ketintang",
    center: {
      lat: -7.3115,
      lng: 112.7277,
    },
    radius: 500,
    riskLevel: "high",
    dangerousHours: [0, 1, 2, 3, 4, 5, 6, 10, 18, 19, 20, 21, 22, 23],
  },
  {
    id: "ketintang-baru",
    name: "Ketintang Baru",
    center: {
      lat: -7.3125,
      lng: 112.7285,
    },
    radius: 400,
    riskLevel: "high",
    dangerousHours: [0, 1, 2, 3, 4, 5, 14, 15, 17, 18, 19, 20, 21, 22, 23],
  },
  {
    id: "ketintang-ptt",
    name: "Ketintang PTT",
    center: {
      lat: -7.3095,
      lng: 112.7285,
    },
    radius: 350,
    riskLevel: "high",
    dangerousHours: [0, 1, 2, 3, 4, 5, 17, 18, 19, 20, 21, 22, 23],
  },
  {
    id: "ketintang-wiyata",
    name: "Ketintang Wiyata",
    center: {
      lat: -7.3115,
      lng: 112.7265,
    },
    radius: 300,
    riskLevel: "medium",
    dangerousHours: [18, 19, 20, 21, 22, 23],
  },
  {
    id: "ketintang-madya",
    name: "Ketintang Madya",
    center: {
      lat: -7.3105,
      lng: 112.727,
    },
    radius: 300,
    riskLevel: "medium",
    dangerousHours: [0, 1, 2, 3, 4, 5, 18, 19, 20, 21, 22, 23],
  },
  {
    id: "ketintang-selatan",
    name: "Ketintang Selatan",
    center: {
      lat: -7.3125,
      lng: 112.7275,
    },
    radius: 300,
    riskLevel: "medium",
    dangerousHours: [0, 1, 2, 3, 4, 5, 17, 18, 19, 20, 21, 22, 23],
  },
  {
    id: "fbs-unesa",
    name: "FBS Unesa",
    center: {
      lat: -7.3105,
      lng: 112.7265,
    },
    radius: 300,
    riskLevel: "medium",
    dangerousHours: [18, 19, 20, 21, 22, 23],
  },
  {
    id: "tambak-arum",
    name: "Tambak Arum",
    center: {
      lat: -7.3135,
      lng: 112.7255,
    },
    radius: 400,
    riskLevel: "medium",
    dangerousHours: [0, 1, 2, 3, 4, 5],
  },
]

// Fungsi untuk menghitung jarak antara dua koordinat (Haversine formula)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Radius bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// Fungsi untuk mengecek apakah pengguna berada di area berbahaya
export function checkDangerZone(userLat: number, userLng: number): DangerZone | null {
  const currentHour = new Date().getHours()

  for (const zone of dangerZones) {
    const distance = calculateDistance(userLat, userLng, zone.center.lat, zone.center.lng)

    if (distance <= zone.radius && zone.dangerousHours.includes(currentHour)) {
      return zone
    }
  }

  return null
}

// Fungsi untuk mendapatkan pesan peringatan berdasarkan zona
export function getDangerMessage(zone: DangerZone): string {
  const currentHour = new Date().getHours()
  const timeOfDay = currentHour >= 18 || currentHour <= 5 ? "malam" : "siang"

  const riskMessages = {
    high: `Anda berada di area ${zone.name} yang memiliki tingkat risiko TINGGI pencurian motor, terutama pada ${timeOfDay} hari. Harap sangat waspada!`,
    medium: `Anda berada di area ${zone.name} yang memiliki tingkat risiko SEDANG pencurian motor pada ${timeOfDay} hari. Tetap waspada!`,
    low: `Anda berada di area ${zone.name}. Meskipun risiko rendah, tetap jaga kewaspadaan Anda.`,
  }

  return riskMessages[zone.riskLevel]
}
