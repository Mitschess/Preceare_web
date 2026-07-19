"use client";

import { Users, Search, Filter, Eye, X, Plus, Check, ChevronDown } from "lucide-react";
import { patients, getLatestScreening } from "@/lib/mock-data";
import { getRiskLabel, formatDate, calculateAge } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function NakesPasienPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({
    nama: "",
    nik: "",
    tanggalLahir: "",
    usiaKehamilan: "",
    alamat: "",
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nik.includes(search);

    if (riskFilter === "ALL") return matchSearch;

    const latest = getLatestScreening(p.id);
    if (!latest) return riskFilter === "NONE" && matchSearch;
    return latest.aiResult === riskFilter && matchSearch;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegisterSuccess(false);
      setRegisterForm({ nama: "", nik: "", tanggalLahir: "", usiaKehamilan: "", alamat: "" });
    }, 1800);
  };

  const detailPatient = showDetailModal
    ? patients.find((p) => p.id === showDetailModal)
    : null;
  const detailScreening = showDetailModal
    ? getLatestScreening(showDetailModal)
    : null;

  const filterOptions = [
    { value: "ALL", label: "Semua Risiko" },
    { value: "LOW", label: "Risiko Rendah" },
    { value: "MEDIUM", label: "Risiko Sedang" },
    { value: "HIGH", label: "Risiko Tinggi" },
  ];

  const activeFilterLabel = filterOptions.find((o) => o.value === riskFilter)?.label || "Filter";

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daftar Pasien</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} dari {patients.length} pasien ditampilkan
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRegisterModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Registrasi Pasien
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIK..."
            className="input !pl-11"
          />
        </div>

        {/* Filter dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setShowFilterDropdown((v) => !v)}
            className={`btn btn-ghost border flex items-center gap-2 ${riskFilter !== "ALL" ? "border-[#0EA5E9] text-[#0EA5E9] bg-blue-50" : "border-gray-200"}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{activeFilterLabel}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-30 animate-scaleIn overflow-hidden">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setRiskFilter(opt.value);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    riskFilter === opt.value ? "text-[#0EA5E9] font-semibold bg-blue-50" : "text-gray-700"
                  }`}
                >
                  {opt.label}
                  {riskFilter === opt.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear filter badge */}
        {riskFilter !== "ALL" && (
          <button
            type="button"
            onClick={() => setRiskFilter("ALL")}
            className="btn btn-ghost !p-2 !rounded-xl text-gray-400 hover:text-gray-700"
            title="Hapus filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Patient Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const latest = getLatestScreening(p.id);
          return (
            <div key={p.id} className="card p-5 animate-fadeIn hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{p.nama}</h4>
                  <p className="text-xs text-gray-500">NIK: {p.nik}</p>
                </div>
                {latest && (
                  <span
                    className={`badge ${
                      latest.aiResult === "HIGH"
                        ? "risk-high"
                        : latest.aiResult === "MEDIUM"
                        ? "risk-medium"
                        : "risk-low"
                    }`}
                  >
                    {getRiskLabel(latest.aiResult)}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Usia</span>
                  <span>{calculateAge(p.tanggalLahir)} tahun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Usia Kehamilan</span>
                  <span>{p.usiaKehamilan} minggu</span>
                </div>
                {latest && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TD Terakhir</span>
                      <span className="font-mono">
                        {latest.systolic}/{latest.diastolic} mmHg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Screening Terakhir</span>
                      <span>{formatDate(latest.createdAt)}</span>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(p.id)}
                className="btn btn-ghost w-full !text-[#0EA5E9] border border-gray-200 hover:border-[#0EA5E9] hover:bg-blue-50"
              >
                <Eye className="w-4 h-4" />
                Detail
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Tidak ada pasien ditemukan</p>
          <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian atau filter</p>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!registerSuccess) setShowRegisterModal(false);
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scaleIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Registrasi Pasien Baru</h3>
              {!registerSuccess && (
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="btn btn-ghost !p-1.5 !rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {registerSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Registrasi Berhasil!</h4>
                <p className="text-sm text-gray-500">Pasien baru telah berhasil didaftarkan.</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={registerForm.nama}
                    onChange={(e) => setRegisterForm({ ...registerForm, nama: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={16}
                    value={registerForm.nik}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, nik: e.target.value.replace(/\D/g, "") })
                    }
                    placeholder="16 digit NIK"
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={registerForm.tanggalLahir}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, tanggalLahir: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Usia Kehamilan <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min={1}
                      max={42}
                      value={registerForm.usiaKehamilan}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, usiaKehamilan: e.target.value })
                      }
                      placeholder="Minggu"
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={registerForm.alamat}
                    onChange={(e) => setRegisterForm({ ...registerForm, alamat: e.target.value })}
                    placeholder="Masukkan alamat lengkap"
                    className="input !h-20 resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="btn btn-ghost flex-1 border border-gray-200"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    <Plus className="w-4 h-4" />
                    Daftarkan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && detailPatient && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDetailModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-bold text-gray-900">Detail Pasien</h3>
              <button
                type="button"
                onClick={() => setShowDetailModal(null)}
                className="btn btn-ghost !p-1.5 !rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Patient Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{detailPatient.nama}</h4>
                  <p className="text-sm text-gray-500">NIK: {detailPatient.nik}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Usia", value: `${calculateAge(detailPatient.tanggalLahir)} tahun` },
                  { label: "Usia Kehamilan", value: `${detailPatient.usiaKehamilan} minggu` },
                  { label: "Tanggal Lahir", value: formatDate(detailPatient.tanggalLahir) },
                  { label: "Alamat", value: detailPatient.alamat },
                ].map((item) => (
                  <div key={item.label} className={item.label === "Alamat" ? "col-span-2" : ""}>
                    <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                    <div className="text-sm font-medium text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Latest Screening */}
              {detailScreening && (
                <div className="border-t border-gray-100 pt-5">
                  <h5 className="text-sm font-bold text-gray-900 mb-3">Screening Terakhir</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50">
                      <div className="text-xs text-gray-400">Tekanan Darah</div>
                      <div className="text-lg font-bold text-gray-900 font-mono">
                        {detailScreening.systolic}/{detailScreening.diastolic}
                        <span className="text-xs text-gray-400 font-normal ml-1">mmHg</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50">
                      <div className="text-xs text-gray-400">Protein Urin</div>
                      <div className="text-lg font-bold text-gray-900 font-mono">
                        {detailScreening.proteinUrin}
                        <span className="text-xs text-gray-400 font-normal ml-1">g/L</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50">
                      <div className="text-xs text-gray-400">Hasil AI</div>
                      <span
                        className={`badge mt-1 ${
                          detailScreening.aiResult === "HIGH"
                            ? "risk-high"
                            : detailScreening.aiResult === "MEDIUM"
                            ? "risk-medium"
                            : "risk-low"
                        }`}
                      >
                        {getRiskLabel(detailScreening.aiResult)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50">
                      <div className="text-xs text-gray-400">Confidence</div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round(detailScreening.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Tanggal: {formatDate(detailScreening.createdAt)}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/dashboard/nakes/monitoring"
                  className="btn btn-ghost flex-1 border border-gray-200"
                  onClick={() => setShowDetailModal(null)}
                >
                  Monitoring
                </Link>
                <Link
                  href="/dashboard/nakes/screening"
                  className="btn btn-primary flex-1"
                  onClick={() => setShowDetailModal(null)}
                >
                  Screening Baru
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
