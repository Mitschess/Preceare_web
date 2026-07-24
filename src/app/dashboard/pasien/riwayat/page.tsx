"use client";

import { FileText, Download, Calendar, Filter, Heart, Droplets } from "lucide-react";
import { patients, getPatientScreenings } from "@/lib/mock-data";
import { getRiskLabel, formatDate, formatShortDate, formatProteinUrin } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function PasienRiwayatPage() {
  const patient = patients[0];
  const screenings = getPatientScreenings(patient.id);

  const chartData = screenings.map((s) => ({
    date: formatShortDate(s.createdAt),
    Sistolik: s.systolic,
    Diastolik: s.diastolic,
    "Protein Urin": s.proteinUrin,
  }));

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Histori Kesehatan Anda</h2>
          <p className="text-sm text-gray-500 mt-1">
            Data pemantauan tekanan darah dan kadar protein urin dari awal kehamilan.
          </p>
        </div>
        <button className="btn btn-outline border-slate-200 text-slate-700 hover:bg-slate-50">
          <Download className="w-4 h-4" />
          Ekspor PDF
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left side: chart and table */}
        <div className="lg:col-span-2 space-y-6">
          {/* BP trend */}
          <div className="card p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-gray-900">Grafik Tekanan Darah</h3>
            </div>
            <div className="h-64">
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
                    }}
                  />
                  <Line type="monotone" dataKey="Sistolik" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Diastolik" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table history */}
          <div className="card p-6 bg-white">
            <h3 className="font-bold text-gray-900 mb-4">Daftar Pemeriksaan</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Waktu Pemeriksaan</th>
                    <th>Tekanan Darah</th>
                    <th>Protein Urin</th>
                    <th>AI Risiko</th>
                  </tr>
                </thead>
                <tbody>
                  {screenings.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(s.createdAt)}
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-sm font-semibold">
                          {s.systolic}/{s.diastolic} <span className="text-xs text-gray-400 font-normal">mmHg</span>
                        </span>
                      </td>
                      <td>
                        <span className="font-mono text-sm font-semibold">
                          {formatProteinUrin(s.proteinUrin)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${s.aiResult === "HIGH" ? "risk-high" : s.aiResult === "MEDIUM" ? "risk-medium" : "risk-low"}`}>
                          {getRiskLabel(s.aiResult)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side: Summary and education */}
        <div className="space-y-6">
          <div className="card p-6 bg-white">
            <h3 className="font-bold text-gray-900 mb-4">Ringkasan Kesehatan</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                <span className="text-sm text-gray-500">Total Kunjungan</span>
                <span className="text-sm font-bold text-gray-900">{screenings.length} Kali</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                <span className="text-sm text-gray-500">TD Rerata</span>
                <span className="text-sm font-bold text-gray-900">
                  {Math.round(screenings.reduce((acc, s) => acc + s.systolic, 0) / screenings.length)}/
                  {Math.round(screenings.reduce((acc, s) => acc + s.diastolic, 0) / screenings.length)} mmHg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Protein Urin Rerata</span>
                <span className="text-sm font-bold text-gray-900">
                  {(
                    screenings.reduce(
                      (acc, s) => acc + (typeof s.proteinUrin === "number" ? s.proteinUrin : parseFloat(String(s.proteinUrin)) || 0),
                      0
                    ) / screenings.length
                  ).toFixed(2)} g/L
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6 gradient-primary text-white border-none">
            <h4 className="font-bold text-lg mb-2">Tips Sehat Preeklamsia</h4>
            <ul className="text-sm text-white/80 space-y-2 list-disc list-inside">
              <li>Batasi konsumsi garam berlebih.</li>
              <li>Lakukan istirahat yang cukup minimal 8 jam sehari.</li>
              <li>Periksa tekanan darah secara teratur sesuai arahan Bidan/Dokter.</li>
              <li>Segera hubungi faskes terdekat jika sakit kepala hebat atau gangguan penglihatan.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
