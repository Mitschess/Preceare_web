"use client";

import { BarChart3, Heart, Search, TrendingUp, Calendar } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const allScreenings = getPatientScreenings(selectedPatientId);
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Filter by date range
  const screeningHistory = allScreenings.filter((s) => {
    const d = new Date(s.createdAt);
    if (startDate && d < new Date(startDate)) return false;
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }
    return true;
  });

  const chartData = screeningHistory.map((s) => ({
    date: formatShortDate(s.createdAt),
    Sistolik: s.systolic,
    Diastolik: s.diastolic,
    "Protein Urin": s.proteinUrin,
  }));

  // Filter patients by search
  const filteredPatients = patients.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nik.includes(searchQuery)
  );

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Monitoring Pasien</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pantau perkembangan tekanan darah dan protein urin selama kehamilan
        </p>
      </div>

      {/* Patient selector & Date range */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Patient search */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Pilih Pasien</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NIK pasien..."
                className="input !pl-11"
              />
            </div>
            {searchQuery && (
              <div className="mt-1 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex justify-between items-center ${
                      selectedPatientId === p.id ? "bg-blue-50 text-[#0EA5E9]" : "text-gray-700"
                    }`}
                  >
                    <span className="font-medium">{p.nama}</span>
                    <span className="text-xs text-gray-400">{p.usiaKehamilan} minggu</span>
                  </button>
                ))}
                {filteredPatients.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">Pasien tidak ditemukan</div>
                )}
              </div>
            )}
          </div>

          {/* Date range */}
          <div className="flex gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Dari Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input !pl-10 !w-44"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sampai Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input !pl-10 !w-44"
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="btn btn-ghost !text-xs !py-2 !px-3 border border-gray-200 text-gray-500"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Selected patient info */}
        {selectedPatient && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500">
            <span>
              Pasien: <strong className="text-gray-900">{selectedPatient.nama}</strong>
            </span>
            <span>·</span>
            <span>
              Usia Kehamilan: <strong>{selectedPatient.usiaKehamilan} minggu</strong>
            </span>
            <span>·</span>
            <span>{screeningHistory.length} kali screening</span>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-gray-900">Tren Tekanan Darah</h3>
          </div>
          <div className="h-72">
            {chartData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Tidak ada data pada rentang tanggal ini
              </div>
            )}
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
            {chartData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Tidak ada data pada rentang tanggal ini
              </div>
            )}
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
        {screeningHistory.length > 0 ? (
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
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            Tidak ada data screening pada rentang tanggal yang dipilih
          </div>
        )}
      </div>
    </div>
  );
}
