export type Role = "PASIEN" | "NAKES" | "DOKTER" | "ADMIN";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ReferralStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  facilityId?: string;
}

export interface Patient {
  id: string;
  userId: string;
  nik: string;
  nama: string;
  tanggalLahir: string;
  usiaKehamilan: number;
  alamat: string;
  user?: User;
}

export interface Screening {
  id: string;
  patientId: string;
  systolic: number;
  diastolic: number;
  proteinUrin: number | string;
  pulse?: number;
  mapValue?: number;
  // 10-Parameter Urine Reagent Strip Indicators
  leukocytes?: string;
  nitrite?: string;
  urobilinogen?: string;
  ph?: string;
  blood?: string;
  specificGravity?: string;
  ketone?: string;
  bilirubin?: string;
  glucose?: string;
  aiResult: RiskLevel;
  confidence: number;
  createdAt: string;
  patient?: Patient;
  riskFactors?: RiskFactor;
}

export interface RiskFactor {
  id: string;
  screeningId: string;
  usiaIbu: number;
  bmi: number;
  diabetes: boolean;
  riwayatPreeklamsia: boolean;
  riwayatKeluarga: boolean;
  hipertensi: boolean;
  penyakitGinjal: boolean;
  kehamilanPertama: boolean;
}

export interface Referral {
  id: string;
  patientId: string;
  fromFacilityId: string;
  toFacilityId: string;
  status: ReferralStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  fromFacility?: Facility;
  toFacility?: Facility;
}

export interface Facility {
  id: string;
  name: string;
  type: "PUSKESMAS" | "RUMAH_SAKIT";
  address: string;
  phone?: string;
}

export interface AIPrediction {
  riskLevel: RiskLevel;
  confidence: number;
  factors: string[];
  clinicalRiskScore?: number;
  sensorScore?: number;
  hybridScore?: number;
  recommendation?: string;
  summarySentence?: string;
  urineIndicators?: {
    protein: string;
    leukocytes: string;
    nitrite: string;
    urobilinogen: string;
    ph: string;
    blood: string;
    specificGravity: string;
    ketone: string;
    bilirubin: string;
    glucose: string;
  };
}

export interface DashboardStats {
  totalPatients: number;
  totalScreenings: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  pendingReferrals: number;
}
