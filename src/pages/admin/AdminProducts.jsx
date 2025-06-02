import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

    // Ambil data produk
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get("/produk");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await API.delete(`/produk/${id}`);
        fetchProducts();
        alert("Produk berhasil dihapus");
      } catch (error) {
        alert(
          "Gagal menghapus produk: " + error.response?.data?.message ||
            error.message
        );
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-green-800">Kelola Produk</h1>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kelola Pengguna
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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

        {/* Products Management */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Cari produk..."
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Nama Produk</th>
                    <th className="py-2 px-4 border-b">Petani</th>
                    <th className="py-2 px-4 border-b">Harga</th>
                    <th className="py-2 px-4 border-b">Stok</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="py-2 px-4 border-b">
                        {product.nama_produk}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {product.user?.nama || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">Rp {product.harga}</td>
                      <td className="py-2 px-4 border-b">
                        {product.stok} {product.satuan}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          onClick={() => navigate(`/produk/${product.id}`)}
                        >
                          Detail
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteProduct(product.id)}
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
    </div>
  );
}
