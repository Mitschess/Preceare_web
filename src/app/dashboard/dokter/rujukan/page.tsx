"use client";

import { ClipboardList, CheckCircle, XCircle, Eye, Building2, Scroll, Heart } from "lucide-react";
import { referrals } from "@/lib/mock-data";
import { getReferralStatusLabel, getReferralStatusColor, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function DokterRujukanPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "ACCEPTED">("ALL");
  const [mockReferralList, setMockReferralList] = useState(referrals);

  const handleUpdateStatus = (id: string, nextStatus: "ACCEPTED" | "REJECTED") => {
    setMockReferralList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
  };

  const filtered = mockReferralList.filter((r) => {
    if (activeTab === "ALL") return true;
    return r.status === activeTab;
  });

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Daftar Pasien Rujukan Masuk</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tinjau dokumen diagnosa awal dan koordinasikan tindakan medis lanjutan.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: "ALL", label: "Semua Rujukan" },
          { key: "PENDING", label: "Menunggu" },
          { key: "ACCEPTED", label: "Diterima" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-[#0EA5E9] text-[#0EA5E9]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards list */}
      <div className="space-y-4">
        {filtered.map((ref) => (
          <div key={ref.id} className="card p-6 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-gray-900">{ref.patient?.nama}</h3>
                  <span className="text-xs text-gray-400">NIK: {ref.patient?.nik}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  Puskesmas: {ref.fromFacility?.name} • Usia Kehamilan: {ref.patient?.usiaKehamilan} minggu
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="badge"
                  style={{
                    background: getReferralStatusColor(ref.status) + "15",
                    color: getReferralStatusColor(ref.status),
                  }}
                >
                  {getReferralStatusLabel(ref.status)}
                </span>
                <span className="text-xs text-gray-400">{formatDate(ref.createdAt)}</span>
              </div>
            </div>

            {/* Diagnostics note */}
            {ref.notes && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Scroll className="w-3.5 h-3.5 text-slate-400" />
                  Catatan Pengantar Bidan / Nakes:
                </div>
                <p className="text-sm text-slate-600 italic">&quot;{ref.notes}&quot;</p>
              </div>
            )}

            {/* Actions for Doctor */}
            {ref.status === "PENDING" && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => handleUpdateStatus(ref.id, "REJECTED")}
                  className="btn btn-ghost text-red-500 border border-red-100 hover:bg-red-50 hover:text-red-600"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak
                </button>
                <button
                  onClick={() => handleUpdateStatus(ref.id, "ACCEPTED")}
                  className="btn btn-primary"
                >
                  <CheckCircle className="w-4 h-4" />
                  Terima Rujukan
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Tidak ada rujukan untuk kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
