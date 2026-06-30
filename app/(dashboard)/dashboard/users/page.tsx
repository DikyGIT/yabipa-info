"use client";

import { useState, useEffect } from "react";

type User = {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
};

const UsersPage = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("GURU");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUserList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setRole("GURU");
    setEditId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const body: Record<string, string> = { username, name, role };
    if (password) body.password = password;

    let res;
    if (editId) {
      if (!password) {
        setError("Password wajib diisi saat edit user");
        return;
      }
      res = await fetch(`/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      if (!password) {
        setError("Password wajib diisi");
        return;
      }
      res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan user");
      return;
    }

    setSuccess(editId ? "User berhasil diupdate!" : "User berhasil ditambahkan!");
    resetForm();
    loadUsers();
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setUsername(user.username);
    setName(user.name);
    setRole(user.role);
    setPassword("");
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Yakin ingin menghapus user "${username}"?`)) return;

    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Gagal menghapus user");
      return;
    }
    loadUsers();
  };

  const roleLabel = (r: string) => {
    if (r === "ADMIN") return { text: "Admin", color: "bg-red-100 text-red-700" };
    if (r === "KEPALA") return { text: "Kepala", color: "bg-yellow-100 text-yellow-700" };
    return { text: "Guru", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="mt-5 ml-5">
      <h1 className="text-4xl font-bold">Kelola User</h1>

      {/* Form Tambah/Edit User */}
      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold">{editId ? "Edit User" : "Tambah User"}</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="name" className="mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="username" className="mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col lg:items-center gap-5">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="password" className="mb-1">
                Password {editId && <span className="opacity-50">(isi untuk ganti)</span>} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editId ? "Masukkan password baru" : "Masukkan password"}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="role" className="mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              >
                <option value="KEPALA">Kepala Sekolah</option>
                <option value="GURU">Guru</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-800 text-white py-2 px-6 rounded-md hover:bg-blue-900 hover:cursor-pointer"
            >
              {editId ? "Update" : "Simpan"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 hover:cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel User */}
      <div className="bg-white shadow rounded p-6 mt-5">
        <h1 className="text-xl font-bold mb-4">Tabel User</h1>
        {loading ? (
          <p>Memuat data...</p>
        ) : userList.length === 0 ? (
          <p className="text-gray-500">Belum ada user.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">No</th>
                  <th className="p-3 border">Nama</th>
                  <th className="p-3 border">Username</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => {
                  const rl = roleLabel(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">{user.name}</td>
                      <td className="p-3 border">{user.username}</td>
                      <td className="p-3 border">
                        <span className={`text-xs px-2 py-1 rounded ${rl.color}`}>
                          {rl.text}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
