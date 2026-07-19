"use client";

import { Users, UserPlus, Mail, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

const INITIAL_USERS = [
  { id: "1", name: "Siti Aminah", email: "pasien@preecare.id", role: "PASIEN", facility: "—" },
  { id: "2", name: "Bidan Ratna", email: "nakes@preecare.id", role: "NAKES", facility: "Puskesmas Menteng" },
  { id: "3", name: "Dr. Anwar", email: "dokter@preecare.id", role: "DOKTER", facility: "RS Cipto Mangunkusumo" },
  { id: "4", name: "Administrator PREECARE", email: "admin@preecare.id", role: "ADMIN", facility: "—" },
];

export default function AdminUsersPage() {
  const [userList, setUserList] = useState(INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "NAKES", facility: "" });

  const handleAddUser = () => {
    setUserList((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        facility: formData.facility || "—",
      },
    ]);
    setShowModal(false);
    setFormData({ name: "", email: "", role: "NAKES", facility: "" });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data akun bidan, dokter, administrator, dan pasien yang terdaftar di dalam sistem.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <UserPlus className="w-4 h-4" />
          Tambah Akun
        </button>
      </div>

      <div className="card p-6 bg-white">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama Pengguna</th>
                <th>Email</th>
                <th>Hak Akses (Role)</th>
                <th>Fasilitas Kesehatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="font-bold text-gray-950">{user.name}</div>
                  </td>
                  <td>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "ADMIN"
                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                          : user.role === "DOKTER"
                          ? "bg-sky-50 text-sky-600 border border-sky-100"
                          : user.role === "NAKES"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-gray-50 text-gray-600 border border-gray-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm text-gray-600">{user.facility}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-ghost !p-2 !rounded-lg text-slate-400 hover:text-slate-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost !p-2 !rounded-lg text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-905 mb-6">Tambah Pengguna Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Siti Aminah"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@preecare.id"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input"
                  >
                    <option value="PASIEN">PASIEN</option>
                    <option value="NAKES">NAKES</option>
                    <option value="DOKTER">DOKTER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faskes</label>
                  <input
                    type="text"
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                    placeholder="Puskesmas / RS"
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                Batal
              </button>
              <button onClick={handleAddUser} className="btn btn-primary">
                Tambah Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
