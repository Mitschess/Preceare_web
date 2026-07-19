export type Role = "PASIEN" | "NAKES" | "DOKTER" | "ADMIN";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ReferralStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

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
  proteinUrin: number;
  aiResult: RiskLevel;
  confidence: number;
  createdAt: string;
  patient?: Patient;
  riskFactors?: RiskFactor;
}

export interface RiskFactor {
  id: string;
  screeningId: string;
  diabetes: boolean;
  riwayatPreeklamsia: boolean;
  riwayatKeluarga: boolean;
  hipertensi: boolean;
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
}

export interface DashboardStats {
  totalPatients: number;
  totalScreenings: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  pendingReferrals: number;
}
