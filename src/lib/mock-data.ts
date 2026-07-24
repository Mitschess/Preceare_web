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

// Calculate age from birth date
function calculateAgeFromDate(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Precomputed patient metadata for risk factor generation
const patientMeta: Record<string, { bmi: number }> = {
  "pat-1": { bmi: 23.5 },
  "pat-2": { bmi: 30.2 },
  "pat-3": { bmi: 25.1 },
  "pat-4": { bmi: 32.4 },
  "pat-5": { bmi: 21.8 },
  "pat-6": { bmi: 27.6 },
};

// Generate screening history for patients
function generateScreenings(): Screening[] {
  const screenings: Screening[] = [];
  const now = new Date();

  patients.forEach((patient) => {
    const count = 3 + Math.floor(Math.random() * 5);
    const patientAge = calculateAgeFromDate(patient.tanggalLahir);
    const meta = patientMeta[patient.id] || { bmi: 24.0 };

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
          usiaIbu: patientAge,
          bmi: meta.bmi + (Math.random() * 2 - 1), // slight variation
          diabetes: isHighRisk && Math.random() > 0.5,
          riwayatPreeklamsia: isHighRisk,
          riwayatKeluarga: isHighRisk || (isMediumRisk && Math.random() > 0.5),
          hipertensi: isHighRisk || (isMediumRisk && Math.random() > 0.3),
          penyakitGinjal: isHighRisk && Math.random() > 0.7,
          kehamilanPertama: patient.id === "pat-1" || patient.id === "pat-5",
        },
      });
    }
  });

  // Add dummy screening data from Section 8B of AGENTS_UPDATED.md
  // This is Fitri Handayani (pat-4): Usia 37, BMI 32.4, TD 152/98, Protein +2, High Risk 89%
  const dummyDate = new Date(now);
  dummyDate.setHours(dummyDate.getHours() - 2);
  screenings.push({
    id: "scr-dummy-8b",
    patientId: "pat-4",
    systolic: 152,
    diastolic: 98,
    proteinUrin: 2.0, // +2
    aiResult: "HIGH",
    confidence: 0.89,
    createdAt: dummyDate.toISOString(),
    patient: patients[3],
    riskFactors: {
      id: "rf-dummy-8b",
      screeningId: "scr-dummy-8b",
      usiaIbu: 37,
      bmi: 32.4,
      diabetes: true,
      riwayatPreeklamsia: false, // Kehamilan Pertama
      riwayatKeluarga: true,
      hipertensi: false,
      penyakitGinjal: false,
      kehamilanPertama: true,
    },
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
    notes: "Pasien usia kehamilan 36 minggu dengan risiko tinggi preeklamsia. AI Confidence 89%.",
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

// Mock AI prediction — updated to follow Hybrid CDSS approach with 10-Parameter Urine Reagent Strip
export function mockAIPredict(data: {
  systolic: number;
  diastolic: number;
  proteinUrin: number | string;
  usiaIbu: number;
  bmi: number;
  diabetes: boolean;
  riwayatPreeklamsia: boolean;
  riwayatKeluarga: boolean;
  hipertensi: boolean;
  penyakitGinjal: boolean;
  kehamilanPertama: boolean;
  usiaKehamilan?: number;
  leukocytes?: string;
  nitrite?: string;
  urobilinogen?: string;
  ph?: string;
  blood?: string;
  specificGravity?: string;
  ketone?: string;
  bilirubin?: string;
  glucose?: string;
}): {
  riskLevel: RiskLevel;
  confidence: number;
  factors: string[];
  clinicalRiskScore: number;
  sensorScore: number;
  hybridScore: number;
  recommendation: string;
  summarySentence: string;
} {
  const factors: string[] = [];

  // Tahap 1 – Clinical Risk Scoring (Maternal Risk Factors)
  let clinicalScore = 0;
  
  if (data.usiaIbu >= 35) { clinicalScore += 2; factors.push(`Usia Ibu berisiko ≥35 tahun (${data.usiaIbu} tahun)`); }
  else if (data.usiaIbu < 20) { clinicalScore += 1; factors.push(`Usia Ibu muda <20 tahun (${data.usiaIbu} tahun)`); }

  if (data.bmi >= 30) { clinicalScore += 2; factors.push(`BMI Obesitas (${data.bmi.toFixed(1)} kg/m²)`); }
  else if (data.bmi >= 25) { clinicalScore += 1; factors.push(`BMI Overweight (${data.bmi.toFixed(1)} kg/m²)`); }

  if (data.riwayatPreeklamsia) { clinicalScore += 3; factors.push("Riwayat preeklamsia sebelumnya"); }
  if (data.riwayatKeluarga) { clinicalScore += 2; factors.push("Riwayat keluarga dengan preeklamsia"); }
  if (data.diabetes) { clinicalScore += 2; factors.push("Penyakit Diabetes Mellitus"); }
  if (data.hipertensi) { clinicalScore += 3; factors.push("Penyakit Hipertensi Kronis"); }
  if (data.penyakitGinjal) { clinicalScore += 3; factors.push("Penyakit Ginjal Kronis"); }
  if (data.kehamilanPertama) { clinicalScore += 1; factors.push("Kehamilan pertama (Nullipara)"); }

  const gestAge = data.usiaKehamilan || 30; // Fallback to 30 weeks if not provided
  if (gestAge > 30) { clinicalScore += 2; factors.push(`Usia Kehamilan trimester ketiga (${gestAge} minggu)`); }
  else if (gestAge > 20) { clinicalScore += 1; factors.push(`Usia Kehamilan trimester kedua (${gestAge} minggu)`); }

  // Tahap 2 – Sensor Measurement (Objective Metrics)
  let sensorScore = 0;
  
  if (data.systolic >= 140) { sensorScore += 3; factors.push(`TD Sistolik Tinggi (≥140 mmHg): ${data.systolic}`); }
  else if (data.systolic >= 130) { sensorScore += 2; factors.push(`TD Sistolik Pre-hipertensi (≥130 mmHg): ${data.systolic}`); }
  else if (data.systolic >= 120) { sensorScore += 1; factors.push(`TD Sistolik Normal-tinggi (≥120 mmHg): ${data.systolic}`); }

  if (data.diastolic >= 90) { sensorScore += 3; factors.push(`TD Diastolik Tinggi (≥90 mmHg): ${data.diastolic}`); }
  else if (data.diastolic >= 80) { sensorScore += 2; factors.push(`TD Diastolik Pre-hipertensi (≥80 mmHg): ${data.diastolic}`); }

  // Convert protein value to numeric if string
  let protNum = 0;
  if (typeof data.proteinUrin === 'number') {
    protNum = data.proteinUrin;
  } else if (typeof data.proteinUrin === 'string') {
    if (data.proteinUrin.includes('+3') || data.proteinUrin.includes('300')) protNum = 3.0;
    else if (data.proteinUrin.includes('+2') || data.proteinUrin.includes('100')) protNum = 2.0;
    else if (data.proteinUrin.includes('+1') || data.proteinUrin.includes('30')) protNum = 0.3;
    else if (data.proteinUrin.includes('Trace')) protNum = 0.15;
    else protNum = parseFloat(data.proteinUrin) || 0;
  }

  if (protNum >= 2.0) { sensorScore += 3; factors.push(`Protein Urin Tinggi (≥2 g/L, setara +2/+3)`); }
  else if (protNum >= 0.3) { sensorScore += 2; factors.push(`Protein Urin Sedang (≥0.3 g/L, setara +1)`); }
  else if (protNum >= 0.15) { sensorScore += 1; factors.push(`Protein Urin Trace (≥0.15 g/L)`); }

  // Additional 10-Parameter Urine Strip Indicators from PREECARE Hardware
  if (data.leukocytes && data.leukocytes !== 'Negatif') {
    sensorScore += 1;
    factors.push(`Urine Leukocytes Positive (${data.leukocytes})`);
  }
  if (data.blood && data.blood !== 'Negatif') {
    sensorScore += 1;
    factors.push(`Urine Hematuria / Blood Positive (${data.blood})`);
  }
  if (data.ketone && data.ketone !== 'Negatif') {
    sensorScore += 1;
    factors.push(`Urine Keton Positif (${data.ketone})`);
  }
  if (data.glucose && data.glucose !== 'Negatif') {
    sensorScore += 1;
    factors.push(`Urine Glukosa Positif (${data.glucose})`);
  }

  // Tahap 3 – Hybrid AI Prediction
  const hybridScore = clinicalScore + sensorScore;
  
  let riskLevel: RiskLevel;
  let recommendation = "";
  
  if (hybridScore >= 16) {
    riskLevel = "HIGH";
    recommendation = "Rujuk Segera ke Rumah Sakit (CDSS Referral Recommendation)";
  } else if (hybridScore >= 10) {
    riskLevel = "MEDIUM";
    recommendation = "Monitoring Ketat & Kontrol Ulang di Puskesmas";
  } else {
    riskLevel = "LOW";
    recommendation = "Lanjutkan Kontrol Kehamilan Rutin";
  }

  const baseConfidence = riskLevel === "HIGH" ? 0.85 : riskLevel === "MEDIUM" ? 0.72 : 0.90;
  const confidence = Math.round((baseConfidence + (hybridScore / 60) + Math.random() * 0.05) * 100) / 100;

  const riskLabelMap: Record<RiskLevel, string> = {
    LOW: "Risiko Rendah",
    MEDIUM: "Risiko Sedang",
    HIGH: "Risiko Tinggi",
  };

  const protStr = typeof data.proteinUrin === 'string' ? data.proteinUrin : `${data.proteinUrin} g/L`;
  const gestAgeStr = data.usiaKehamilan ? ` dengan usia kehamilan ${data.usiaKehamilan} minggu` : "";
  const summarySentence = `Berdasarkan analisis AI, dengan usia ibu ${data.usiaIbu} tahun${gestAgeStr}, kadar protein urin ${protStr}, serta tekanan darah ${data.systolic}/${data.diastolic} mmHg, maka AI mengindikasikan Anda berada pada kategori ${riskLabelMap[riskLevel]} Preeklamsia.`;

  return {
    riskLevel,
    confidence: Math.min(confidence, 0.99),
    factors,
    clinicalRiskScore: clinicalScore,
    sensorScore,
    hybridScore,
    recommendation,
    summarySentence
  };
}
