import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaPlus,
  FaShoppingBag,
  FaChartLine,
  FaArrowLeft,
  FaSignOutAlt,
  FaComments,
} from "react-icons/fa";

export default function PetaniSidebar() {
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
      ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
      : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user || user.role !== "PETANI") {
    return null;
  }

  return (
    <div className="bg-white text-gray-700 w-64 min-h-screen fixed left-0 top-0 z-40 shadow-lg border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-600">
        <h2 className="text-xl font-bold text-white">Petani Dashboard</h2>
        <p className="text-sm mt-1 text-white opacity-90">
          Selamat datang, {user.nama}
        </p>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          <li>
            <Link
              to="/dashboard-petani"
              className={`flex items-center p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${isActive(
                "/dashboard-petani"
              )}`}
            >
              <FaHome className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/daftar-produk"
              className={`flex items-center p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${isActive(
                "/daftar-produk"
              )}`}
            >
              <FaList className="h-5 w-5 mr-3" />
              Daftar Produk
            </Link>
          </li>
          <li>
            <Link
              to="/tambah-produk"
              className={`flex items-center p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${isActive(
                "/tambah-produk"
              )}`}
            >
              <FaPlus className="h-5 w-5 mr-3" />
              Tambah Produk
            </Link>
          </li>
          <li>
            <Link
              to="/daftar-pesanan"
              className={`flex items-center p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${isActive(
                "/daftar-pesanan"
              )}`}
            >
              <FaShoppingBag className="h-5 w-5 mr-3" />
              Daftar Pesanan
            </Link>
          </li>
          <li>
            <Link
              to="/laporan-penjualan"
              className={`flex items-center p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${isActive(
                "/laporan-penjualan"
              )}`}
            >
              <FaChartLine className="h-5 w-5 mr-3" />
              Laporan Penjualan
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className={`flex items-center p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 ${isActive(
                "/chat"
              )}`}
            >
              <FaComments className="h-5 w-5 mr-3" />
              Chat
            </Link>
          </li>
          <li className="mt-8">
            <Link
              to="/"
              className="flex items-center p-3 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-600"
            >
              <FaArrowLeft className="h-5 w-5 mr-3" />
              Kembali ke Beranda
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-gray-600"
            >
              <FaSignOutAlt className="h-5 w-5 mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
