"use client";

import { BarChart3, Heart, Search, TrendingUp } from "lucide-react";
import { patients, getPatientScreenings } from "@/lib/mock-data";
import { getRiskLabel, getRiskColor, formatShortDate } from "@/lib/utils";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonitoringPage() {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");

  const screeningHistory = getPatientScreenings(selectedPatientId);
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const chartData = screeningHistory.map((s) => ({
    date: formatShortDate(s.createdAt),
    Sistolik: s.systolic,
    Diastolik: s.diastolic,
    "Protein Urin": s.proteinUrin,
  }));

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Monitoring Pasien</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pantau perkembangan tekanan darah dan protein urin selama kehamilan
        </p>
      </div>

      {/* Patient selector */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="input !pl-11"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} — {p.usiaKehamilan} minggu
                </option>
              ))}
            </select>
          </div>
          {selectedPatient && (
            <div className="text-sm text-gray-500">
              Usia Kehamilan: <strong>{selectedPatient.usiaKehamilan} minggu</strong> ·{" "}
              {screeningHistory.length} kali screening
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-900">Tren Tekanan Darah</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" domain={[60, 180]} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line type="monotone" dataKey="Sistolik" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Diastolik" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-600">Sistolik</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
              <span className="text-gray-600">Diastolik</span>
            </div>
          </div>
        </div>

        <div className="card p-6 animate-fadeIn delay-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#0EA5E9]" />
            <h3 className="font-bold text-gray-900">Tren Protein Urin</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line type="monotone" dataKey="Protein Urin" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-gray-600">Protein Urin (g/L)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screening History Table */}
      <div className="card p-6 animate-fadeIn delay-200">
        <h3 className="font-bold text-gray-900 mb-4">Detail Screening</h3>
        <div className="table-container">
          <table>
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
              {screeningHistory.map((s) => (
                <tr key={s.id}>
                  <td className="text-sm">{formatShortDate(s.createdAt)}</td>
                  <td className="font-mono text-sm">{s.systolic}</td>
                  <td className="font-mono text-sm">{s.diastolic}</td>
                  <td className="font-mono text-sm">{s.proteinUrin} g/L</td>
                  <td>
                    <span className={`badge ${s.aiResult === "HIGH" ? "risk-high" : s.aiResult === "MEDIUM" ? "risk-medium" : "risk-low"}`}>
                      {getRiskLabel(s.aiResult)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.confidence * 100}%`, background: getRiskColor(s.aiResult) }} />
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
    </div>
  );
}
