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
import TambahProduk from "./pages/petani/TambahProduk";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardPetani from "./pages/petani/DashboardPetani";
import DashboardPembeli from "./pages/pembeli/DashboardPembeli";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminTransactions from "./pages/admin/AdminTransactions";
import EditProduk from "./pages/petani/EditProduk";
import DetailPesanan from "./pages/petani/DetailPesanan";
import DaftarPesanan from "./pages/petani/DaftarPesanan";
import LaporanPenjualan from "./pages/petani/LaporanPenjualan";
import PetaniSidebar from "./components/PetaniSidebar";
import DetailProduk from "./pages/pembeli/DetailProduk";
import Keranjang from "./pages/pembeli/Keranjang";
import DetailTransaksi from "./pages/pembeli/DetailTransaksi";
import PembeliSidebar from "./components/PembeliSidebar";
import DaftarProduk from "./pages/petani/DaftarProduk";
import DaftarPesananPembeli from "./pages/pembeli/DaftarPesananPembeli";
import DetailPesananPembeli from "./pages/pembeli/DetailPesananPembeli";
import Chat from "./pages/Chat";

// Komponen wrapper untuk mendeteksi rute dan menampilkan layout yang sesuai
function AppLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleStorageChange = () => {
      const updatedUserData = localStorage.getItem("user");
      if (updatedUserData) {
        setUser(JSON.parse(updatedUserData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage-event", handleStorageChange);

    return () => {
      window.removeEventListener("storage-event", handleStorageChange);
    };
  }, []);

  const isAdminRoute = () => {
    const adminRoutes = [
      "/dashboard-admin",
      "/admin/users",
      "/admin/products",
      "/admin/transactions",
      "/chat", // Tambahkan rute chat untuk admin
    ];
    return adminRoutes.some((route) => location.pathname.startsWith(route));
  };

  const isPetaniRoute = () => {
    const petaniRoutes = [
      "/dashboard-petani",
      "/tambah-produk",
      "/edit-produk",
      "/daftar-pesanan",
      "/pesanan",
      "/laporan-penjualan",
      "/daftar-produk",
      "/chat", // Tambahkan rute chat untuk petani
    ];
    return petaniRoutes.some((route) => location.pathname.startsWith(route));
  };

  const isPembeliRoute = () => {
    const pembeliRoutes = [
      "/dashboard-pembeli",
      "/keranjang",
      "/detail-transaksi",
      "/produk",
      "/daftar-pesanan-pembeli",
      "/detail-pesanan-pembeli",
      "/chat", // Rute chat sudah ada
    ];
    return pembeliRoutes.some((route) => location.pathname.startsWith(route));
  };

  const isAdmin = user && user.role === "ADMIN";
  const showAdminSidebar = isAdmin && isAdminRoute();

  const isPetani = user && user.role === "PETANI";
  const showPetaniSidebar = isPetani && isPetaniRoute();

  const isPembeli = user && user.role === "PEMBELI";
  const showPembeliSidebar = isPembeli && isPembeliRoute();

  return (
    <>
      {showAdminSidebar ? (
        <AdminSidebar />
      ) : showPetaniSidebar ? (
        <PetaniSidebar />
      ) : showPembeliSidebar ? (
        <PembeliSidebar />
      ) : (
        <Navbar />
      )}
      <div className={showAdminSidebar || showPetaniSidebar ? "pl-64" : ""}>
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
          <Route path="/daftar-produk" element={<DaftarProduk />} />
          {/* Rute baru untuk fitur pembeli */}
          <Route path="/produk/:id" element={<DetailProduk />} />
          <Route path="/keranjang" element={<Keranjang />} />
          <Route path="/detail-transaksi/:id" element={<DetailTransaksi />} />
          {/* Rute baru untuk daftar pesanan dan detail pesanan pembeli */}
          <Route
            path="/daftar-pesanan-pembeli"
            element={<DaftarPesananPembeli />}
          />
          <Route
            path="/detail-pesanan-pembeli/:id"
            element={<DetailPesananPembeli />}
          />
          {/* Tambahkan route untuk Chat di sini */}
          <Route path="/chat" element={<Chat />} />
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

// Hapus kode route yang berada di luar komponen
