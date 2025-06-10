import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaHistory,
  FaChartLine,
  FaLeaf,
  FaCarrot,
  FaAppleAlt,
  FaSeedling,
  FaFish,
  FaEgg,
} from "react-icons/fa";

export default function DashboardPembeli() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const navigate = useNavigate();

  // Kategori produk
  const categories = [
    { name: "Sayuran", icon: "🥬", color: "bg-green-100 text-green-600" },
    { name: "Buah", icon: "🍎", color: "bg-red-100 text-red-600" },
    { name: "Biji-bijian", icon: "🌱", color: "bg-yellow-100 text-yellow-600" },
    { name: "Rempah", icon: "🌿", color: "bg-emerald-100 text-emerald-600" },
    { name: "Protein", icon: "🥚", color: "bg-orange-100 text-orange-600" },
    { name: "Organik", icon: "🌾", color: "bg-lime-100 text-lime-600" },
    { name: "Olahan", icon: "🥫", color: "bg-purple-100 text-purple-600" },
    { name: "Lainnya", icon: "🛒", color: "bg-blue-100 text-blue-600" },
  ];

  // Banner slides
  const banners = [
    "https://marketplace.canva.com/EAGhzRtZBg0/1/0/1600w/canva-buah-tropis-indonesia%3A-keanekaragaman-dan-keunikan-eH8SrkKlTtQ.jpg",
    "https://png.pngtree.com/template/20220330/ourmid/pngtree-fresh-fruit-and-vegetable-mall-banner-image_909172.jpg",
    "https://png.pngtree.com/template/20211025/ourmid/pngtree-summer-fruit-event-orange-simple-e-commerce-full-screen-banner-image_654141.jpg",
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== "PEMBELI") {
      navigate("/");
      return;
    }

    setUser(userObj);

    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsRes = await API.get(
          `/transaksi?user_id=${userObj.id}`
        );
        setTransactions(transactionsRes.data);

        // Fetch products
        const productsRes = await API.get("/produk?limit=8");
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto slide for banner
    const slideInterval = setInterval(() => {
      if (!isBannerHovered) {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [navigate, isBannerHovered]);

  // Group products into slides of 4
  const productSlides = [];
  for (let i = 0; i < products.length; i += 4) {
    productSlides.push(products.slice(i, i + 4));
  }

  const setBannerSlide = (direction) => {
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    } else {
      setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-blue-600 font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-6 px-4 sm:px-6 lg:px-8">
              <div className="relative">
                {/* Main Banner Carousel */}
                <div
                  className="relative overflow-hidden rounded-xl shadow-lg h-64 md:h-80"
                  onMouseEnter={() => setIsBannerHovered(true)}
                  onMouseLeave={() => setIsBannerHovered(false)}
                >
                  <div
                    className="flex transition-transform duration-1000 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {banners.map((banner, index) => (
                      <div key={index} className="w-full flex-shrink-0 h-full">
                        <div
                          className="relative w-full h-full bg-cover bg-center flex items-center"
                          style={{ backgroundImage: `url(${banner})` }}
                        >
                          {/* Black overlay */}
                          <div className="absolute inset-0 bg-black/50"></div>

                          {/* Content */}
                          <div className="relative px-10 py-6 text-white max-w-full rounded-lg ms-20">
                            <h2 className="text-2xl font-bold mb-2">
                              Selamat Datang di Dashboard Pembeli
                            </h2>
                            <p className="mb-4">
                              Temukan produk pertanian segar dan berkualitas
                            </p>
                            <Link
                              to="/produk"
                              className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                            >
                              Belanja Sekarang
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setBannerSlide("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setBannerSlide("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentSlide
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 border-l-4 border-blue-500">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShoppingBag className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pembelian</p>
              <p className="text-2xl font-bold text-gray-800">
                {transactions.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 border-l-4 border-green-500">
            <div className="bg-green-100 p-3 rounded-full">
              <FaBoxOpen className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pesanan Aktif</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  transactions.filter(
                    (t) => t.status !== "SELESAI" && t.status !== "DIBATALKAN"
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 border-l-4 border-purple-500">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaHistory className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pesanan Selesai</p>
              <p className="text-2xl font-bold text-gray-800">
                {transactions.filter((t) => t.status === "SELESAI").length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 border-l-4 border-yellow-500">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaChartLine className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Belanja</p>
              <p className="text-2xl font-bold text-gray-800">
                Rp{" "}
                {transactions
                  .reduce((sum, t) => sum + (parseInt(t.total_harga) || 0), 0)
                  .toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Icons Grid */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Kategori Pilihan
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/kategori/${category.name.toLowerCase()}`}
                className="group flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-xl">{category.icon}</span>
                </div>
                <span className="text-xs text-gray-700 text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Produk Rekomendasi
            </h2>
            <Link
              to="/produk"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="relative overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    to={`/produk/${product.id}`}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative">
                      {product.foto_url ? (
                        <img
                          src={product.foto_url}
                          alt={product.nama_produk}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
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
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Unggulan
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">
                        {product.nama_produk}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-600">
                          Rp {Number(product.harga).toLocaleString()}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>⭐</span>
                          <span className="ml-1">4.8</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.lokasi || "Jakarta"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                Belum ada produk unggulan tersedia
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Riwayat Pembelian Terbaru
            </h2>
            <Link
              to="/riwayat-transaksi"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tanggal
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Alamat
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.tanggal).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rp {transaction.total_harga.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              transaction.status === "SELESAI"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "DIBATALKAN"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaction.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {transaction.alamat_pengiriman}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/detail-transaksi/${transaction.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada transaksi</p>
                <Link
                  to="/produk"
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Mulai Belanja
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
