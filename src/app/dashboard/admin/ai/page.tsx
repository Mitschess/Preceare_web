"use client";

import { Brain, Sliders, ShieldCheck, Activity, BarChart, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function AdminAIPage() {
  const [thresholds, setThresholds] = useState({
    highRisk: 0.8,
    mediumRisk: 0.5,
  });

  const handleSaveSettings = () => {
    alert("Pengaturan AI Berhasil Disimpan!");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Konfigurasi Model AI</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sesuaikan ambang batas klasifikasi (thresholds) dan kelola model pembelajaran mesin.
          </p>
        </div>
        <button onClick={handleSaveSettings} className="btn btn-primary">
          <Settings className="w-4 h-4" />
          Simpan Aturan
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left columns: thresholds config */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 bg-white space-y-6">
            <h3 className="text-lg font-bold text-gray-950 flex items-center gap-1.5">
              <Sliders className="w-5 h-5 text-gray-400" />
              Batas Ambang Risiko (Confidence Thresholds)
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>Threshold Risiko Tinggi (High Risk)</span>
                  <span className="text-red-500">{thresholds.highRisk * 100}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="0.95"
                  step="0.05"
                  value={thresholds.highRisk}
                  onChange={(e) => setThresholds({ ...thresholds, highRisk: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <p className="text-[11px] text-gray-400 mt-2">
                  Jika probabilitas model &gt;= batas ini, pasien dikategorikan sebagai Risiko Tinggi dan direkomendasikan langsung dirujuk ke RS.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>Threshold Risiko Sedang (Medium Risk)</span>
                  <span className="text-amber-500">{thresholds.mediumRisk * 100}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="0.55"
                  step="0.05"
                  value={thresholds.mediumRisk}
                  onChange={(e) => setThresholds({ ...thresholds, mediumRisk: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-[11px] text-gray-400 mt-2">
                  Probabilitas di antara batas ini dan batas risiko tinggi diklasifikasikan sebagai Risiko Sedang.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-white space-y-4">
            <h3 className="text-lg font-bold text-gray-950">Spesifikasi Model Pembelajaran</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl border border-gray-150 bg-slate-50/50">
                <div className="text-xs text-gray-400">Arsitektur Model</div>
                <div className="font-bold text-gray-900 mt-0.5">XGBoost Classifier</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-150 bg-slate-50/50">
                <div className="text-xs text-gray-400">Total Fitur Masukan</div>
                <div className="font-bold text-gray-900 mt-0.5">8 Fitur Utama</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-150 bg-slate-50/50">
                <div className="text-xs text-gray-400">Metrik Validasi</div>
                <div className="font-bold text-gray-900 mt-0.5">AUC ROC: 0.982</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-150 bg-slate-50/50">
                <div className="text-xs text-gray-400">Tuning Terakhir</div>
                <div className="font-bold text-gray-900 mt-0.5">14 Juni 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: status models */}
        <div className="card p-6 bg-white space-y-4">
          <h3 className="text-lg font-bold text-gray-950">Daftar Model Terdeploy</h3>

          <div className="space-y-3">
            {[
              { version: "xgboost_v1.4_prod", active: true, accuracy: "98.2%" },
              { version: "xgboost_v1.3_bak", active: false, accuracy: "97.4%" },
              { version: "neural_net_v1.0_testing", active: false, accuracy: "96.8%" },
            ].map((m) => (
              <div
                key={m.version}
                className={`p-3.5 rounded-xl border transition-all ${
                  m.active ? "border-[#0EA5E9] bg-blue-50/20" : "border-gray-150"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-gray-900">{m.version}</span>
                  {m.active && (
                    <span className="badge bg-green-50 text-green-600 border border-green-105 text-[9px]">
                      AKTIF
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Akurasi Model:</span>
                  <span className="font-semibold text-gray-700">{m.accuracy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
