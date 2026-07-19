"use client";

import { Shield, Users, Building2, Brain, Database, AlertCircle, CheckCircle, RefreshCcw } from "lucide-react";
import { getDashboardStats } from "@/lib/mock-data";

export default function AdminDashboard() {
  const stats = getDashboardStats();

  const cards = [
    { label: "Pengguna Sistem", count: 18, desc: "Bidan, Dokter, Pasien", icon: Users, color: "text-[#0EA5E9]", bg: "bg-blue-50" },
    { label: "Fasilitas Kesehatan", count: 4, desc: "Puskesmas & Rumah Sakit", icon: Building2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Model AI Aktif", count: 1, desc: "XGBoost v1.4 (Active)", icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Ukuran Database", count: "128 MB", desc: "PostgreSQL Database", icon: Database, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Control Panel</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pusat integrasi, konfigurasi model AI, database PostgreSQL, dan manajemen pengguna PREECARE.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5 bg-white border-slate-100 flex items-start justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{c.count}</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">{c.label}</div>
              <div className="subtitle text-xs text-gray-400 mt-0.5">{c.desc}</div>
            </div>
            <div className={`w-11 h-11 rounded-2xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Integrity status */}
        <div className="lg:col-span-2 card p-6 bg-white space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Status Sistem & Layanan</h3>

          <div className="space-y-3">
            {[
              { svc: "Python FastAPI AI Model Service", host: "fastapi-inference-service", status: "ONLINE", lag: "140ms" },
              { svc: "PostgreSQL Database Engine", host: "local-rds-postgres", status: "ONLINE", lag: "12ms" },
              { svc: "Next.js 15 Backend API Gateway", host: "preecare-next-srv", status: "ONLINE", lag: "5ms" },
              { svc: "Email Notification SMTP Server", host: "mailgun-relay", status: "MAINTENANCE", lag: "—" },
            ].map((s) => (
              <div key={s.svc} className="flex justify-between items-center p-3.5 rounded-xl border border-gray-150">
                <div>
                  <div className="font-semibold text-gray-950 text-sm">{s.svc}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Instance: {s.host}</div>
                </div>

                <div className="text-right">
                  <span
                    className={`badge ${
                      s.status === "ONLINE" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {s.status}
                  </span>
                  <div className="text-[10px] text-gray-450 mt-1">Latency: {s.lag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync panel */}
        <div className="card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">Aktivitas Server</h3>
            <button className="btn btn-ghost !p-2 !rounded-xl">
              <RefreshCcw className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { type: "AI", text: "Model prediction triggered for pat-2 (conf: 87%)", time: "2 mnt lalu" },
              { type: "DB", text: "New screening row written under patient rat-3", time: "18 mnt lalu" },
              { type: "USR", text: "User nakes@preecare.id signed in successfully", time: "1 jam lalu" },
            ].map((l, i) => (
              <div key={i} className="flex justify-between gap-6 p-2 rounded hover:bg-slate-50 transition-colors">
                <span className="text-gray-600 line-clamp-1">{l.text}</span>
                <span className="text-gray-400 whitespace-nowrap">{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
