// AdminProducts.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return navigate("/login");
    const user = JSON.parse(userData);
    if (user.role !== "ADMIN") return navigate("/");
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
        alert("Gagal menghapus produk: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const filteredProducts = products.filter((product) => product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-green-800">Kelola Produk</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/dashboard-admin" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            Dashboard
          </Link>
          <Link to="/admin/users" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            Kelola Pengguna
          </Link>
          <Link to="/admin/products" className="px-4 py-2 bg-green-700 text-white rounded shadow">
            Kelola Produk
          </Link>
          <Link to="/admin/transactions" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            Kelola Transaksi
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <input type="text" placeholder="Cari produk..." className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-green-50">
              <tr>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Nama Produk</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Petani</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Harga</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Stok</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-green-50">
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">{product.nama_produk}</td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">{product.user?.nama || "N/A"}</td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">Rp {product.harga}</td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">
                    {product.stok} {product.satuan}
                  </td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">
                    <button className="text-green-600 hover:underline mr-2" onClick={() => navigate(`/produk/${product.id}`)}>
                      Detail
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDeleteProduct(product.id)}>
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
  );
}
