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
  Calendar,
  AlertCircle,
  FileText,
  Radio,
  Wifi,
  Database,
  CheckCircle2,
  Sliders,
  TestTube2,
  HeartPulse,
} from "lucide-react";
import { patients, mockAIPredict } from "@/lib/mock-data";
import { getRiskColor, getRiskLabel, formatDate } from "@/lib/utils";
import type { RiskLevel } from "@/types";

export default function ScreeningPage() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("PREECARE-DEV-01");
  const [hardwareStatus, setHardwareStatus] = useState<"WAITING" | "RECEIVING" | "RECEIVED">("WAITING");
  const [useManualInput, setUseManualInput] = useState(false);

  const availableDevices = [
    { id: "PREECARE-DEV-01", name: "PREECARE-DEV-01", ip: "192.168.1.105", status: "Online" },
    { id: "PREECARE-DEV-02", name: "PREECARE-DEV-02", ip: "192.168.1.108", status: "Online" },
    { id: "PREECARE-PORTABLE-01", name: "PREECARE-PORTABLE-01", ip: "192.168.1.112", status: "Online" },
  ];

  const [formData, setFormData] = useState({
    // Anamnesis (LCD input)
    usiaIbu: "",
    bmi: "",
    usiaKehamilan: "",
    // Vital signs (from device stream)
    systolic: "",
    diastolic: "",
    pulse: "",
    mapValue: "",
    // 10 Urine Strip Indicators
    proteinUrin: "",
    leukocytes: "",
    nitrite: "",
    urobilinogen: "",
    ph: "",
    blood: "",
    specificGravity: "",
    ketone: "",
    bilirubin: "",
    glucose: "",
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
    totalRuleScore?: number;
    hybridScore?: number;
    recommendation: string;
    summarySentence: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId);
    if (patientId) {
      const p = patients.find((pat) => pat.id === patientId);
      if (p) {
        const today = new Date();
        const birth = new Date(p.tanggalLahir);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }

        let bmiVal = "24.2";
        if (p.id === "pat-4") bmiVal = "32.4";
        else if (p.id === "pat-2") bmiVal = "30.2";
        else if (p.id === "pat-1") bmiVal = "23.5";
        else if (p.id === "pat-3") bmiVal = "25.1";
        else if (p.id === "pat-5") bmiVal = "21.8";
        else if (p.id === "pat-6") bmiVal = "27.6";

        setFormData((prev) => ({
          ...prev,
          usiaIbu: age.toString(),
          bmi: bmiVal,
          usiaKehamilan: p.usiaKehamilan.toString(),
          diabetes: p.id === "pat-4",
          riwayatPreeklamsia: p.id === "pat-4",
          riwayatKeluarga: p.id === "pat-4" || p.id === "pat-2",
          hipertensi: p.id === "pat-4" || p.id === "pat-2",
          penyakitGinjal: p.id === "pat-4",
          kehamilanPertama: p.id === "pat-1" || p.id === "pat-4" || p.id === "pat-5",
        }));
      }
    } else {
      resetForm();
    }
  };

  const handleSimulateHardwareStream = async () => {
    if (!selectedPatient) return;
    setHardwareStatus("RECEIVING");

    // Simulate hardware sensor & urine test execution (1.5 seconds telemetry stream)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Varied clinical profiles & protein levels based on patient
    let sys = "115", dia = "75", pulse = "70", mapVal = "88.3";
    let prot = "Negatif", leuk = "Negatif", nit = "Negatif", uro = "Normal (0.2 mg/dL)";
    let phVal = "6.0", bld = "Negatif", sgVal = "1.010", ket = "Negatif", bil = "Negatif", glu = "Negatif";

    if (selectedPatient === "pat-2") {
      // Dewi Lestari (Severe Preeclampsia - High Risk)
      sys = "165"; dia = "105"; pulse = "92"; mapVal = "125.0";
      prot = "300 mg/dL (+3)";
      leuk = "125 Ca CELLS/µL";
      nit = "Positif";
      uro = "4 mg/dL";
      phVal = "8.0";
      bld = "80 Ca CELLS/µL (+2)";
      sgVal = "1.030";
      ket = "80 mg/dL (+3)";
    } else if (selectedPatient === "pat-4") {
      // Fitri Handayani (Preeclampsia - High Risk)
      sys = "152"; dia = "98"; pulse = "86"; mapVal = "116.0";
      prot = "100 mg/dL (+2)";
      leuk = "70 Ca CELLS/µL";
      nit = "Positif";
      uro = "1 mg/dL";
      phVal = "8.0";
      bld = "25 Ca CELLS/µL (+1)";
      sgVal = "1.025";
      ket = "40 mg/dL (+2)";
    } else if (selectedPatient === "pat-3") {
      // Ratna Sari (Mild Risk - Medium Risk)
      sys = "134"; dia = "86"; pulse = "80"; mapVal = "102.0";
      prot = "30 mg/dL (+1)";
      leuk = "Trace (15)";
      nit = "Negatif";
      uro = "1 mg/dL";
      phVal = "7.0";
      bld = "Trace (10)";
      sgVal = "1.020";
      ket = "15 mg/dL (+1)";
    } else if (selectedPatient === "pat-6") {
      // Rina Wulandari (Moderate Risk - Medium Risk)
      sys = "128"; dia = "84"; pulse = "76"; mapVal = "98.6";
      prot = "30 mg/dL (+1)";
      leuk = "Negatif";
      nit = "Negatif";
      uro = "Normal (0.2 mg/dL)";
      phVal = "6.5";
      bld = "Negatif";
      sgVal = "1.015";
      ket = "5 mg/dL (±)";
    } else if (selectedPatient === "pat-5") {
      // Nurul Hidayah (Low Risk - Trace)
      sys = "118"; dia = "76"; pulse = "72"; mapVal = "90.0";
      prot = "Trace";
      leuk = "Negatif";
      nit = "Negatif";
      uro = "Normal (0.2 mg/dL)";
      phVal = "6.0";
      bld = "Negatif";
      sgVal = "1.015";
      ket = "Negatif";
    }

    setFormData((prev) => ({
      ...prev,
      systolic: sys,
      diastolic: dia,
      pulse: pulse,
      mapValue: mapVal,
      proteinUrin: prot,
      leukocytes: leuk,
      nitrite: nit,
      urobilinogen: uro,
      ph: phVal,
      blood: bld,
      specificGravity: sgVal,
      ketone: ket,
      bilirubin: bil,
      glucose: glu,
    }));

    setHardwareStatus("RECEIVED");
  };

  const handlePredict = async () => {
    setLoading(true);
    setStep(3);
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 2000));

    const prediction = mockAIPredict({
      ...formData,
      systolic: parseInt(formData.systolic) || 120,
      diastolic: parseInt(formData.diastolic) || 80,
      proteinUrin: formData.proteinUrin || "Negatif",
      usiaIbu: parseInt(formData.usiaIbu) || 25,
      bmi: parseFloat(formData.bmi) || 22.0,
      usiaKehamilan: parseInt(formData.usiaKehamilan) || 24,
      leukocytes: formData.leukocytes,
      blood: formData.blood,
      ketone: formData.ketone,
      glucose: formData.glucose,
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
    setHardwareStatus("WAITING");
    setUseManualInput(false);
    setFormData({
      usiaIbu: "",
      bmi: "",
      usiaKehamilan: "",
      systolic: "",
      diastolic: "",
      pulse: "",
      mapValue: "",
      proteinUrin: "",
      leukocytes: "",
      nitrite: "",
      urobilinogen: "",
      ph: "",
      blood: "",
      specificGravity: "",
      ketone: "",
      bilirubin: "",
      glucose: "",
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
          Sistem Pendukung Keputusan Klinis (Rule-Based CDSS) terintegrasi Hardware PREECARE & 10 Indikator Urin
        </p>
      </div>

      {/* CDSS Architecture Info Banner */}
      <div className="bg-[#0EA5E9]/5 border border-[#0EA5E9]/20 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Brain className="w-4 h-4 text-[#0EA5E9]" />
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          <strong className="text-gray-900">Pendekatan Integrasi Telemetri Hardware:</strong> Data maternal dari LCD Touchscreen digabungkan secara otomatis dengan telemetry sensor tekanan darah & 10 Parameter strip urinalisis dari Alat PREECARE.
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[
          { num: 1, label: "Koneksi Alat Hardware" },
          { num: 2, label: "Faktor Risiko & 10 Urin" },
          { num: 3, label: "Rule-Based Decision" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${step >= s.num
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

      {/* Step 1: Patient Select & Waiting for Hardware Data Stream */}
      {step === 1 && (
        <div className="card p-6 sm:p-8 animate-fadeIn space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Integrasi Hardware PREECARE</h3>
                <p className="text-sm text-gray-500">Pilih pasien dan terima data otomatis dari alat PREECARE</p>
              </div>
            </div>
            <button
              onClick={() => setUseManualInput(!useManualInput)}
              className="text-xs font-semibold text-[#0EA5E9] hover:underline flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              {useManualInput ? "Gunakan Otomatis Hardware" : "Mode Input Manual"}
            </button>
          </div>

          {/* Selection Grid: Patient & Hardware Device */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Pilih Pasien Pemeriksaan</label>
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

            {/* Device Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">2. Pilih Alat PREECARE Hardware</label>
              <select
                value={selectedDevice}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  setHardwareStatus("WAITING");
                }}
                className="input font-medium"
              >
                {availableDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Network Requirement Alert Banner */}
          {!useManualInput && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600 mt-0.5">
                <Wifi className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="text-xs sm:text-sm">
                <strong className="font-bold text-amber-950">Persyaratan Jaringan Telemetri:</strong> Pastikan perangkat ini dan Alat PREECARE Hardware terhubung dengan <span className="underline font-semibold">jaringan Wi-Fi / LAN yang sama</span> agar data hasil pengujian alat terintegrasi secara langsung.
              </div>
            </div>
          )}

          {/* Hardware Connection & Data Waiting Status Box */}
          {!useManualInput && (
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/60 via-white to-blue-50/40 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${hardwareStatus === "RECEIVED"
                      ? "bg-emerald-500 shadow-md shadow-emerald-200"
                      : hardwareStatus === "RECEIVING"
                        ? "bg-amber-500 animate-ping"
                        : "bg-blue-500 animate-pulse"
                      }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Status Telemetri Hardware
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-md">
                  {selectedDevice}
                </span>
              </div>

              {hardwareStatus === "WAITING" && (
                <div className="p-6 rounded-xl border border-sky-100 bg-white/80 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-sky-100/70 text-[#0EA5E9] flex items-center justify-center mx-auto animate-bounce">
                    <Radio className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">
                      Menunggu Kiriman Data dari {availableDevices.find((d) => d.id === selectedDevice)?.id || selectedDevice}...
                    </h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                      Silakan jalankan pengujian sensor tekanan darah & strip urin 10-parameter pada touchscreen alat hardware.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSimulateHardwareStream}
                      disabled={!selectedPatient}
                      className="btn btn-primary shadow-lg shadow-sky-200 disabled:opacity-50"
                    >
                      <Database className="w-4 h-4" />
                      Kirim Data dari Alat Hardware
                    </button>
                  </div>
                </div>
              )}

              {hardwareStatus === "RECEIVING" && (
                <div className="p-6 rounded-xl border border-amber-200 bg-amber-50/50 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-spin">
                    <RefreshCw className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-base">Menerima Telemetry Data dari Alat PREECARE...</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Menyingkronkan Tekanan Darah, MAP, Pulse, & 10 Parameter Strip Urinalisis...
                    </p>
                  </div>
                </div>
              )}

              {hardwareStatus === "RECEIVED" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <div>
                        <div className="font-bold text-emerald-900 text-sm">Data Berhasil Diterima dari Alat PREECARE!</div>
                        <div className="text-xs text-emerald-700">Tekanan darah, denyut nadi, MAP, & 10 parameter strip urin telah tersinkronisasi.</div>
                      </div>
                    </div>
                    <button
                      onClick={handleSimulateHardwareStream}
                      className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Sync Ulang
                    </button>
                  </div>

                  {/* Summary Preview of Received Hardware Data */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-gray-150">
                      <div className="text-gray-400 font-medium">Tekanan Darah</div>
                      <div className="text-base font-extrabold text-gray-900 mt-0.5">{formData.systolic}/{formData.diastolic} <span className="text-xs font-normal text-gray-500">mmHg</span></div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-150">
                      <div className="text-gray-400 font-medium">Nadi / MAP</div>
                      <div className="text-base font-extrabold text-gray-900 mt-0.5">{formData.pulse} bpm / {formData.mapValue}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-150">
                      <div className="text-gray-400 font-medium">Protein Urin</div>
                      <div className={`text-base font-extrabold mt-0.5 ${formData.proteinUrin !== 'Negatif' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {formData.proteinUrin}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-150">
                      <div className="text-gray-400 font-medium">10 Parameter Strip</div>
                      <div className="text-base font-extrabold text-blue-600 mt-0.5">10/10 Terbaca</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Input Mode (If Toggled) */}
          {useManualInput && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-600" /> Mode Pengisian Manual Parameter Sensor
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">TD Sistolik (mmHg)</label>
                  <input
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    placeholder="120"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">TD Diastolik (mmHg)</label>
                  <input
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    placeholder="80"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Protein Urin</label>
                  <select
                    value={formData.proteinUrin}
                    onChange={(e) => setFormData({ ...formData, proteinUrin: e.target.value })}
                    className="input"
                  >
                    <option value="Negatif">Negatif</option>
                    <option value="Trace">Trace</option>
                    <option value="30 mg/dL (+1)">30 mg/dL (+1)</option>
                    <option value="100 mg/dL (+2)">100 mg/dL (+2)</option>
                    <option value="300 mg/dL (+3)">300 mg/dL (+3)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedPatient || (!useManualInput && hardwareStatus !== "RECEIVED") || (useManualInput && !formData.systolic)}
              className="btn btn-primary disabled:opacity-50"
            >
              Lanjut ke Faktor Risiko & Strip Urin
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Risk Factors Checklist & 10 Urine Indicators Review */}
      {step === 2 && (
        <div className="card p-6 sm:p-8 animate-fadeIn space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TestTube2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Faktor Risiko Maternal & 10 Indikator Urin</h3>
              <p className="text-sm text-gray-500">Review faktor risiko Anamnesis (LCD) dan hasil strip urinalisis 10 parameter</p>
            </div>
          </div>

          {selectedPatientData && (
            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-gray-50 text-sm border border-gray-150">
              <div className="flex-1 min-w-[120px]">
                <span className="text-gray-400 text-xs">Pasien</span>
                <div className="font-bold text-gray-900">{selectedPatientData.nama}</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <span className="text-gray-400 text-xs">Usia / Kehamilan</span>
                <div className="font-semibold text-gray-900">{formData.usiaIbu} thn / {formData.usiaKehamilan} mg</div>
              </div>
              <div className="flex-1 min-w-[100px]">
                <span className="text-gray-400 text-xs">BMI</span>
                <div className="font-semibold text-gray-900">{formData.bmi} kg/m²</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <span className="text-gray-400 text-xs">TD Hardware</span>
                <div className="font-semibold text-gray-900">{formData.systolic}/{formData.diastolic} mmHg</div>
              </div>
            </div>
          )}

          {/* 10 Urine Parameter Strip Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <TestTube2 className="w-4 h-4 text-[#0EA5E9]" />
              Hasil Reagent Strip Urin 10-Parameter (Hardware Stream):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              {[
                { label: "GLUCOSE", value: formData.glucose || "Negatif", isAlert: Boolean(formData.glucose && formData.glucose !== "Negatif") },
                { label: "BILIRUBIN", value: formData.bilirubin || "Negatif", isAlert: Boolean(formData.bilirubin && formData.bilirubin !== "Negatif") },
                { label: "KETONE", value: formData.ketone || "Negatif", isAlert: Boolean(formData.ketone && formData.ketone !== "Negatif") },
                { label: "SPECIFIC GRAVITY", value: formData.specificGravity || "1.015", isAlert: false },
                { label: "BLOOD", value: formData.blood || "Negatif", isAlert: Boolean(formData.blood && formData.blood !== "Negatif") },
                { label: "pH", value: formData.ph || "6.5", isAlert: false },
                { label: "PROTEIN", value: formData.proteinUrin || "Negatif", isAlert: Boolean(formData.proteinUrin && formData.proteinUrin !== "Negatif"), isProtein: true },
                { label: "UROBILINOGEN", value: formData.urobilinogen || "Normal (0.2 mg/dL)", isAlert: false },
                { label: "NITRITE", value: formData.nitrite || "Negatif", isAlert: Boolean(formData.nitrite && formData.nitrite !== "Negatif") },
                { label: "LEUKOCYTES", value: formData.leukocytes || "Negatif", isAlert: Boolean(formData.leukocytes && formData.leukocytes !== "Negatif") },
              ].map((item, idx) => {
                const isPositiveProtein = item.isProtein && item.value !== "Negatif";
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${isPositiveProtein
                      ? "bg-rose-50/90 border-rose-300 text-rose-900 shadow-sm"
                      : item.isAlert
                      ? "bg-amber-50/80 border-amber-200 text-amber-900"
                      : "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                      }`}
                  >
                    <div className={`text-[10px] font-semibold uppercase ${isPositiveProtein ? "text-rose-700 font-bold" : "text-gray-500"}`}>{item.label}</div>
                    <div className={`font-extrabold mt-1 truncate ${isPositiveProtein ? "text-rose-700" : ""}`}>{item.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Factors Checklist */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Faktor Risiko Maternal Anamnesis:
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { key: "riwayatPreeklamsia", label: "Riwayat Preeklamsia", desc: "Preeklamsia pada kehamilan sebelumnya" },
                { key: "riwayatKeluarga", label: "Riwayat Keluarga Preeklamsia", desc: "Ibu atau saudari kandung pernah preeklamsia" },
                { key: "diabetes", label: "Diabetes Mellitus", desc: "Diabetes tipe 1, 2, atau gestasional" },
                { key: "hipertensi", label: "Hipertensi Kronis", desc: "Tekanan darah tinggi sebelum kehamilan" },
                { key: "penyakitGinjal", label: "Penyakit Ginjal Kronis", desc: "Gangguan fungsi ginjal kronis" },
                { key: "kehamilanPertama", label: "Kehamilan Pertama (Nullipara)", desc: "Belum pernah melahirkan sebelumnya" },
              ].map((factor) => (
                <label
                  key={factor.key}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${formData[factor.key as keyof typeof formData]
                    ? "border-[#0EA5E9] bg-blue-50/80"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData[factor.key as keyof typeof formData] as boolean}
                    onChange={(e) =>
                      setFormData({ ...formData, [factor.key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#0EA5E9] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-900">{factor.label}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">{factor.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="btn btn-ghost">
              ← Kembali
            </button>
            <button onClick={handlePredict} className="btn btn-primary shadow-md shadow-blue-200">
              <Brain className="w-4 h-4" />
              Jalankan Rule-Based Decision
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Rule-Based Decision Results */}
      {step === 3 && loading && (
        <div className="card p-16 text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-spin">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rule-Based Decision System Menganalisis...</h3>
          <p className="text-sm text-gray-500">Mengkorelasi Anamnesis LCD, TD Hardware, & 10 Indikator Urin</p>
          <div className="mt-6 w-48 mx-auto">
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full gradient-primary animate-pulse" style={{ width: "85%" }} />
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
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0EA5E9]">Tahap 3 – Rule-Based Decision</span>
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
              <h3 className="text-2xl font-black text-gray-900">
                {getRiskLabel(result.riskLevel)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Akurasi Rule-Based Engine: <strong style={{ color: getRiskColor(result.riskLevel) }}>{Math.round(result.confidence * 100)}%</strong>
              </p>

              {/* CDSS Referral Box */}
              <div
                className="mt-4 max-w-lg mx-auto p-4 rounded-xl border flex items-center justify-between"
                style={{
                  backgroundColor: result.riskLevel === "HIGH" ? "#FEF2F2" : result.riskLevel === "MEDIUM" ? "#FFFBEB" : "#F0FDF4",
                  borderColor: result.riskLevel === "HIGH" ? "#FEE2E2" : result.riskLevel === "MEDIUM" ? "#FEF3C7" : "#DCFCE7",
                  color: result.riskLevel === "HIGH" ? "#991B1B" : result.riskLevel === "MEDIUM" ? "#92400E" : "#166534"
                }}
              >
                <div className="flex items-center gap-2 text-left">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold uppercase opacity-60">Status Rujukan (CDSS Engine)</div>
                    <div className="font-bold text-sm sm:text-base">{result.recommendation}</div>
                  </div>
                </div>
              </div>

              {/* Dynamic AI Clinical Narrative Summary Sentence */}
              {result.summarySentence && (
                <div className="mt-4 max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 text-left shadow-sm">
                  <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase mb-1">
                    <Brain className="w-4 h-4 text-[#0EA5E9]" />
                    Penjelasan Naratif Rule-Based (Rule-Based Decision Summary):
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                    "{result.summarySentence}"
                  </p>
                </div>
              )}
            </div>

            {/* Split Clinical & Sensor scores showing the rule-based process */}
            <div className="grid md:grid-cols-3 gap-6 py-6 border-b border-gray-100 text-left">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-900">Tahap 1: Clinical Risk Score</span>
                  <span className="text-lg font-extrabold text-purple-700 bg-white shadow-sm border border-purple-200/50 rounded-lg px-2.5 py-0.5">
                    {result.clinicalRiskScore}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Dihitung dari anamnesis maternal pada LCD touchscreen, usia ibu, BMI, dan riwayat kesehatan.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900">Tahap 2: Sensor Score</span>
                  <span className="text-lg font-extrabold text-emerald-700 bg-white shadow-sm border border-emerald-200 rounded-lg px-2.5 py-0.5">
                    {result.sensorScore}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Diperoleh dari sensor TD hardware & 10 Indikator strip urinalisis.</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-900">Total Rule-Based Score</span>
                  <span className="text-lg font-extrabold text-sky-700 bg-white shadow-sm border border-sky-200 rounded-lg px-2.5 py-0.5">
                    {result.totalRuleScore ?? result.hybridScore}/29
                  </span>
                </div>
                <p className="text-xs text-gray-500">Mengkombinasikan skor anamnesis dan sensor objektif berbasis aturan klinis untuk memetakan level risiko preeklamsia.</p>
              </div>
            </div>

            {/* Factors detected block */}
            <div className="py-6 text-left border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">
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

            {/* 10 Urine Reagent Strip Summary Grid */}
            <div className="py-6 text-left">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">
                <TestTube2 className="w-4 h-4 text-[#0EA5E9]" />
                Ringkasan 10 Parameter Strip Urin (PREECARE Telemetry):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[
                  { label: "Protein Urin", val: formData.proteinUrin || "Negatif", alert: formData.proteinUrin !== "Negatif" },
                  { label: "Leukosit", val: formData.leukocytes || "Negatif", alert: formData.leukocytes !== "Negatif" },
                  { label: "Nitrit", val: formData.nitrite || "Negatif", alert: formData.nitrite !== "Negatif" },
                  { label: "Urobilinogen", val: formData.urobilinogen || "Normal (0.2 mg/dL)", alert: false },
                  { label: "pH Urin", val: formData.ph || "6.5", alert: false },
                  { label: "Darah", val: formData.blood || "Negatif", alert: formData.blood !== "Negatif" },
                  { label: "Berat Jenis", val: formData.specificGravity || "1.015", alert: false },
                  { label: "Keton", val: formData.ketone || "Negatif", alert: formData.ketone !== "Negatif" },
                  { label: "Bilirubin", val: formData.bilirubin || "Negatif", alert: false },
                  { label: "Glukosa", val: formData.glucose || "Negatif", alert: formData.glucose !== "Negatif" },
                ].map((u, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border ${u.alert ? "bg-red-50 border-red-200 text-red-900" : "bg-slate-50 border-slate-150 text-slate-700"
                      }`}
                  >
                    <div className="text-[10px] text-gray-400 font-semibold uppercase">{u.label}</div>
                    <div className="font-extrabold truncate mt-0.5">{u.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Summary Section */}
            <div className="pt-4 border-t border-gray-150 grid grid-cols-3 sm:grid-cols-6 gap-3 text-center bg-gray-50/40 p-4 rounded-2xl">
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
                <div className="text-xs sm:text-sm font-bold text-gray-800 truncate">{formData.proteinUrin}</div>
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
