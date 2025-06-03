import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DashboardPetani() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek autentikasi dan role
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== "PETANI") {
      navigate("/");
      return;
    }

    setUser(userObj);

    // Ambil data produk petani dan transaksi terkait
    const fetchData = async () => {
      try {
        const productsRes = await API.get(`/produk?user_id=${userObj.id}`);
        setProducts(productsRes.data);

        const transactionsRes = await API.get(
          `/transaksi/petani/${userObj.id}`
        );
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteProduct = async (productId) => {
    try {
      await API.delete(`/produk/${productId}`);
      // Refresh data produk setelah hapus
      const productsRes = await API.get(`/produk?user_id=${user.id}`);
      setProducts(productsRes.data);
      setConfirmDelete(null);
      alert("Produk berhasil dihapus");
    } catch (error) {
      alert("Gagal menghapus produk: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Dashboard Petani
      </h1>
      <p className="mb-6">Selamat datang, {user?.nama}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Produk</h2>
          <p className="text-3xl font-bold text-green-600">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Penjualan</h2>
          <p className="text-3xl font-bold text-green-600">
            {transactions.length}
          </p>
        </div>
      </div>

      {/* Navigasi */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Menu</h2>
        <div className="space-x-2">
          <Link
            to="/tambah-produk"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tambah Produk
          </Link>
          <Link
            to="/daftar-pesanan"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Lihat Semua Pesanan
          </Link>
          <Link
            to="/laporan-penjualan"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Laporan Penjualan
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Produk Saya</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nama Produk</th>
                <th className="py-2 px-4 border-b">Harga</th>
                <th className="py-2 px-4 border-b">Stok</th>
                <th className="py-2 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b">{product.nama_produk}</td>
                  <td className="py-2 px-4 border-b">Rp {product.harga}</td>
                  <td className="py-2 px-4 border-b">
                    {product.stok} {product.satuan}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/edit-produk/${product.id}`}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      className="text-red-500 hover:underline"
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

      {/* Modal konfirmasi hapus */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-4">
              Apakah Anda yakin ingin menghapus produk ini?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteProduct(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Penjualan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tanggal</th>
                <th className="py-2 px-4 border-b">Produk</th>
                <th className="py-2 px-4 border-b">Jumlah</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b">
                    {new Date(transaction.tanggal).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {transaction.produk?.nama_produk || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.jumlah}</td>
                  <td className="py-2 px-4 border-b">
                    Rp {transaction.total_harga}
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
