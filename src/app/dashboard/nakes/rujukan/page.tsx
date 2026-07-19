"use client";

import { Send, Clock, Building2, ArrowRight, Plus, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { referrals, patients, facilities } from "@/lib/mock-data";
import { getReferralStatusLabel, getReferralStatusColor, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function NakesRujukanPage() {
  const [showModal, setShowModal] = useState(false);

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock className="w-4 h-4" />,
    ACCEPTED: <CheckCircle className="w-4 h-4" />,
    IN_PROGRESS: <Loader className="w-4 h-4" />,
    COMPLETED: <CheckCircle className="w-4 h-4" />,
    REJECTED: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rujukan Pasien</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola rujukan pasien ke rumah sakit
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Rujukan Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Menunggu", count: referrals.filter((r) => r.status === "PENDING").length, color: "#F59E0B", bg: "bg-amber-50" },
          { label: "Diterima", count: referrals.filter((r) => r.status === "ACCEPTED").length, color: "#10B981", bg: "bg-green-50" },
          { label: "Dalam Proses", count: referrals.filter((r) => r.status === "IN_PROGRESS").length, color: "#0EA5E9", bg: "bg-blue-50" },
          { label: "Selesai", count: referrals.filter((r) => r.status === "COMPLETED").length, color: "#8B5CF6", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className={`card p-4 ${s.bg} border-none`}>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral List */}
      <div className="space-y-4">
        {referrals.map((r) => (
          <div key={r.id} className="card p-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900 text-lg">{r.patient?.nama}</span>
                  <span
                    className="badge"
                    style={{
                      background: getReferralStatusColor(r.status) + "15",
                      color: getReferralStatusColor(r.status),
                      border: `1px solid ${getReferralStatusColor(r.status)}40`,
                    }}
                  >
                    {statusIcons[r.status]}
                    {getReferralStatusLabel(r.status)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>{r.fromFacility?.name}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{r.toFacility?.name}</span>
                </div>

                {r.notes && (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl mt-2">
                    {r.notes}
                  </p>
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-400 justify-end">
                  <Clock className="w-3 h-3" />
                  {formatDate(r.createdAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Referral Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Buat Rujukan Baru</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pasien</label>
                <select className="input">
                  <option>— Pilih Pasien —</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rumah Sakit Tujuan</label>
                <select className="input">
                  <option>— Pilih Rumah Sakit —</option>
                  {facilities.filter((f) => f.type === "RUMAH_SAKIT").map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                <textarea className="input !h-24 resize-none" placeholder="Tulis catatan rujukan..." />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                Batal
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary">
                <Send className="w-4 h-4" />
                Kirim Rujukan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
