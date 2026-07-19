"use client";

import { Activity, Award, ShieldAlert, Heart, Calendar } from "lucide-react";
import { patients, getPatientScreenings, getLatestScreening } from "@/lib/mock-data";
import { getRiskLabel, formatDate } from "@/lib/utils";

export default function PasienScreeningPage() {
  const patient = patients[0]; // Active demo patient
  const screenings = getPatientScreenings(patient.id);
  const latestScreening = getLatestScreening(patient.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hasil Screening Anda</h2>
        <p className="text-sm text-gray-500 mt-1">
          Detail hasil pemeriksaan preeklamsia dan klasifikasi risiko berbasis AI.
        </p>
      </div>

      {latestScreening && (
        <div className="card p-6 border-l-4 border-l-[#0EA5E9] bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider risk-medium bg-sky-50 text-[#0EA5E9] border border-sky-100">
                Pemeriksaan Terakhir
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {formatDate(latestScreening.createdAt)}
              </h3>
              <p className="text-sm text-gray-500">
                Sistem AI menguji data vital dan riwayat kesehatan untuk mengukur risiko preeklamsia.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Klasifikasi AI</div>
                <div className="text-lg font-bold text-gray-900">
                  {getRiskLabel(latestScreening.aiResult)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid details */}
      {latestScreening && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-5 bg-white">
            <h4 className="text-xs text-gray-400 uppercase font-semibold mb-3">Tekanan Darah</h4>
            <div className="flex items-baseline gap-1 text-2xl font-bold text-red-500">
              {latestScreening.systolic}/{latestScreening.diastolic}
              <span className="text-sm font-normal text-gray-400"> mmHg</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tekanan sistolik di atas 140 mmHg atau diastolik di atas 90 mmHg mengindikasikan hipertensi.
            </p>
          </div>

          <div className="card p-5 bg-white">
            <h4 className="text-xs text-gray-400 uppercase font-semibold mb-3">Protein Urin</h4>
            <div className="flex items-baseline gap-1 text-2xl font-bold text-[#0EA5E9]">
              {latestScreening.proteinUrin}
              <span className="text-sm font-normal text-gray-400"> g/L</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Kadar protein urin di luar batas normal (&gt;0.3 g/L) menunjukkan tanda awal preeklamsia.
            </p>
          </div>

          <div className="card p-5 bg-white">
            <h4 className="text-xs text-gray-400 uppercase font-semibold mb-3">Faktor Risiko Terdeteksi</h4>
            <div className="space-y-1.5 mt-2">
              {latestScreening.riskFactors?.riwayatPreeklamsia && (
                <div className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Riwayat Preeklamsia
                </div>
              )}
              {latestScreening.riskFactors?.hipertensi && (
                <div className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Riwayat Hipertensi
                </div>
              )}
              {latestScreening.riskFactors?.diabetes && (
                <div className="text-xs font-medium text-[#8B5CF6] bg-purple-50 px-2.5 py-1 rounded-lg">
                  Riwayat Diabetes
                </div>
              )}
              {!latestScreening.riskFactors?.riwayatPreeklamsia &&
                !latestScreening.riskFactors?.hipertensi &&
                !latestScreening.riskFactors?.diabetes && (
                  <div className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                    Tidak ada faktor risiko signifikan
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Past screenings */}
      <div className="card p-6 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Semua Riwayat Pemeriksaan</h3>
        <div className="space-y-4">
          {screenings.map((s) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-150 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900">{formatDate(s.createdAt)}</div>
                  <div className="text-xs text-gray-500">
                    TD: {s.systolic}/{s.diastolic} mmHg • Protein: {s.proteinUrin} g/L
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`badge ${s.aiResult === "HIGH" ? "risk-high" : s.aiResult === "MEDIUM" ? "risk-medium" : "risk-low"}`}>
                  {getRiskLabel(s.aiResult)}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {Math.round(s.confidence * 100)}% Conf.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
