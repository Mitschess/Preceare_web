"use client";

import { Send, Clock, Building2, ArrowRight, Plus, CheckCircle, AlertCircle, Loader, X, XCircle, AlertTriangle } from "lucide-react";
import { referrals, patients, facilities } from "@/lib/mock-data";
import { getReferralStatusLabel, getReferralStatusColor, formatDate } from "@/lib/utils";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RujukanContent() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [referralList, setReferralList] = useState(referrals);

  // Controlled form states
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [notes, setNotes] = useState("");

  const [cancelModalReferralId, setCancelModalReferralId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock className="w-4 h-4" />,
    ACCEPTED: <CheckCircle className="w-4 h-4" />,
    IN_PROGRESS: <Loader className="w-4 h-4 animate-spin" />,
    COMPLETED: <CheckCircle className="w-4 h-4" />,
    REJECTED: <X className="w-4 h-4" />,
    CANCELLED: <XCircle className="w-4 h-4 text-slate-500" />,
  };

  const handleConfirmCancel = () => {
    if (!cancelModalReferralId) return;
    setReferralList((prev) =>
      prev.map((r) => {
        if (r.id === cancelModalReferralId) {
          const addedNotes = cancelReason ? `\n\n[Dibatalkan oleh Nakes]: ${cancelReason}` : "\n\n[Dibatalkan oleh Nakes]";
          return {
            ...r,
            status: "CANCELLED",
            notes: (r.notes || "") + addedNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    setCancelModalReferralId(null);
    setCancelReason("");
  };

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    const openModal = searchParams.get("openModal");
    const systolic = searchParams.get("systolic");
    const diastolic = searchParams.get("diastolic");
    const proteinUrin = searchParams.get("proteinUrin");
    const confidence = searchParams.get("confidence");

    if (openModal === "true" && patientId) {
      setSelectedPatientId(patientId);
      setShowModal(true);

      // Pre-fill notes with CDSS analysis
      let autoNotes = "Rujukan otomatis dari skrining Hybrid CDSS PREECARE.\n";
      if (systolic && diastolic) {
        autoNotes += `• Tekanan Darah: ${systolic}/${diastolic} mmHg (Risiko Tinggi)\n`;
      }
      if (proteinUrin) {
        autoNotes += `• Protein Urin: ${proteinUrin} g/L\n`;
      }
      if (confidence) {
        autoNotes += `• Confidence AI: ${confidence}%\n`;
      }
      autoNotes += "• Rekomendasi: Segera lakukan pemeriksaan penunjang di faskes lanjutan.";
      setNotes(autoNotes);
    }
  }, [searchParams]);

  const handleSubmitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedFacilityId) return;

    const patient = patients.find((p) => p.id === selectedPatientId);
    const toFacility = facilities.find((f) => f.id === selectedFacilityId);
    const fromFacility = facilities.find((f) => f.type === "PUSKESMAS") || facilities[0];

    // Create a new mock referral item
    const newReferral = {
      id: `ref-${Date.now()}`,
      patientId: selectedPatientId,
      fromFacilityId: fromFacility.id,
      toFacilityId: selectedFacilityId,
      status: "PENDING" as const,
      notes: notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patient,
      fromFacility,
      toFacility,
    };

    setReferralList([newReferral, ...referralList]);
    setShowModal(false);

    // Reset Form
    setSelectedPatientId("");
    setSelectedFacilityId("");
    setNotes("");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rujukan Pasien</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola rujukan pasien ke rumah sakit secara digital
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
          { label: "Menunggu", count: referralList.filter((r) => r.status === "PENDING").length, color: "#F59E0B", bg: "bg-amber-50" },
          { label: "Diterima", count: referralList.filter((r) => r.status === "ACCEPTED").length, color: "#10B981", bg: "bg-green-50" },
          { label: "Dalam Proses", count: referralList.filter((r) => r.status === "IN_PROGRESS").length, color: "#0EA5E9", bg: "bg-blue-50" },
          { label: "Selesai", count: referralList.filter((r) => r.status === "COMPLETED").length, color: "#8B5CF6", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className={`card p-4 ${s.bg} border-none`}>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral List */}
      <div className="space-y-4">
        {referralList.map((r) => (
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
                    {statusIcons[r.status] || <Clock className="w-4 h-4" />}
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
                  <p className="text-sm text-gray-550 bg-gray-50 p-3 rounded-xl mt-2 whitespace-pre-line border border-gray-100">
                    {r.notes}
                  </p>
                )}
              </div>

              <div className="text-right flex flex-col items-end justify-between gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(r.createdAt)}
                </div>

                {(r.status === "PENDING" || r.status === "IN_PROGRESS") && (
                  <button
                    onClick={() => {
                      setCancelModalReferralId(r.id);
                      setCancelReason("");
                    }}
                    className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Batalkan Rujukan
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalReferralId && (
        <div className="modal-overlay" onClick={() => setCancelModalReferralId(null)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Batalkan Rujukan Pasien?</h3>
                <p className="text-xs text-gray-500">Tindakan ini akan mengubah status rujukan menjadi Dibatalkan.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Alasan Pembatalan (Opsional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Contoh: Kondisi pasien membaik, kesalahan memilih rumah sakit tujuan..."
                  className="input !h-24 resize-none text-xs py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalReferralId(null)}
                  className="btn btn-ghost text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="btn bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  Ya, Batalkan Rujukan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Referral Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Buat Rujukan Baru</h3>

            <form onSubmit={handleSubmitReferral} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pasien</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="input"
                >
                  <option value="">— Pilih Pasien —</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rumah Sakit Tujuan</label>
                <select
                  required
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="input"
                >
                  <option value="">— Pilih Rumah Sakit —</option>
                  {facilities.filter((f) => f.type === "RUMAH_SAKIT").map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Rujukan</label>
                <textarea
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input !h-32 resize-none leading-relaxed py-2.5 font-serif"
                  placeholder="Tulis catatan rujukan (misal: Tekanan darah sistolik tinggi)..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send className="w-4 h-4" />
                  Kirim Rujukan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NakesRujukanPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-gray-500">
        Memuat halaman rujukan...
      </div>
    }>
      <RujukanContent />
    </Suspense>
  );
}
