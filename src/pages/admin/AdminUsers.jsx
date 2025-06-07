// AdminUsers.jsx
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
    const userData = localStorage.getItem("user");
    if (!userData) return navigate("/login");
    const user = JSON.parse(userData);
    if (user.role !== "ADMIN") return navigate("/");
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
      resetForm();
      fetchUsers();
      alert("Pengguna berhasil ditambahkan");
    } catch (error) {
      alert("Gagal menambahkan pengguna: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${editingUser.id}`, userForm);
      setShowEditUserModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
      alert("Pengguna berhasil diperbarui");
    } catch (error) {
      alert("Gagal memperbarui pengguna: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setConfirmDelete(null);
      fetchUsers();
      alert("Pengguna berhasil dihapus");
    } catch (error) {
      alert("Gagal menghapus pengguna: " + (error.response?.data?.message || error.message));
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setUserForm({
      nama: user.nama,
      email: user.email,
      password: "",
      role: user.role,
      alamat: user.alamat,
      no_hp: user.no_hp,
    });
    setShowEditUserModal(true);
  };

  const resetForm = () => {
    setUserForm({
      nama: "",
      email: "",
      password: "",
      role: "PEMBELI",
      alamat: "",
      no_hp: "",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-green-800">Kelola Pengguna</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/dashboard-admin" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">Dashboard</Link>
          <Link to="/admin/users" className="px-4 py-2 bg-green-700 text-white rounded shadow">Kelola Pengguna</Link>
          <Link to="/admin/products" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">Kelola Produk</Link>
          <Link to="/admin/transactions" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">Kelola Transaksi</Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Cari pengguna..." className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">Semua Role</option>
              <option value="ADMIN">Admin</option>
              <option value="PETANI">Petani</option>
              <option value="PEMBELI">Pembeli</option>
            </select>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow" onClick={() => setShowAddUserModal(true)}>Tambah Pengguna</button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">No. HP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "ADMIN" ? "bg-red-100 text-red-700" : user.role === "PETANI" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.no_hp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.alamat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-green-600 hover:underline mr-2" onClick={() => openEditModal(user)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => setConfirmDelete(user)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals (Add/Edit/Delete) tetap seperti sebelumnya */}
    </div>
  );
}
