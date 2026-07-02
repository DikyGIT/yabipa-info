"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type User = {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
};

const PER_PAGE = 3;

const UsersPage = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("GURU");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loadUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUserList(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => { if (!cancelled) { setUserList(data); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const filtered = userList.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setRole("GURU");
    setShowPassword(false);
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
      Swal.fire({ icon: "error", title: "Gagal", text: data.error || "Gagal menyimpan user", confirmButtonColor: "#1e40af" });
      return;
    }

    Swal.fire({
      icon: "success",
      title: editId ? "User diupdate!" : "User ditambahkan!",
      timer: 1500,
      showConfirmButton: false,
    });
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
    const result = await Swal.fire({
      title: `Hapus user "${username}"?`,
      text: "Data user akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Gagal", text: data.error || "Gagal menghapus user", confirmButtonColor: "#1e40af" });
        return;
      }
      Swal.fire({ icon: "success", title: "Terhapus!", timer: 1000, showConfirmButton: false });
      loadUsers();
    }
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editId ? "Masukkan password baru" : "Masukkan password"}
                  className="border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-800 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
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
                <option value="ADMIN">Admin</option>
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
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h1 className="text-xl font-bold">Tabel User</h1>
          {userList.length > 0 && (
            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded-md py-1.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          )}
        </div>
        {loading ? (
          <p>Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Belum ada user.</p>
        ) : (
          <>
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
                {paged.map((user, index) => {
                  const rl = roleLabel(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{(currentPage - 1) * PER_PAGE + index + 1}</td>
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
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer">&laquo;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded border cursor-pointer ${currentPage === page ? "bg-sky-800 text-white border-sky-800" : "border-gray-300 hover:bg-gray-100"}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer">&raquo;</button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
