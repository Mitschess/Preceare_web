"use client";

import { FileText, Search, User, Calendar, History, ArrowRight } from "lucide-react";
import { patients, getPatientScreenings } from "@/lib/mock-data";
import { getRiskLabel, formatDate, calculateAge } from "@/lib/utils";
import { useState } from "react";

export default function DokterRiwayatPage() {
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const activePatient = patients.find((p) => p.id === selectedPatientId);
  const screenings = selectedPatientId ? getPatientScreenings(selectedPatientId) : [];

  const filteredPatients = patients.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nik.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Histori Pemeriksaan Pasien</h2>
        <p className="text-sm text-gray-500 mt-1">
          Cari pasien dan tinjau riwayat vital, faktor risiko, serta evaluasi AI sebelumnya.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: Search / select patient */}
        <div className="card p-6 bg-white space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pasien / NIK..."
              className="input !pl-11"
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[450px] pr-1">
            {filteredPatients.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  selectedPatientId === p.id
                    ? "border-[#0EA5E9] bg-blue-50/50"
                    : "border-gray-150 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{p.nama}</div>
                  <div className="text-xs text-gray-400 mt-0.5">NIK: {p.nik}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}

            {filteredPatients.length === 0 && (
              <div className="text-center py-6 text-xs text-gray-400">
                Pasien tidak ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Patient historical screenings */}
        <div className="lg:col-span-2 space-y-6">
          {activePatient ? (
            <div className="card p-6 bg-white space-y-6">
              {/* Profile head */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-150">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{activePatient.nama}</h3>
                    <p className="text-xs text-gray-500">
                      Usia: {calculateAge(activePatient.tanggalLahir)} tahun • Kehamilan: {activePatient.usiaKehamilan} minggu
                    </p>
                  </div>
                </div>
              </div>

              {/* History list */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-400" />
                  Semua Screening Medis
                </h4>

                <div className="space-y-3">
                  {screenings.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-gray-150 bg-slate-50/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(s.createdAt)}
                        </span>
                        <span className={`badge ${s.aiResult === "HIGH" ? "risk-high" : s.aiResult === "MEDIUM" ? "risk-medium" : "risk-low"}`}>
                          {getRiskLabel(s.aiResult)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-gray-400">Tekanan Darah</div>
                          <div className="font-semibold text-gray-900">{s.systolic}/{s.diastolic} mmHg</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Protein Urin</div>
                          <div className="font-semibold text-gray-900">{s.proteinUrin} g/L</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Confidence AI</div>
                          <div className="font-semibold text-gray-900">{Math.round(s.confidence * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {screenings.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Belum ada data screening untuk pasien ini.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-16 text-center bg-white space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Pilih Pasien</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Pilih pasien dari panel kiri untuk meninjau riwayat pemeriksaan klinis lengkap mereka.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
