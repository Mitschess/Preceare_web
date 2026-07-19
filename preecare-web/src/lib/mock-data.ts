// Mock data for demo purposes - replace with real database calls in production
import { Patient, Screening, Referral, Facility, DashboardStats, RiskLevel } from "@/types";

// Facilities
export const facilities: Facility[] = [
  { id: "fac-1", name: "Puskesmas Kecamatan Menteng", type: "PUSKESMAS", address: "Jl. Menteng Raya No. 23, Jakarta Pusat", phone: "021-3145678" },
  { id: "fac-2", name: "Puskesmas Kelurahan Cikini", type: "PUSKESMAS", address: "Jl. Cikini Raya No. 45, Jakarta Pusat", phone: "021-3157890" },
  { id: "fac-3", name: "RS Cipto Mangunkusumo", type: "RUMAH_SAKIT", address: "Jl. Diponegoro No. 71, Salemba", phone: "021-3923631" },
  { id: "fac-4", name: "RS Harapan Kita", type: "RUMAH_SAKIT", address: "Jl. Letjen S. Parman Kav. 87, Slipi", phone: "021-5684093" },
];

// Patients
export const patients: Patient[] = [
  { id: "pat-1", userId: "usr-1", nik: "3171012345670001", nama: "Siti Aminah", tanggalLahir: "1995-03-15", usiaKehamilan: 28, alamat: "Jl. Menteng Dalam No. 10, Jakarta Pusat" },
  { id: "pat-2", userId: "usr-2", nik: "3171012345670002", nama: "Dewi Lestari", tanggalLahir: "1990-07-22", usiaKehamilan: 32, alamat: "Jl. Cikini Raya No. 20, Jakarta Pusat" },
  { id: "pat-3", userId: "usr-3", nik: "3171012345670003", nama: "Ratna Sari", tanggalLahir: "1998-12-01", usiaKehamilan: 24, alamat: "Jl. Salemba Tengah No. 5, Jakarta Pusat" },
  { id: "pat-4", userId: "usr-4", nik: "3171012345670004", nama: "Fitri Handayani", tanggalLahir: "1993-05-10", usiaKehamilan: 36, alamat: "Jl. Gondangdia No. 15, Jakarta Pusat" },
  { id: "pat-5", userId: "usr-5", nik: "3171012345670005", nama: "Nurul Hidayah", tanggalLahir: "1997-09-28", usiaKehamilan: 20, alamat: "Jl. Pramuka No. 8, Jakarta Timur" },
  { id: "pat-6", userId: "usr-6", nik: "3171012345670006", nama: "Rina Wulandari", tanggalLahir: "1994-01-18", usiaKehamilan: 30, alamat: "Jl. Kramat Raya No. 33, Jakarta Pusat" },
];

// Generate screening history for patients
function generateScreenings(): Screening[] {
  const screenings: Screening[] = [];
  const now = new Date();

  patients.forEach((patient) => {
    const count = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (count - i) * 14); // bi-weekly

      const isHighRisk = patient.id === "pat-2" || patient.id === "pat-4";
      const isMediumRisk = patient.id === "pat-3" || patient.id === "pat-6";

      let systolic: number, diastolic: number, proteinUrin: number, aiResult: RiskLevel, confidence: number;

      if (isHighRisk) {
        systolic = 140 + Math.floor(Math.random() * 30) + i * 3;
        diastolic = 90 + Math.floor(Math.random() * 20) + i * 2;
        proteinUrin = 2.0 + Math.random() * 2 + i * 0.3;
        aiResult = i > count - 3 ? "HIGH" : "MEDIUM";
        confidence = 0.85 + Math.random() * 0.12;
      } else if (isMediumRisk) {
        systolic = 125 + Math.floor(Math.random() * 20);
        diastolic = 80 + Math.floor(Math.random() * 15);
        proteinUrin = 0.5 + Math.random() * 1.5;
        aiResult = "MEDIUM";
        confidence = 0.70 + Math.random() * 0.15;
      } else {
        systolic = 110 + Math.floor(Math.random() * 15);
        diastolic = 65 + Math.floor(Math.random() * 10);
        proteinUrin = Math.random() * 0.3;
        aiResult = "LOW";
        confidence = 0.88 + Math.random() * 0.10;
      }

      screenings.push({
        id: `scr-${patient.id}-${i}`,
        patientId: patient.id,
        systolic: Math.round(systolic),
        diastolic: Math.round(diastolic),
        proteinUrin: Math.round(proteinUrin * 100) / 100,
        aiResult,
        confidence: Math.round(confidence * 100) / 100,
        createdAt: date.toISOString(),
        patient,
        riskFactors: {
          id: `rf-${patient.id}-${i}`,
          screeningId: `scr-${patient.id}-${i}`,
          diabetes: isHighRisk && Math.random() > 0.5,
          riwayatPreeklamsia: isHighRisk,
          riwayatKeluarga: isHighRisk || (isMediumRisk && Math.random() > 0.5),
          hipertensi: isHighRisk || (isMediumRisk && Math.random() > 0.3),
          kehamilanPertama: patient.id === "pat-1" || patient.id === "pat-5",
        },
      });
    }
  });

  return screenings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const screenings = generateScreenings();

