"use client";

import { Users, Search, Filter, Eye } from "lucide-react";
import { patients, getLatestScreening } from "@/lib/mock-data";
import { getRiskLabel, formatDate, calculateAge } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function NakesPasienPage() {
  const [search, setSearch] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nik.includes(search)
  );

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daftar Pasien</h2>
          <p className="text-sm text-gray-500 mt-1">
            {patients.length} pasien terdaftar
          </p>
        </div>
        <button className="btn btn-primary">
          <Users className="w-4 h-4" />
          Registrasi Pasien
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIK..."
            className="input !pl-11"
          />
        </div>
        <button className="btn btn-ghost border border-gray-200">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Patient Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const latest = getLatestScreening(p.id);
          return (
            <div key={p.id} className="card p-5 animate-fadeIn hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{p.nama}</h4>
                  <p className="text-xs text-gray-500">NIK: {p.nik}</p>
                </div>
                {latest && (
                  <span
                    className={`badge ${
                      latest.aiResult === "HIGH"
                        ? "risk-high"
                        : latest.aiResult === "MEDIUM"
                        ? "risk-medium"
                        : "risk-low"
                    }`}
                  >
                    {getRiskLabel(latest.aiResult)}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Usia</span>
                  <span>{calculateAge(p.tanggalLahir)} tahun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Usia Kehamilan</span>
                  <span>{p.usiaKehamilan} minggu</span>
                </div>
                {latest && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TD Terakhir</span>
                      <span className="font-mono">
                        {latest.systolic}/{latest.diastolic} mmHg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Screening Terakhir</span>
                      <span>{formatDate(latest.createdAt)}</span>
                    </div>
                  </>
                )}
              </div>

              <button className="btn btn-ghost w-full !text-[#0EA5E9] border border-gray-200 hover:border-[#0EA5E9]">
                <Eye className="w-4 h-4" />
                Detail
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
