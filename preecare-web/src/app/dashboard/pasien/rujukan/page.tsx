"use client";

import { Send, Building2, Calendar, ShieldAlert, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { patients, getPatientReferrals } from "@/lib/mock-data";
import { getReferralStatusLabel, getReferralStatusColor, formatDate } from "@/lib/utils";

export default function PasienRujukanPage() {
  const patient = patients[0];
  const referrals = getPatientReferrals(patient.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rujukan Aktif Anda</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pantau status rujukan bidan ke Rumah Sakit rujukan jika terdeteksi risiko preeklamsia tinggi.
        </p>
      </div>

      {referrals.length === 0 ? (
        <div className="card p-12 text-center bg-white space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Tidak Ada Rujukan Aktif</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Status kesehatan Anda saat ini dalam pemantauan rutin dan tidak memerlukan rujukan darurat ke rumah sakit.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {referrals.map((ref) => (
            <div key={ref.id} className="card p-6 bg-white space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-150">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-[#0EA5E9]">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Kode Rujukan</div>
                    <div className="text-sm font-bold text-gray-900">{ref.id.toUpperCase()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="badge"
                    style={{
                      background: getReferralStatusColor(ref.status) + "15",
                      color: getReferralStatusColor(ref.status),
                      border: `1px solid ${getReferralStatusColor(ref.status)}30`,
                    }}
                  >
                    {getReferralStatusLabel(ref.status)}
                  </span>
                </div>
              </div>

              {/* Steps/Route */}
              <div className="grid sm:grid-cols-3 gap-6 items-center">
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Puskesmas Pengirim
                  </div>
                  <div className="font-semibold text-gray-900">{ref.fromFacility?.name}</div>
                  <div className="text-xs text-gray-500">{ref.fromFacility?.address}</div>
                </div>

                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-gray-500">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Rumah Sakit Rujukan
                  </div>
                  <div className="font-semibold text-gray-900">{ref.toFacility?.name}</div>
                  <div className="text-xs text-gray-500">{ref.toFacility?.address}</div>
                </div>
              </div>

              {/* Notes */}
              {ref.notes && (
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100/50">
                  <div className="flex gap-2">
                    <ShieldAlert className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-orange-800">Catatan Medis Rujukan</div>
                      <p className="text-xs text-orange-700/90 mt-1">{ref.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-xs text-gray-400 flex items-center gap-1 pt-2">
                <Calendar className="w-3.5 h-3.5" />
                Tanggal Rujukan dibuat: {formatDate(ref.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