// Referrals
export const referrals: Referral[] = [
  {
    id: "ref-1",
    patientId: "pat-2",
    fromFacilityId: "fac-1",
    toFacilityId: "fac-3",
    status: "ACCEPTED",
    notes: "Tekanan darah konsisten tinggi, protein urin meningkat. Perlu pemeriksaan lanjutan.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    patient: patients[1],
    fromFacility: facilities[0],
    toFacility: facilities[2],
  },
  {
    id: "ref-2",
    patientId: "pat-4",
    fromFacilityId: "fac-2",
    toFacilityId: "fac-4",
    status: "PENDING",
    notes: "Pasien usia kehamilan 36 minggu dengan risiko tinggi preeklamsia.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    patient: patients[3],
    fromFacility: facilities[1],
    toFacility: facilities[3],
  },
  {
    id: "ref-3",
    patientId: "pat-6",
    fromFacilityId: "fac-1",
    toFacilityId: "fac-3",
    status: "IN_PROGRESS",
    notes: "Risiko menengah, riwayat keluarga preeklamsia. Monitoring ketat diperlukan.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    patient: patients[5],
    fromFacility: facilities[0],
    toFacility: facilities[2],
  },
];

// Dashboard stats
export function getDashboardStats(): DashboardStats {
  const latestScreeningsMap = new Map<string, Screening>();
  screenings.forEach((s) => {
    if (!latestScreeningsMap.has(s.patientId) || new Date(s.createdAt) > new Date(latestScreeningsMap.get(s.patientId)!.createdAt)) {
      latestScreeningsMap.set(s.patientId, s);
    }
  });

  const latestScreenings = Array.from(latestScreeningsMap.values());

  return {
    totalPatients: patients.length,
    totalScreenings: screenings.length,
    highRiskCount: latestScreenings.filter((s) => s.aiResult === "HIGH").length,
    mediumRiskCount: latestScreenings.filter((s) => s.aiResult === "MEDIUM").length,
    lowRiskCount: latestScreenings.filter((s) => s.aiResult === "LOW").length,
    pendingReferrals: referrals.filter((r) => r.status === "PENDING").length,
  };
}

export function getPatientScreenings(patientId: string): Screening[] {
  return screenings
    .filter((s) => s.patientId === patientId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getLatestScreening(patientId: string): Screening | undefined {
  return screenings
    .filter((s) => s.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

export function getPatientReferrals(patientId: string): Referral[] {
  return referrals.filter((r) => r.patientId === patientId);
}

// Mock AI prediction
export function mockAIPredict(data: {
  systolic: number;
  diastolic: number;
  proteinUrin: number;
  diabetes: boolean;
  riwayatPreeklamsia: boolean;
  riwayatKeluarga: boolean;
  hipertensi: boolean;
  kehamilanPertama: boolean;
}): { riskLevel: RiskLevel; confidence: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  if (data.systolic >= 140) { score += 3; factors.push("Tekanan sistolik tinggi"); }
  else if (data.systolic >= 130) { score += 2; factors.push("Tekanan sistolik di atas normal"); }

  if (data.diastolic >= 90) { score += 3; factors.push("Tekanan diastolik tinggi"); }
  else if (data.diastolic >= 80) { score += 1; factors.push("Tekanan diastolik di atas normal"); }

  if (data.proteinUrin >= 2.0) { score += 3; factors.push("Protein urin tinggi"); }
  else if (data.proteinUrin >= 0.3) { score += 1; factors.push("Protein urin di atas normal"); }

  if (data.diabetes) { score += 2; factors.push("Riwayat diabetes"); }
  if (data.riwayatPreeklamsia) { score += 3; factors.push("Riwayat preeklamsia"); }
  if (data.riwayatKeluarga) { score += 2; factors.push("Riwayat keluarga"); }
  if (data.hipertensi) { score += 2; factors.push("Riwayat hipertensi"); }
  if (data.kehamilanPertama) { score += 1; factors.push("Kehamilan pertama"); }

  let riskLevel: RiskLevel;
  if (score >= 8) riskLevel = "HIGH";
  else if (score >= 4) riskLevel = "MEDIUM";
  else riskLevel = "LOW";

  const baseConfidence = riskLevel === "HIGH" ? 0.85 : riskLevel === "MEDIUM" ? 0.72 : 0.90;
  const confidence = Math.round((baseConfidence + Math.random() * 0.10) * 100) / 100;

  return { riskLevel, confidence: Math.min(confidence, 0.99), factors };
}
