import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DaftarProduk() {
  const [products, setProducts] = useState([]);
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
        // Sudah menggunakan filter user_id untuk hanya menampilkan produk milik petani yang login
        const productsRes = await API.get(`/produk?user_id=${userObj.id}`);
        setProducts(productsRes.data);
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
      <div className="text-center p-10 text-green-700 font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">
        Daftar Produk Saya
      </h1>

      <div className="flex justify-end mb-6">
        <Link
          to="/tambah-produk"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Tambah Produk Baru
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="py-3 px-5 border-b font-semibold">
                  Nama Produk
                </th>
                <th className="py-3 px-5 border-b font-semibold">Harga</th>
                <th className="py-3 px-5 border-b font-semibold">Stok</th>
                <th className="py-3 px-5 border-b font-semibold">Deskripsi</th>
                <th className="py-3 px-5 border-b font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
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
                  <td className="py-3 px-5 border-b">
                    Rp {(product.harga ?? 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-5 border-b">
                    {product.stok} {product.satuan}
                  </td>
                  <td className="py-3 px-5 border-b">
                    {product.deskripsi
                      ? product.deskripsi.length > 50
                        ? `${product.deskripsi.substring(0, 50)}...`
                        : product.deskripsi
                      : "-"}
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
      </div>

      {/* Modal konfirmasi hapus */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Konfirmasi Hapus
            </h3>
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
    </div>
  );
}
