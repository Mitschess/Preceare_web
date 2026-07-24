"use client";

import {
  Users,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Send,
  Brain,
  Stethoscope,
  Scale,
  Eye,
} from "lucide-react";
import {
  patients,
  screenings,
  referrals,
  getDashboardStats,
  getLatestScreening,
} from "@/lib/mock-data";
import { getRiskLabel, formatDateTime, formatProteinUrin, cn } from "@/lib/utils";
import Link from "next/link";

export default function NakesDashboard() {
  const stats = getDashboardStats();

  const statCards = [
    {
      title: "Total Pasien",
      value: stats.totalPatients,
      icon: Users,
      gradient: "gradient-card-blue",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+12%",
      up: true,
    },
    {
      title: "Screening Hari Ini",
      value: stats.totalScreenings,
      icon: Activity,
      gradient: "gradient-card-green",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+8%",
      up: true,
    },
    {
      title: "Risiko Tinggi",
      value: stats.highRiskCount,
      icon: AlertTriangle,
      gradient: "gradient-card-red",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      change: "+2",
      up: true,
    },
    {
      title: "Menunggu Rujukan",
      value: stats.pendingReferrals,
      icon: Send,
      gradient: "gradient-card-amber",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      change: "-1",
      up: false,
    },
  ];

  const recentScreenings = screenings.slice(0, 8);

  return (
    <div className="w-full space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Puskesmas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang! Berikut ringkasan data hari ini.
          </p>
        </div>
        <Link href="/dashboard/nakes/screening" className="btn btn-primary">
          <Activity className="w-4 h-4" />
          Screening Baru
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.title}
            className={`card p-5 ${card.gradient} border-none animate-fadeIn`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${card.up ? "text-green-600" : "text-red-500"}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-500 mt-1">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="card p-6 animate-fadeIn delay-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Risiko</h3>
          <div className="space-y-4">
            {[
              { label: "Risiko Rendah", count: stats.lowRiskCount, total: stats.totalPatients, color: "#10B981", bg: "bg-green-50" },
              { label: "Risiko Sedang", count: stats.mediumRiskCount, total: stats.totalPatients, color: "#F59E0B", bg: "bg-amber-50" },
              { label: "Risiko Tinggi", count: stats.highRiskCount, total: stats.totalPatients, color: "#EF4444", bg: "bg-red-50" },
            ].map((risk) => {
              const pct = Math.round((risk.count / risk.total) * 100);
              return (
                <div key={risk.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{risk.label}</span>
                    <span className="text-gray-500">{risk.count} pasien ({pct}%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%`, background: risk.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk summary circles */}
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
            {[
              { label: "Low", count: stats.lowRiskCount, color: "#10B981" },
              { label: "Medium", count: stats.mediumRiskCount, color: "#F59E0B" },
              { label: "High", count: stats.highRiskCount, color: "#EF4444" },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-1"
                  style={{ background: r.color }}
                >
                  {r.count}
                </div>
                <div className="text-xs text-gray-500">{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Screenings with enhanced data (8D: Hasil sensor, Hasil AI, Confidence Score) */}
        <div className="lg:col-span-2 card p-6 animate-fadeIn delay-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Screening Terbaru</h3>
            <Link href="/dashboard/nakes/screening" className="text-sm text-[#0EA5E9] font-medium hover:underline">
              Lihat Semua →
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Pasien</th>
                  <th>TD (mmHg)</th>
                  <th>Protein Urin</th>
                  <th>AI Result</th>
                  <th>Confidence</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentScreenings.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="font-medium text-gray-900">{s.patient?.nama}</div>
                    </td>
                    <td>
                      <span className="font-mono text-sm">
                        {s.systolic}/{s.diastolic}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-sm">{formatProteinUrin(s.proteinUrin)}</span>
                    </td>
                    <td>
                      <span className={`badge ${s.aiResult === "HIGH" ? "risk-high" : s.aiResult === "MEDIUM" ? "risk-medium" : "risk-low"}`}>
                        {getRiskLabel(s.aiResult)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.confidence * 100}%`,
                              background: s.confidence > 0.85 ? "#10B981" : s.confidence > 0.7 ? "#F59E0B" : "#EF4444",
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(s.confidence * 100)}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(s.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Alert Cards — Enhanced with anamnesis detail (8D requirements) */}
      <div className="card p-6 animate-fadeIn delay-500">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-gray-900">Pasien Perlu Perhatian</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients
            .map((p) => ({ ...p, latest: getLatestScreening(p.id) }))
            .filter((p) => p.latest && (p.latest.aiResult === "HIGH" || p.latest.aiResult === "MEDIUM"))
            .map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border-2 ${
                  p.latest!.aiResult === "HIGH"
                    ? "border-red-200 bg-red-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{p.nama}</div>
                    <div className="text-xs text-gray-500">
                      Usia Kehamilan: {p.usiaKehamilan} minggu
                    </div>
                  </div>
                  <span className={`badge ${p.latest!.aiResult === "HIGH" ? "risk-high" : "risk-medium"}`}>
                    {getRiskLabel(p.latest!.aiResult)}
                  </span>
                </div>

                {/* Sensor Results */}
                <div className="flex gap-4 text-sm mb-3">
                  <div>
                    <div className="text-gray-500 text-xs">TD</div>
                    <div className="font-semibold">{p.latest!.systolic}/{p.latest!.diastolic}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Protein</div>
                    <div className="font-semibold text-xs">{formatProteinUrin(p.latest!.proteinUrin)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Confidence</div>
                    <div className="font-semibold">{Math.round(p.latest!.confidence * 100)}%</div>
                  </div>
                </div>

                {/* Detail Anamnesis (8D requirement) */}
                {p.latest!.riskFactors && (
                  <div className="border-t border-gray-200/50 pt-2 mt-2">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Anamnesis</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Usia</span>
                        <span className="font-medium">{p.latest!.riskFactors.usiaIbu} thn</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">BMI</span>
                        <span className="font-medium">{p.latest!.riskFactors.bmi.toFixed(1)}</span>
                      </div>
                      {[
                        { l: "Diabetes", v: p.latest!.riskFactors.diabetes },
                        { l: "Hipertensi", v: p.latest!.riskFactors.hipertensi },
                        { l: "Rw. Preeklamsia", v: p.latest!.riskFactors.riwayatPreeklamsia },
                        { l: "Rw. Keluarga", v: p.latest!.riskFactors.riwayatKeluarga },
                        { l: "Ginjal", v: p.latest!.riskFactors.penyakitGinjal },
                        { l: "Nullipara", v: p.latest!.riskFactors.kehamilanPertama },
                      ].filter(f => f.v).map((f) => (
                        <div key={f.l} className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          <span className="text-gray-700">{f.l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action: Rujuk (8D requirement) */}
                {p.latest!.aiResult === "HIGH" && (
                  <div className="mt-3 pt-2 border-t border-gray-200/50">
                    <Link
                      href="/dashboard/nakes/rujukan"
                      className="w-full btn btn-danger text-xs !py-2"
                    >
                      <Send className="w-3 h-3" />
                      Rujuk ke Rumah Sakit
                    </Link>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Riwayat Pemeriksaan Quick View (8D: Riwayat pemeriksaan) */}
      <div className="card p-6 animate-fadeIn delay-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#0EA5E9]" />
            <h3 className="text-lg font-bold text-gray-900">Daftar Pasien</h3>
          </div>
          <Link href="/dashboard/nakes/pasien" className="text-sm text-[#0EA5E9] font-medium hover:underline">
            Lihat Semua →
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pasien</th>
                <th>NIK</th>
                <th>Usia Kehamilan</th>
                <th>Hasil Terakhir</th>
                <th>Confidence</th>
                <th>Screening</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const latest = getLatestScreening(p.id);
                const patientScreenings = screenings.filter(s => s.patientId === p.id);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="font-medium text-gray-900">{p.nama}</div>
                      <div className="text-xs text-gray-400">{p.alamat.split(",")[0]}</div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-gray-600">{p.nik}</span>
                    </td>
                    <td>
                      <span className="text-sm">{p.usiaKehamilan} minggu</span>
                    </td>
                    <td>
                      {latest ? (
                        <span className={`badge ${latest.aiResult === "HIGH" ? "risk-high" : latest.aiResult === "MEDIUM" ? "risk-medium" : "risk-low"}`}>
                          {getRiskLabel(latest.aiResult)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      {latest ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Brain className="w-3 h-3 text-[#0EA5E9]" />
                            <span className="text-sm font-semibold">{Math.round(latest.confidence * 100)}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs text-gray-500">{patientScreenings.length}x pemeriksaan</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
