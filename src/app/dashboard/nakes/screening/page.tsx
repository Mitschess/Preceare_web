"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Stethoscope,
  Brain,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Send,
  User,
  Scale,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { patients, mockAIPredict } from "@/lib/mock-data";
import { getRiskColor, getRiskLabel, formatDate } from "@/lib/utils";
import type { RiskLevel } from "@/types";

export default function ScreeningPage() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState("");
  const [formData, setFormData] = useState({
    // Anamnesis (LCD input)
    usiaIbu: "",
    bmi: "",
    usiaKehamilan: "",
    // Vital signs (from device)
    systolic: "",
    diastolic: "",
    proteinUrin: "",
    // Risk factors (LCD checkboxes)
    diabetes: false,
    riwayatPreeklamsia: false,
    riwayatKeluarga: false,
    hipertensi: false,
    penyakitGinjal: false,
    kehamilanPertama: false,
  });
  
  const [result, setResult] = useState<{
    riskLevel: RiskLevel;
    confidence: number;
    factors: string[];
    clinicalRiskScore: number;
    sensorScore: number;
    hybridScore: number;
    recommendation: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId);
    if (patientId) {
      const p = patients.find((pat) => pat.id === patientId);
      if (p) {
        // Calculate age
        const today = new Date();
        const birth = new Date(p.tanggalLahir);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        
        let bmiVal = "24.2";
        if (p.id === "pat-4") bmiVal = "32.4"; // Fitri Handayani (dummy data)
        else if (p.id === "pat-2") bmiVal = "30.2";
        else if (p.id === "pat-1") bmiVal = "23.5";
        else if (p.id === "pat-3") bmiVal = "25.1";
        else if (p.id === "pat-5") bmiVal = "21.8";
        else if (p.id === "pat-6") bmiVal = "27.6";

        setFormData({
          usiaIbu: age.toString(),
          bmi: bmiVal,
          usiaKehamilan: p.usiaKehamilan.toString(),
          // Default sensors (empty for manual/sensor sync test)
          systolic: p.id === "pat-4" ? "152" : "",
          diastolic: p.id === "pat-4" ? "98" : "",
          proteinUrin: p.id === "pat-4" ? "2.0" : "",
          // Load pre-filled factors from patient
          diabetes: p.id === "pat-4",
          riwayatPreeklamsia: p.id === "pat-4",
          riwayatKeluarga: p.id === "pat-4" || p.id === "pat-2",
          hipertensi: p.id === "pat-4" || p.id === "pat-2",
          penyakitGinjal: p.id === "pat-4",
          kehamilanPertama: p.id === "pat-1" || p.id === "pat-4" || p.id === "pat-5",
        });
      }
    } else {
      resetForm();
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setStep(3);
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 2000));

    const prediction = mockAIPredict({
      ...formData,
      systolic: parseInt(formData.systolic) || 0,
      diastolic: parseInt(formData.diastolic) || 0,
      proteinUrin: parseFloat(formData.proteinUrin) || 0,
      usiaIbu: parseInt(formData.usiaIbu) || 0,
      bmi: parseFloat(formData.bmi) || 0,
      usiaKehamilan: parseInt(formData.usiaKehamilan) || 0,
    });

    setResult(prediction);
    setLoading(false);
  };

  const handleNavigateToReferral = () => {
    if (!result) return;
    const searchParams = new URLSearchParams();
    searchParams.set("patientId", selectedPatient);
    searchParams.set("openModal", "true");
    searchParams.set("systolic", formData.systolic);
    searchParams.set("diastolic", formData.diastolic);
    searchParams.set("proteinUrin", formData.proteinUrin);
    searchParams.set("confidence", Math.round(result.confidence * 100).toString());
    
    router.push(`/dashboard/nakes/rujukan?${searchParams.toString()}`);
  };

  const resetForm = () => {
    setSelectedPatient("");
    setFormData({
      usiaIbu: "",
      bmi: "",
      usiaKehamilan: "",
      systolic: "",
      diastolic: "",
      proteinUrin: "",
      diabetes: false,
      riwayatPreeklamsia: false,
      riwayatKeluarga: false,
      hipertensi: false,
      penyakitGinjal: false,
      kehamilanPertama: false,
    });
    setResult(null);
    setStep(1);
  };

  const selectedPatientData = patients.find((p) => p.id === selectedPatient);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Screening Baru (CDSS Panel)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Sistem Pendukung Keputusan Klinis (Hybrid CDSS) berbasis AI dan Parameter Maternal
        </p>
      </div>

      {/* CDSS Architecture Info Banner */}
      <div className="bg-[#0EA5E9]/5 border border-[#0EA5E9]/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Brain className="w-4 h-4 text-[#0EA5E9]" />
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          <strong className="text-gray-900">Pendekatan Hybrid AI-Based CDSS:</strong> data maternal (anamnesis) digabungkan dengan data sensor (objektif) untuk mengevaluasi parameter preeklamsia dan menentukan status rujukan secara otomatis secara klinis terstandar.
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { num: 1, label: "LCD & Sensor" },
          { num: 2, label: "Faktor Risiko" },
          { num: 3, label: "Hybrid CDSS AI" },
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
            <span className={`text-xs sm:text-sm font-medium ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
              {s.label}
            </span>
            {i < 2 && <div className={`flex-1 h-0.5 rounded ${step > s.num ? "bg-[#0EA5E9]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Patient Select, Maternal Anamnesis (LCD) & Vital Measurement (Sensor) */}
      {step === 1 && (
        <div className="card p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Data Input (LCD & Sensor)</h3>
              <p className="text-sm text-gray-500">Maternal Anamnesis (LCD Touchscreen) & Sensor Devices</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pasien</label>
              <select
                value={selectedPatient}
                onChange={(e) => handlePatientChange(e.target.value)}
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

            {/* Tahap 1: Anamnesis Section (LCD Input) */}
            <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-purple-900">Tahap 1 – Maternal Anamnesis (LCD Touchscreen)</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Usia Ibu (Tahun)</label>
                  <input
                    type="number"
                    value={formData.usiaIbu}
                    onChange={(e) => setFormData({ ...formData, usiaIbu: e.target.value })}
                    placeholder="37"
                    className="input"
                    min="15"
                    max="55"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">BMI (kg/m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
                    placeholder="32.4"
                    className="input"
                    min="10"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Usia Kehamilan (Minggu)</label>
                  <input
                    type="number"
                    value={formData.usiaKehamilan}
                    onChange={(e) => setFormData({ ...formData, usiaKehamilan: e.target.value })}
                    placeholder="30"
                    className="input"
                    min="1"
                    max="45"
                  />
                </div>
              </div>
            </div>

            {/* Tahap 2: Vital Signs Section (Device Measurement) */}
            <div className="bg-green-50/50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-green-600" />
                <h4 className="text-sm font-bold text-green-900">Tahap 2 – Sensor Measurement (Objective Metrics)</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">TD Sistolik (mmHg)</label>
                  <input
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    placeholder="152"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">TD Diastolik (mmHg)</label>
                  <input
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    placeholder="98"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Protein Urin (g/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.proteinUrin}
                    onChange={(e) => setFormData({ ...formData, proteinUrin: e.target.value })}
                    placeholder="2.0"
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedPatient || !formData.usiaIbu || !formData.systolic}
              className="btn btn-primary"
            >
              Lanjut
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Risk Factors Checklist */}
      {step === 2 && (
        <div className="card p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Faktor Risiko Maternal</h3>
              <p className="text-sm text-gray-500">
                Pilih status riwayat kesehatan dan kondisi medis pasien
              </p>
            </div>
          </div>

          {selectedPatientData && (
            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 text-sm mb-6 border border-gray-150">
              <div className="flex-1">
                <span className="text-gray-400 text-xs">Pasien</span>
                <div className="font-bold text-gray-900">{selectedPatientData.nama}</div>
              </div>
              <div className="flex-1">
                <span className="text-gray-400 text-xs">Usia Anamnesis / Kehamilan</span>
                <div className="font-semibold text-gray-900">{formData.usiaIbu} thn / {formData.usiaKehamilan} minggu</div>
              </div>
              <div className="flex-1">
                <span className="text-gray-400 text-xs">BMI</span>
                <div className="font-semibold text-gray-900">{formData.bmi} kg/m²</div>
              </div>
              <div className="flex-1">
                <span className="text-gray-400 text-xs">TD</span>
                <div className="font-semibold text-gray-900">{formData.systolic}/{formData.diastolic} mmHg</div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "riwayatPreeklamsia", label: "Riwayat Preeklamsia", desc: "Preeklamsia pada kehamilan sebelumnya" },
              { key: "riwayatKeluarga", label: "Riwayat Keluarga Preeklamsia", desc: "Ibu atau saudari kandung pernah preeklamsia" },
              { key: "diabetes", label: "Diabetes Mellitus", desc: "Diabetes tipe 1, 2, atau gestasional" },
              { key: "hipertensi", label: "Hipertensi Kronis", desc: "Tekanan darah tinggi yang diderita sebelum kehamilan" },
              { key: "penyakitGinjal", label: "Penyakit Ginjal Kronis", desc: "Gangguan fungsi ginjal yang sudah ada sebelumnya" },
              { key: "kehamilanPertama", label: "Kehamilan Pertama (Nullipara)", desc: "Belum pernah melahirkan sebelumnya" },
            ].map((factor) => (
              <label
                key={factor.key}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                  className="w-5 h-5 rounded accent-[#0EA5E9] mt-0.5 animate-pulse"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">{factor.label}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{factor.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="btn btn-ghost">
              ← Kembali
            </button>
            <button onClick={handlePredict} className="btn btn-primary">
              <Brain className="w-4 h-4" />
              Jalankan Hybrid AI Predictor
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Hybrid CDSS AI Results */}
      {step === 3 && loading && (
        <div className="card p-16 text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-spin">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Hybrid AI CDSS Menganalisis...</h3>
          <p className="text-sm text-gray-500">Mengkorelasi Data Anamnesis & Hasil Pengukuran Sensor</p>
          <div className="mt-6 w-48 mx-auto">
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full gradient-primary animate-pulse" style={{ width: "80%" }} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && !loading && result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Risk level assessment summary */}
          <div
            className="card p-6 border-2"
            style={{ borderColor: getRiskColor(result.riskLevel) + "50" }}
          >
            <div className="text-center pb-6 border-b border-gray-100">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0EA5E9]">Tahap 3 – Hybrid AI Prediction</span>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mt-4 mb-3"
                style={{ background: getRiskColor(result.riskLevel) + "15" }}
              >
                {result.riskLevel === "HIGH" ? (
                  <AlertTriangle className="w-9 h-9" style={{ color: getRiskColor(result.riskLevel) }} />
                ) : result.riskLevel === "MEDIUM" ? (
                  <Activity className="w-9 h-9" style={{ color: getRiskColor(result.riskLevel) }} />
                ) : (
                  <CheckCircle className="w-9 h-9" style={{ color: getRiskColor(result.riskLevel) }} />
                )}
              </div>
              <h3 className="text-2xl font-black text-gray-905">
                {getRiskLabel(result.riskLevel)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Confidence AI Engine: <strong style={{ color: getRiskColor(result.riskLevel) }}>{Math.round(result.confidence * 100)}%</strong>
              </p>
              
              {/* CDSS Referral Box */}
              <div className="mt-4 max-w-lg mx-auto p-4 rounded-xl border flex items-center justify-between"
                   style={{
                     backgroundColor: result.riskLevel === "HIGH" ? "#FEF2F2" : result.riskLevel === "MEDIUM" ? "#FFFBEB" : "#F0FDF4",
                     borderColor: result.riskLevel === "HIGH" ? "#FEE2E2" : result.riskLevel === "MEDIUM" ? "#FEF3C7" : "#DCFCE7",
                     color: result.riskLevel === "HIGH" ? "#991B1B" : result.riskLevel === "MEDIUM" ? "#92400E" : "#166534"
                   }}>
                <div className="flex items-center gap-2 text-left">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold uppercase opacity-60">Status Rujukan (CDSS Engine)</div>
                    <div className="font-bold text-sm sm:text-base">{result.recommendation}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Clinical & Sensor scores showing the hybrid process */}
            <div className="grid md:grid-cols-3 gap-6 py-6 border-b border-gray-100 text-left">
              {/* Clinical Risk Score (Anamnesis) */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-900">Tahap 1: Clinical Risk Score</span>
                  <span className="text-lg font-extrabold text-purple-700 bg-white shadow-sm border border-purple-200/50 rounded-lg px-2.5 py-0.5">
                    {result.clinicalRiskScore}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Dihitung dari anamnesis maternal pada LCD touchscreen, usia ibu, BMI, dan riwayat kesehatan.</p>
              </div>

              {/* Sensor Score */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-990">Tahap 2: Sensor Score</span>
                  <span className="text-lg font-extrabold text-emerald-700 bg-white shadow-sm border border-emerald-250 rounded-lg px-2.5 py-0.5">
                    {result.sensorScore}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Diperoleh dari pengukuran objektif sensor tekanan darah (Sistolik/Diastolik) & protein urin.</p>
              </div>

              {/* Hybrid CDSS Total Score */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-900">Hybrid AI Total Score</span>
                  <span className="text-lg font-extrabold text-sky-700 bg-white shadow-sm border border-sky-200 rounded-lg px-2.5 py-0.5">
                    {result.hybridScore}/29
                  </span>
                </div>
                <p className="text-xs text-gray-500">Mengkombinasikan skor anamnesis dan sensor objektif untuk memetakan level risiko preeklamsia.</p>
              </div>
            </div>

            {/* Factors detected block */}
            <div className="py-6 text-left">
              <h4 className="text-sm font-bold text-gray-800 mb-3 block flex items-center gap-1">
                <FileText className="w-4 h-4 text-gray-600" />
                Parameter & Gejala Terindikasi Preeklamsia:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                {result.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getRiskColor(result.riskLevel) }} />
                    <span className="text-xs sm:text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Summary Section */}
            <div className="pt-6 border-t border-gray-150 grid grid-cols-3 sm:grid-cols-6 gap-3 text-center bg-gray-50/20 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Nama</span>
                <div className="text-xs sm:text-sm font-bold text-gray-800 truncate">{selectedPatientData?.nama}</div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Usia Ibu</span>
                <div className="text-xs sm:text-sm font-bold text-gray-800">{formData.usiaIbu} thn</div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Kehamilan</span>
                <div className="text-xs sm:text-sm font-bold text-gray-800">{formData.usiaKehamilan} mg</div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">BMI</span>
                <div className="text-xs sm:text-sm font-bold text-gray-800">{formData.bmi}</div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">TD (S/D)</span>
                <div className="text-xs sm:text-sm font-bold text-gray-800">{formData.systolic}/{formData.diastolic}</div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Protein Urin</span>
                <div className="text-xs sm:text-sm font-bold text-gray-800">{formData.proteinUrin} g/L</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={resetForm} className="btn btn-outline">
              <RefreshCw className="w-4 h-4" />
              Screening Baru
            </button>
            {result.riskLevel === "HIGH" && (
              <button
                onClick={handleNavigateToReferral}
                className="btn btn-danger flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Rangkai Rujukan Baru (CDSS Referral)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
