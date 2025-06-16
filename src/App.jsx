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
import ProfilePembeli from "./pages/pembeli/ProfilePembeli";
import AdminProductDetail from "./pages/admin/AdminProductDetail";
import AdminTransactionDetail from "./pages/admin/AdminTransactionDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "./components/CustomToast";

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
      "/admin/produk",
      "/admin/transaksi",
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

  // Tambahkan fungsi untuk mengecek apakah rute saat ini adalah login atau register
  const isAuthRoute = () => {
    return location.pathname === "/login" || location.pathname === "/register";
  };

  const isAdmin = user && user.role === "ADMIN";
  const showAdminSidebar = isAdmin && isAdminRoute();

  const isPetani = user && user.role === "PETANI";
  const showPetaniSidebar = isPetani && isPetaniRoute();

  const isPembeli = user && user.role === "PEMBELI";
  const showPembeliSidebar = isPembeli && isPembeliRoute();

  return (
    <>
      {/* Jangan tampilkan navbar atau sidebar jika berada di halaman login atau register */}
      {!isAuthRoute() && (
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
        </>
      )}
      <div className={showAdminSidebar || showPetaniSidebar ? "pl-64" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<ProdukList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Rute yang dilindungi untuk Petani */}
          <Route
            path="/tambah-produk"
            element={
              <ProtectedRoute allowedRoles={["PETANI"]}>
                <TambahProduk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-petani"
            element={
              <ProtectedRoute allowedRoles={["PETANI"]}>
                <DashboardPetani />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-produk/:id"
            element={
              <ProtectedRoute allowedRoles={["PETANI"]}>
                <EditProduk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pesanan/:id"
            element={
              <ProtectedRoute allowedRoles={["PETANI"]}>
                <DetailPesanan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daftar-pesanan"
            element={
              <ProtectedRoute allowedRoles={["PETANI"]}>
                <DaftarPesanan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/laporan-penjualan"
            element={
              <ProtectedRoute allowedRoles={["PETANI"]}>
                <LaporanPenjualan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daftar-produk"
            element={
              <ProtectedRoute allowedRoles={["PETANI"]}>
                <DaftarProduk />
              </ProtectedRoute>
            }
          />

          {/* Rute yang dilindungi untuk Admin */}
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/produk/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transaksi/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminTransactionDetail />
              </ProtectedRoute>
            }
          />

          {/* Rute yang dilindungi untuk Pembeli */}
          <Route
            path="/dashboard-pembeli"
            element={
              <ProtectedRoute allowedRoles={["PEMBELI"]}>
                <DashboardPembeli />
              </ProtectedRoute>
            }
          />
          <Route
            path="/keranjang"
            element={
              <ProtectedRoute allowedRoles={["PEMBELI"]}>
                <Keranjang />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail-transaksi/:id"
            element={
              <ProtectedRoute allowedRoles={["PEMBELI"]}>
                <DetailTransaksi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daftar-pesanan-pembeli"
            element={
              <ProtectedRoute allowedRoles={["PEMBELI"]}>
                <DaftarPesananPembeli />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail-pesanan-pembeli/:id"
            element={
              <ProtectedRoute allowedRoles={["PEMBELI"]}>
                <DetailPesananPembeli />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["PEMBELI"]}>
                <ProfilePembeli />
              </ProtectedRoute>
            }
          />

          {/* Rute yang dilindungi untuk semua user yang login */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "PETANI", "PEMBELI"]}>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Rute publik untuk detail produk */}
          <Route path="/produk/:id" element={<DetailProduk />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
      <ToastContainer />
    </Router>
  );
}
