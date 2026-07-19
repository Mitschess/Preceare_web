"use client";

import { Database, ShieldAlert, Cpu, HardDrive, RefreshCw, Layers, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function AdminDatabasePage() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSyncing(false);
  };

  const schemaTables = [
    { name: "User", rows: 18, size: "32 KB" },
    { name: "Patient", rows: 6, size: "16 KB" },
    { name: "Screening", rows: 24, size: "64 KB" },
    { name: "RiskFactor", rows: 24, size: "48 KB" },
    { name: "Referral", rows: 3, size: "16 KB" },
    { name: "Facility", rows: 4, size: "12 KB" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database & Penyimpanan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Status PostgreSQL Engine, migrasi skema Prisma, dan data relasional tables.
          </p>
        </div>
        <button onClick={handleSync} className="btn btn-primary" disabled={syncing}>
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          Sinkronisasi Skema
        </button>
      </div>

      {/* Hardware / Engine indicators */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-5 bg-white space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <Cpu className="w-4 h-4" />
            KENDALI ENGINE
          </div>
          <div className="text-2xl font-bold text-gray-950">Active / Healty</div>
          <p className="text-xs text-gray-500">Koneksi Prisma ORM stabil, connection pool normal.</p>
        </div>

        <div className="card p-5 bg-white space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <HardDrive className="w-4 h-4" />
            PENYIMPANAN
          </div>
          <div className="text-2xl font-bold text-gray-950">128.4 MB / 10 GB</div>
          <p className="text-xs text-gray-500">Kapasitas aman di server cloud Railway.</p>
        </div>

        <div className="card p-5 bg-white space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
            <Layers className="w-4 h-4" />
            MIGRASI PRISMA
          </div>
          <div className="text-2xl font-bold text-gray-950">v1.2.0_latest</div>
          <p className="text-xs text-gray-500">Skema sinkron dengan model relasional data.</p>
        </div>
      </div>

      {/* Tables layout */}
      <div className="card p-6 bg-white space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Relasi Tabel Database</h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama Tabel</th>
                <th>Jumlah Baris (Rows)</th>
                <th>Ukuran Tabel</th>
                <th>Status Integritas</th>
              </tr>
            </thead>
            <tbody>
              {schemaTables.map((t) => (
                <tr key={t.name}>
                  <td>
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#0EA5E9]">
                      <Database className="w-4 h-4 text-gray-400" />
                      {t.name}
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-800 text-sm">{t.rows} Baris</span>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-800 text-sm">{t.size}</span>
                  </td>
                  <td>
                    <span className="badge bg-green-50 text-green-600 border border-green-100 uppercase text-[10px]">
                      SINKRON
                    </span>
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
