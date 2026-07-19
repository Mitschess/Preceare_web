"use client";

import { Building2, Plus, Phone, MapPin, Edit3, Trash2 } from "lucide-react";
import { facilities as INITIAL_FACILITIES } from "@/lib/mock-data";
import { useState } from "react";

export default function AdminFacilitiesPage() {
  const [faskesList, setFaskesList] = useState(INITIAL_FACILITIES);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "PUSKESMAS", address: "", phone: "" });

  const handleAddFaskes = () => {
    setFaskesList((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: formData.name,
        type: formData.type as any,
        address: formData.address,
        phone: formData.phone,
      },
    ]);
    setShowModal(false);
    setFormData({ name: "", type: "PUSKESMAS", address: "", phone: "" });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fasilitas Kesehatan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data Rumah Sakit Rujukan dan Puskesmas yang terintegrasi dengan PREECARE.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Tambah Faskes
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {faskesList.map((f) => (
          <div key={f.id} className="card p-6 bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`badge ${
                    f.type === "RUMAH_SAKIT"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  {f.type.replace("_", " ")}
                </span>
                <h3 className="text-lg font-bold text-gray-950 mt-2">{f.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button className="btn btn-ghost !p-2 !rounded-lg text-slate-400 hover:text-slate-600">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="btn btn-ghost !p-2 !rounded-lg text-red-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{f.address}</span>
              </div>
              {f.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{f.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-905 mb-6">Tambah Faskes Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Fasilitas</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="RS Umum Daerah"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input"
                  >
                    <option value="PUSKESMAS">Puskesmas</option>
                    <option value="RUMAH_SAKIT">Rumah Sakit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kontak</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="021-xxxxxx"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nama jalan, nomor, kecamatan..."
                  className="input !h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                Batal
              </button>
              <button onClick={handleAddFaskes} className="btn btn-primary">
                Tambah Faskes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
