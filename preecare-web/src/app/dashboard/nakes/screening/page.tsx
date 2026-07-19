"use client";

import { useState } from "react";
import {
  Activity,
  Stethoscope,
  Brain,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Send,
} from "lucide-react";
import { patients, mockAIPredict } from "@/lib/mock-data";
import { getRiskLabel, getRiskColor } from "@/lib/utils";
import type { RiskLevel } from "@/types";

export default function ScreeningPage() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    proteinUrin: "",
    diabetes: false,
    riwayatPreeklamsia: false,
    riwayatKeluarga: false,
    hipertensi: false,
    kehamilanPertama: false,
  });
  const [result, setResult] = useState<{
    riskLevel: RiskLevel;
    confidence: number;
    factors: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handlePredict = async () => {
    setLoading(true);
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1500));

    const prediction = mockAIPredict({
      ...formData,
      systolic: parseInt(formData.systolic) || 0,
      diastolic: parseInt(formData.diastolic) || 0,
      proteinUrin: parseFloat(formData.proteinUrin) || 0,
    });

    setResult(prediction);
    setStep(3);
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedPatient("");
    setFormData({
      systolic: "",
      diastolic: "",
      proteinUrin: "",
      diabetes: false,
      riwayatPreeklamsia: false,
      riwayatKeluarga: false,
      hipertensi: false,
      kehamilanPertama: false,
    });
    setResult(null);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Screening Baru</h2>
        <p className="text-sm text-gray-500 mt-1">
          Lakukan screening preeklamsia dengan AI prediction
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { num: 1, label: "Data Pasien" },
          { num: 2, label: "Faktor Risiko" },
          { num: 3, label: "Hasil AI" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                step >= s.num
                  ? "gradient-primary text-white shadow-lg shadow-blue-200"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
            </div>
            <span className={`text-sm font-medium ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
              {s.label}
            </span>
            {i < 2 && <div className={`flex-1 h-0.5 rounded ${step > s.num ? "bg-[#0EA5E9]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Patient & Vital Data */}
      {step === 1 && (
        <div className="card p-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Data Pasien & Vital</h3>
              <p className="text-sm text-gray-500">Input data dari alat PREECARE</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pasien</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="input"
              >
                <option value="">— Pilih Pasien —</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} (NIK: {p.nik})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tekanan Sistolik (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.systolic}
                  onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                  placeholder="120"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tekanan Diastolik (mmHg)
                </label>
                <input
                  type="number"
                  value={formData.diastolic}
                  onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                  placeholder="80"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein Urin (g/L)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.proteinUrin}
                  onChange={(e) => setFormData({ ...formData, proteinUrin: e.target.value })}
                  placeholder="0.15"
                  className="input"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedPatient || !formData.systolic || !formData.diastolic || !formData.proteinUrin}
                className="btn btn-primary disabled:opacity-40"
              >
                Lanjut
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Risk Factors */}
      {step === 2 && (
        <div className="card p-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Faktor Risiko</h3>
              <p className="text-sm text-gray-500">Input dari LCD touchscreen PREECARE</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "riwayatPreeklamsia", label: "Riwayat Preeklamsia" },
              { key: "diabetes", label: "Diabetes" },
              { key: "hipertensi", label: "Hipertensi" },
              { key: "riwayatKeluarga", label: "Riwayat Keluarga Preeklamsia" },
              { key: "kehamilanPertama", label: "Kehamilan Pertama (Nullipara)" },
            ].map((factor) => (
              <label
                key={factor.key}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData[factor.key as keyof typeof formData]
                    ? "border-[#0EA5E9] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData[factor.key as keyof typeof formData] as boolean}
                  onChange={(e) =>
                    setFormData({ ...formData, [factor.key]: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-[#0EA5E9]"
                />
                <span className="text-sm font-medium text-gray-700">{factor.label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="btn btn-ghost">
              ← Kembali
            </button>
            <button onClick={handlePredict} className="btn btn-primary">
              <Brain className="w-4 h-4" />
              Jalankan AI Prediction
            </button>
          </div>
        </div>
      )}

      {/* Step 3: AI Result */}
      {step === 3 && loading && (
        <div className="card p-16 text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI sedang menganalisis...</h3>
          <p className="text-sm text-gray-500">Memproses data vital dan faktor risiko</p>
          <div className="mt-6 w-48 mx-auto">
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full gradient-primary animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && !loading && result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Result Card */}
          <div
            className="card p-8 border-2 text-center"
            style={{ borderColor: getRiskColor(result.riskLevel) + "60" }}
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
              style={{ background: getRiskColor(result.riskLevel) + "15" }}
            >
              {result.riskLevel === "HIGH" ? (
                <AlertTriangle className="w-10 h-10" style={{ color: getRiskColor(result.riskLevel) }} />
              ) : result.riskLevel === "MEDIUM" ? (
                <Activity className="w-10 h-10" style={{ color: getRiskColor(result.riskLevel) }} />
              ) : (
                <CheckCircle className="w-10 h-10" style={{ color: getRiskColor(result.riskLevel) }} />
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {getRiskLabel(result.riskLevel)}
            </h3>
            <p className="text-gray-500 mb-4">
              Confidence: <strong>{Math.round(result.confidence * 100)}%</strong>
            </p>

            {/* Confidence gauge */}
            <div className="max-w-xs mx-auto mb-6">
              <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${result.confidence * 100}%`,
                    background: getRiskColor(result.riskLevel),
                  }}
                />
              </div>
            </div>

            {/* Factors */}
            <div className="text-left max-w-md mx-auto">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Faktor yang Terdeteksi:</h4>
              <div className="space-y-2">
                {result.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: getRiskColor(result.riskLevel) }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Input Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div>
                <div className="text-xs text-gray-400">Sistolik</div>
                <div className="text-lg font-bold text-gray-900">{formData.systolic}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Diastolik</div>
                <div className="text-lg font-bold text-gray-900">{formData.diastolic}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Protein Urin</div>
                <div className="text-lg font-bold text-gray-900">{formData.proteinUrin}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={resetForm} className="btn btn-outline">
              <RefreshCw className="w-4 h-4" />
              Screening Baru
            </button>
            {result.riskLevel === "HIGH" && (
              <button className="btn btn-danger">
                <Send className="w-4 h-4" />
                Rujuk ke Rumah Sakit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
