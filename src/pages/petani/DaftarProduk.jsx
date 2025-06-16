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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar Produk
              </h1>
            </div>
            <Link
              to="/tambah-produk"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Tambah Produk
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai jual produk pertama Anda sekarang
            </p>
            <Link
              to="/tambah-produk"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
            >
              Tambah Produk Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {products.length}
                  </div>
                  <div className="text-gray-600 text-sm">Total Produk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {products.filter((p) => p.stok > 0).length}
                  </div>
                  <div className="text-gray-600 text-sm">Produk Tersedia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {products.filter((p) => p.stok === 0).length}
                  </div>
                  <div className="text-gray-600 text-sm">Stok Habis</div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Product Image Placeholder */}
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                    {product.foto_url ? (
                      <img
                        src={product.foto_url}
                        alt={product.nama_produk}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                        loading="lazy"
                      />
                    ) : (
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.nama_produk}
                    </h3>

                    <div className="text-xl font-bold text-green-600 mb-2">
                      Rp {(product.harga ?? 0).toLocaleString("id-ID")}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Stok: </span>
                        <span
                          className={`text-sm font-medium ml-1 ${
                            product.stok > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {product.stok} {product.satuan}
                        </span>
                      </div>
                      {product.stok === 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Habis
                        </span>
                      )}
                    </div>

                    {product.deskripsi && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.deskripsi.length > 60
                          ? `${product.deskripsi.substring(0, 60)}...`
                          : product.deskripsi}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-produk/${product.id}`}
                        className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition duration-200 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(product.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Hapus Produk
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteProduct(confirmDelete)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
