import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "PEMBELI",
    alamat: "",
    no_hp: "",
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Cek autentikasi dan role
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }

    // Ambil data pengguna
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", userForm);
      setShowAddUserModal(false);
      setUserForm({
        nama: "",
        email: "",
        password: "",
        role: "PEMBELI",
        alamat: "",
        no_hp: "",
      });
      fetchUsers();
      alert("Pengguna berhasil ditambahkan");
    } catch (error) {
      alert(
        "Gagal menambahkan pengguna: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${editingUser.id}`, userForm);
      setShowEditUserModal(false);
      setEditingUser(null);
      setUserForm({
        nama: "",
        email: "",
        password: "",
        role: "PEMBELI",
        alamat: "",
        no_hp: "",
      });
      fetchUsers();
      alert("Pengguna berhasil diperbarui");
    } catch (error) {
      alert(
        "Gagal memperbarui pengguna: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setConfirmDelete(null);
      fetchUsers();
      alert("Pengguna berhasil dihapus");
    } catch (error) {
      alert(
        "Gagal menghapus pengguna: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setUserForm({
      nama: user.nama,
      email: user.email,
      password: "", // Password kosong karena tidak ingin mengubah password
      role: user.role,
      alamat: user.alamat,
      no_hp: user.no_hp,
    });
    setShowEditUserModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-green-800">Kelola Pengguna</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Menu Navigasi Admin */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/dashboard-admin"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Kelola Pengguna
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kelola Produk
          </Link>
          <Link
            to="/admin/transactions"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kelola Transaksi
          </Link>
        </div>

        {/* Users Management */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Cari pengguna..."
                className="px-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border rounded-lg"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Semua Role</option>
                <option value="ADMIN">Admin</option>
                <option value="PETANI">Petani</option>
                <option value="PEMBELI">Pembeli</option>
              </select>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={() => setShowAddUserModal(true)}
            >
              Tambah Pengguna
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Nama</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Role</th>
                    <th className="py-2 px-4 border-b">No. HP</th>
                    <th className="py-2 px-4 border-b">Alamat</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-2 px-4 border-b">{user.nama}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : user.role === "PETANI"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{user.no_hp}</td>
                      <td className="py-2 px-4 border-b">{user.alamat}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setConfirmDelete(user)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Tambah Pengguna Baru</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.nama}
                  onChange={(e) =>
                    setUserForm({ ...userForm, nama: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                >
                  <option value="ADMIN">Admin</option>
                  <option value="PETANI">Petani</option>
                  <option value="PEMBELI">Pembeli</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">No. HP</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.no_hp}
                  onChange={(e) =>
                    setUserForm({ ...userForm, no_hp: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Alamat</label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.alamat}
                  onChange={(e) =>
                    setUserForm({ ...userForm, alamat: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Pengguna</h2>
            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.nama}
                  onChange={(e) =>
                    setUserForm({ ...userForm, nama: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Password (Kosongkan jika tidak ingin mengubah)
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                >
                  <option value="ADMIN">Admin</option>
                  <option value="PETANI">Petani</option>
                  <option value="PEMBELI">Pembeli</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">No. HP</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.no_hp}
                  onChange={(e) =>
                    setUserForm({ ...userForm, no_hp: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Alamat</label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  value={userForm.alamat}
                  onChange={(e) =>
                    setUserForm({ ...userForm, alamat: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowEditUserModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-4">
              Apakah Anda yakin ingin menghapus pengguna{" "}
              <strong>{confirmDelete.nama}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                onClick={() => setConfirmDelete(null)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDeleteUser(confirmDelete.id)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
