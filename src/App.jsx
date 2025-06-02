import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProdukList from "./pages/ProdukList";
import Navbar from "./components/Navbar";
import AdminSidebar from "./components/AdminSidebar";
import TambahProduk from "./pages/TambahProduk";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardPetani from "./pages/DashboardPetani";
import DashboardPembeli from "./pages/DashboardPembeli";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminTransactions from "./pages/admin/AdminTransactions";
import EditProduk from "./pages/EditProduk";
import DetailPesanan from "./pages/DetailPesanan";
import DaftarPesanan from "./pages/DaftarPesanan";
import LaporanPenjualan from "./pages/LaporanPenjualan";

// Komponen wrapper untuk mendeteksi rute dan menampilkan layout yang sesuai
function AppLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isAdminRoute = () => {
    const adminRoutes = [
      "/dashboard-admin",
      "/admin/users",
      "/admin/products",
      "/admin/transactions",
    ];
    return adminRoutes.some((route) => location.pathname.startsWith(route));
  };

  const isAdmin = user && user.role === "ADMIN";
  const showSidebar = isAdmin && isAdminRoute();

  return (
    <>
      {showSidebar ? <AdminSidebar /> : <Navbar />}
      <div className={showSidebar ? "pl-64" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<ProdukList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tambah-produk" element={<TambahProduk />} />
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/dashboard-petani" element={<DashboardPetani />} />
          <Route path="/dashboard-pembeli" element={<DashboardPembeli />} />

          {/* Rute baru untuk halaman admin terpisah */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/edit-produk/:id" element={<EditProduk />} />
          <Route path="/pesanan/:id" element={<DetailPesanan />} />
          <Route path="/daftar-pesanan" element={<DaftarPesanan />} />
          <Route path="/laporan-penjualan" element={<LaporanPenjualan />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
