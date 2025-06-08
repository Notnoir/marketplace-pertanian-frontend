import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaEye,
  FaStar,
  FaMapMarkerAlt,
  FaStore,
  FaSpinner,
  FaBox,
  FaSearch,
} from "react-icons/fa";
import API from "../services/api";

export default function ProdukList() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cek apakah ada query parameter untuk pencarian
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search");

    if (searchQuery) {
      setSearchTerm(searchQuery);
    }

    API.get("/produk")
      .then((res) => setProduk(res.data))
      .catch((err) => alert("Gagal load produk: " + err.message))
      .finally(() => setLoading(false));
  }, [location.search]);

  // Fungsi untuk melakukan pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL dengan query parameter
    navigate(`/produk?search=${encodeURIComponent(searchTerm)}`);
  };

  const filteredProduk = produk.filter((p) =>
    p.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border animate-pulse"
        >
          <div className="h-40 bg-gray-200 rounded-t-lg"></div>
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Semua Produk</h1>
            <div className="flex items-center text-gray-500">
              <FaSpinner className="animate-spin mr-2" />
              <span>Memuat produk...</span>
            </div>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (produk.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <FaBox className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Belum Ada Produk
          </h2>
          <p className="text-gray-500 mb-6">
            Produk akan ditampilkan di sini ketika sudah tersedia
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Semua Produk
            </h1>
            <p className="text-gray-500">
              Ditemukan {filteredProduk.length} produk
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md w-full sm:w-auto">
            <form onSubmit={handleSearch}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Search"
              >
                <span className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Cari
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProduk.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FaSearch className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Produk tidak ditemukan
          </h3>
          <p className="text-gray-500">
            Coba gunakan kata kunci lain untuk pencarian
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredProduk.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group overflow-hidden"
            >
              <Link to={`/produk/${p.id}`} className="block">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  {p.foto_url ? (
                    <img
                      src={p.foto_url}
                      alt={p.nama_produk}
                      className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <FaBox className="text-3xl text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  {/* Product Name */}
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                    {p.nama_produk}
                  </h3>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-lg font-bold text-orange-500">
                      {formatPrice(p.harga)}
                    </span>
                  </div>

                  {/* Rating & Sales (Mock data for demo) */}
                  <div className="flex items-center mb-2 text-xs text-gray-500">
                    <div className="flex items-center mr-2">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>4.5</span>
                    </div>
                    <span className="mx-1">•</span>
                    <span>Terjual 100+</span>
                  </div>

                  {/* Location & Store */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      <span className="truncate">Jakarta</span>
                    </div>
                    <div className="flex items-center">
                      <FaStore className="mr-1" />
                      <span className="truncate">Toko</span>
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="mt-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stok > 10
                          ? "bg-green-100 text-green-700"
                          : p.stok > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.stok > 0 ? `Stok: ${p.stok} ${p.satuan}` : "Habis"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Quick Action Button */}
              <div className="px-3 pb-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/produk/${p.id}`);
                  }}
                  className="w-full bg-white border border-green-600 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FaShoppingCart className="text-xs" />
                  <span>+ Keranjang</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (for pagination) */}
      {filteredProduk.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
            Lihat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
}
