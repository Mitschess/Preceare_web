"use client";

import { ClipboardList, Users, ShieldAlert, CheckCircle, Clock, Building2, ChevronRight, Activity } from "lucide-react";
import { referrals, getDashboardStats } from "@/lib/mock-data";
import { getReferralStatusColor, getReferralStatusLabel, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DokterDashboard() {
  const stats = getDashboardStats();

  const activeReferralsCount = referrals.filter(
    (r) => r.status === "PENDING" || r.status === "IN_PROGRESS"
  ).length;

  return (
    <div className="w-full space-y-6">
      {/* Welcome doctor */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Rumah Sakit</h2>
        <p className="text-sm text-gray-500 mt-1">
          Berikut adalah kelola rujukan pasien preeklamsia masuk.
        </p>
      </div>

      {/* RS stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Rujukan Aktif", count: activeReferralsCount, icon: ClipboardList, color: "text-[#0EA5E9]", bg: "bg-blue-50" },
          { label: "Pasien Diterima", count: referrals.filter((r) => r.status === "ACCEPTED").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Total Kasus Rujukan", count: referrals.length, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="card p-5 bg-white flex items-center justify-between border-slate-100">
            <div>
              <div className="text-3xl font-bold text-gray-900">{s.count}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main split */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left list: Incoming referrals */}
        <div className="lg:col-span-2 card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">Rujukan Baru Masuk</h3>
            <Link href="/dashboard/dokter/rujukan" className="text-sm text-[#0EA5E9] font-medium hover:underline">
              Semua Rujukan →
            </Link>
          </div>

          <div className="space-y-3">
            {referrals
              .filter((r) => r.status === "PENDING" || r.status === "IN_PROGRESS")
              .map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 rounded-xl border border-gray-150 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{ref.patient?.nama}</span>
                      <span className="text-xs text-gray-500">({ref.patient?.usiaKehamilan} minggu)</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Asal: {ref.fromFacility?.name}
                    </div>

                    <p className="text-xs text-slate-500 italic mt-2 line-clamp-1">
                      &quot;{ref.notes}&quot;
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end gap-2 justify-between">
                    <span
                      className="badge"
                      style={{
                        background: getReferralStatusColor(ref.status) + "15",
                        color: getReferralStatusColor(ref.status),
                      }}
                    >
                      {getReferralStatusLabel(ref.status)}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatDate(ref.createdAt)}</span>
                  </div>
                </div>
              ))}

            {referrals.filter((r) => r.status === "PENDING" || r.status === "IN_PROGRESS").length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Tidak ada rujukan baru.
              </div>
            )}
          </div>
        </div>

        {/* Right side: High alert list */}
        <div className="card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">Urgensi Kasus</h3>
          </div>

          <div className="space-y-3">
            {referrals
              .filter((r) => r.patient?.id === "pat-2" || r.patient?.id === "pat-4") // high risk patients in seed
              .map((ref) => (
                <div key={ref.id} className="p-3.5 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{ref.patient?.nama}</div>
                    <div className="text-[11px] text-red-800 font-semibold mt-0.5">
                      Risiko Tinggi Preeklamsia
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Asal: {ref.fromFacility?.name}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
