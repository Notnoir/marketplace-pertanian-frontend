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
      const productsRes = await API.get(`/produk?user_id=${user.id}`);
      setProducts(productsRes.data);
      setConfirmDelete(null);
      alert("Produk berhasil dihapus");
    } catch (error) {
      alert("Gagal menghapus produk: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-green-700 font-semibold">Loading...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">
        Dashboard Petani
      </h1>
      <p className="text-center text-green-700 mb-12 text-lg">
        Selamat datang, <span className="font-semibold">{user?.nama}</span>!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-green-600 text-5xl font-extrabold mb-2">{products.length}</div>
          <div className="text-gray-700 font-medium">Total Produk</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-green-600 text-5xl font-extrabold mb-2">{transactions.length}</div>
          <div className="text-gray-700 font-medium">Total Penjualan</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Link
          to="/tambah-produk"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Tambah Produk
        </Link>
        <Link
          to="/daftar-pesanan"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Lihat Semua Pesanan
        </Link>
        <Link
          to="/laporan-penjualan"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Laporan Penjualan
        </Link>
      </div>

      <section className="bg-white rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-green-800 text-center">
          Produk Saya
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="py-3 px-5 border-b font-semibold">Nama Produk</th>
                <th className="py-3 px-5 border-b font-semibold">Harga</th>
                <th className="py-3 px-5 border-b font-semibold">Stok</th>
                <th className="py-3 px-5 border-b font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Belum ada produk
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="py-3 px-5 border-b">{product.nama_produk}</td>
                  <td className="py-3 px-5 border-b">Rp {product.harga.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-5 border-b">
                    {product.stok} {product.satuan}
                  </td>
                  <td className="py-3 px-5 border-b">
                    <Link
                      to={`/edit-produk/${product.id}`}
                      className="text-blue-600 hover:underline font-medium mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal konfirmasi hapus */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Konfirmasi Hapus</h3>
            <p className="mb-6 text-center">
              Apakah Anda yakin ingin menghapus produk ini?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteProduct(confirmDelete)}
                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800 text-center">
          Penjualan Terbaru
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="py-3 px-5 border-b font-semibold">Tanggal</th>
                <th className="py-3 px-5 border-b font-semibold">Produk</th>
                <th className="py-3 px-5 border-b font-semibold">Jumlah</th>
                <th className="py-3 px-5 border-b font-semibold">Total</th>
                <th className="py-3 px-5 border-b font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Belum ada penjualan
                  </td>
                </tr>
              )}
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="py-3 px-5 border-b">
                    {new Date(transaction.tanggal).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-5 border-b">
                    {transaction.produk?.nama_produk || "N/A"}
                  </td>
                  <td className="py-3 px-5 border-b">{transaction.jumlah}</td>
                  <td className="py-3 px-5 border-b">
                    Rp {transaction.total_harga.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-5 border-b capitalize">{transaction.status.toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
