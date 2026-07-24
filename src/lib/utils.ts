import { RiskLevel, ReferralStatus } from "@/types";

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export function getRiskLabel(risk: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    LOW: "Risiko Rendah",
    MEDIUM: "Risiko Sedang",
    HIGH: "Risiko Tinggi",
  };
  return labels[risk];
}

export function getRiskColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    LOW: "#10B981",
    MEDIUM: "#F59E0B",
    HIGH: "#EF4444",
  };
  return colors[risk];
}

export function getReferralStatusLabel(status: ReferralStatus): string {
  const labels: Record<ReferralStatus, string> = {
    PENDING: "Menunggu",
    ACCEPTED: "Diterima",
    IN_PROGRESS: "Dalam Proses",
    COMPLETED: "Selesai",
    REJECTED: "Ditolak",
    CANCELLED: "Dibatalkan",
  };
  return labels[status];
}

export function getReferralStatusColor(status: ReferralStatus): string {
  const colors: Record<ReferralStatus, string> = {
    PENDING: "#F59E0B",
    ACCEPTED: "#10B981",
    IN_PROGRESS: "#0EA5E9",
    COMPLETED: "#8B5CF6",
    REJECTED: "#EF4444",
    CANCELLED: "#64748B",
  };
  return colors[status];
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function formatProteinUrin(val: number | string): string {
  if (typeof val === "string") {
    if (val.includes("+") || val.toLowerCase().includes("neg")) return val;
  }
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);

  if (num < 0.15) return `${num} g/L (Negatif)`;
  if (num < 0.3) return `${num} g/L (Trace)`;
  if (num < 1.0) return `${num} g/L (+1 Positif)`;
  if (num < 3.0) return `${num} g/L (+2 Positif Sedang)`;
  return `${num} g/L (+3 Positif Tinggi)`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
