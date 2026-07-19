"use client";

import {
  Activity,
  Heart,
  Droplets,
  TrendingUp,
  Calendar,
  AlertCircle,
  Send,
  FileText,
  Clock,
} from "lucide-react";
import { patients, getPatientScreenings, getLatestScreening, getPatientReferrals } from "@/lib/mock-data";
import { getRiskLabel, getRiskColor, formatDate, formatShortDate, getReferralStatusLabel, getReferralStatusColor } from "@/lib/utils";
import { Screening, Referral } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function PasienDashboard() {
  // Demo: patient 1
  const patient = patients[0];
  const screeningHistory = getPatientScreenings(patient.id);
  const latestScreening = getLatestScreening(patient.id);
  const patientReferrals = getPatientReferrals(patient.id);

  const chartData = screeningHistory.map((s: Screening) => ({
    date: formatShortDate(s.createdAt),
    Sistolik: s.systolic,
    Diastolik: s.diastolic,
    "Protein Urin": s.proteinUrin,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Welcome Banner */}
      <div className="card gradient-primary p-4 sm:p-6 text-white rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-bold">Halo, {patient.nama} 👋</h2>
          <p className="text-white/70 mt-1 text-xs sm:text-sm">
            Usia kehamilan: <strong>{patient.usiaKehamilan} minggu</strong> •{" "}
            Screening terakhir: {latestScreening ? formatDate(latestScreening.createdAt) : "Belum ada"}
          </p>

          {latestScreening && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 sm:px-4 sm:py-3">
                <div className="text-[10px] sm:text-xs text-white/60">Tekanan Darah</div>
                <div className="text-lg sm:text-xl font-bold">{latestScreening.systolic}/{latestScreening.diastolic} <span className="text-xs sm:text-sm font-normal text-white/60">mmHg</span></div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 sm:px-4 sm:py-3">
                <div className="text-[10px] sm:text-xs text-white/60">Protein Urin</div>
                <div className="text-lg sm:text-xl font-bold">{latestScreening.proteinUrin} <span className="text-xs sm:text-sm font-normal text-white/60">g/L</span></div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 sm:px-4 sm:py-3">
                <div className="text-[10px] sm:text-xs text-white/60">Status Risiko</div>
                <div className="text-lg sm:text-xl font-bold">{getRiskLabel(latestScreening.aiResult)}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 sm:px-4 sm:py-3">
                <div className="text-[10px] sm:text-xs text-white/60">Confidence AI</div>
                <div className="text-lg sm:text-xl font-bold">{Math.round(latestScreening.confidence * 100)}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <div className="card p-4 sm:p-6 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Tekanan Darah</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" domain={[60, 180]} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Sistolik"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ fill: "#EF4444", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Diastolik"
                  stroke="#0EA5E9"
                  strokeWidth={2.5}
                  dot={{ fill: "#0EA5E9", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Reference lines info */}
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-red-400" />
              Normal Sistolik: &lt;120
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-blue-400" />
              Normal Diastolik: &lt;80
            </div>
          </div>
        </div>

        {/* Protein Urin Chart */}
        <div className="card p-4 sm:p-6 animate-fadeIn delay-100">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-[#0EA5E9]" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Protein Urin</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="proteinGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Protein Urin"
                  stroke="#0EA5E9"
                  strokeWidth={2.5}
                  fill="url(#proteinGradient)"
                  dot={{ fill: "#0EA5E9", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              Batas normal: &lt;0.3 g/L
            </div>
          </div>
        </div>
      </div>

      {/* Screening History Table */}
      <div className="card p-4 sm:p-6 animate-fadeIn delay-200">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Riwayat Screening</h3>
        </div>
        <div className="table-container -mx-4 sm:mx-0 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Sistolik</th>
                <th>Diastolik</th>
                <th>Protein Urin</th>
                <th>Hasil AI</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {screeningHistory.map((s: Screening) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(s.createdAt)}
                    </div>
                  </td>
                  <td><span className="font-mono">{s.systolic}</span></td>
                  <td><span className="font-mono">{s.diastolic}</span></td>
                  <td><span className="font-mono">{s.proteinUrin} g/L</span></td>
                  <td>
                    <span className={`badge ${s.aiResult === "HIGH" ? "risk-high" : s.aiResult === "MEDIUM" ? "risk-medium" : "risk-low"} whitespace-nowrap`}>
                      {getRiskLabel(s.aiResult)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.confidence * 100}%`,
                            background: getRiskColor(s.aiResult),
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(s.confidence * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral Status */}
      {patientReferrals.length > 0 && (
        <div className="card p-4 sm:p-6 animate-fadeIn delay-300">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-[#0EA5E9]" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Status Rujukan</h3>
          </div>
          <div className="space-y-3">
            {patientReferrals.map((r: Referral) => (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">
                    {r.fromFacility?.name} → {r.toFacility?.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{r.notes}</div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-2">
                    <Clock className="w-3 h-3" />
                    {formatDate(r.createdAt)}
                  </div>
                </div>
                <span
                  className="badge self-start sm:self-auto text-xs whitespace-nowrap"
                  style={{
                    background: getReferralStatusColor(r.status) + "20",
                    color: getReferralStatusColor(r.status),
                    border: `1px solid ${getReferralStatusColor(r.status)}40`,
                  }}
                >
                  {getReferralStatusLabel(r.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
