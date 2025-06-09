import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaMoneyBillWave,
  FaArrowLeft,
  FaSignOutAlt,
  FaComments,
  FaLeaf,
  FaSeedling,
} from "react-icons/fa";

export default function AdminSidebar() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fungsi untuk menentukan apakah menu aktif
  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105"
      : "text-gray-700 hover:bg-green-50 hover:text-green-700";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="bg-white w-64 min-h-screen fixed left-0 top-0 z-40 shadow-xl border-r border-green-100">
      {/* Header */}
      <div className="p-6 border-b border-green-100 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-4 translate-x-4"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full translate-y-4 -translate-x-4"></div>

        <div className="relative z-10 flex items-center mb-3">
          <div className="bg-white p-2 rounded-lg shadow-md mr-3">
            <FaLeaf className="text-green-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AgriConnect</h2>
            <p className="text-xs text-green-100">Admin Panel</p>
          </div>
        </div>

        <div className="relative z-10 bg-white/ 20 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="bg-white p-1.5 rounded-full mr-3">
              <FaSeedling className="text-green-600 text-sm" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Selamat datang</p>
              <p className="text-xs text-green-100 truncate">{user.nama}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          <Link
            to="/dashboard-admin"
            className={`flex items-center p-3 rounded-xl transition-all duration-300 ${isActive(
              "/dashboard-admin"
            )}`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 mr-3">
              <FaHome className="text-green-600 text-lg" />
            </div>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center p-3 rounded-xl transition-all duration-300 ${isActive(
              "/admin/users"
            )}`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 mr-3">
              <FaUsers className="text-blue-600 text-lg" />
            </div>
            <span className="font-medium">Kelola Pengguna</span>
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center p-3 rounded-xl transition-all duration-300 ${isActive(
              "/admin/products"
            )}`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 mr-3">
              <FaBoxOpen className="text-orange-600 text-lg" />
            </div>
            <span className="font-medium">Kelola Produk</span>
          </Link>

          <Link
            to="/admin/transactions"
            className={`flex items-center p-3 rounded-xl transition-all duration-300 ${isActive(
              "/admin/transactions"
            )}`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100 mr-3">
              <FaMoneyBillWave className="text-yellow-600 text-lg" />
            </div>
            <span className="font-medium">Kelola Transaksi</span>
          </Link>

          <Link
            to="/chat"
            className={`flex items-center p-3 rounded-xl transition-all duration-300 ${isActive(
              "/chat"
            )}`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 mr-3">
              <FaComments className="text-purple-600 text-lg" />
            </div>
            <span className="font-medium">Chat</span>
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-1">
          <Link
            to="/"
            className="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 mr-3">
              <FaArrowLeft className="text-gray-600 text-lg" />
            </div>
            <span className="font-medium">Kembali ke Beranda</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 group-hover:bg-red-200 mr-3 transition-colors duration-300">
              <FaSignOutAlt className="text-red-600 text-lg" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
