import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  useEffect(() => {
    // Mengambil 8 produk terbaru untuk ditampilkan di halaman utama
    API.get("/produk?limit=8")
      .then((res) => setFeaturedProducts(res.data))
      .catch((err) => console.error("Gagal load produk unggulan:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: "Sayuran", icon: "🥬", color: "bg-green-100 text-green-600" },
    { name: "Buah-buahan", icon: "🍎", color: "bg-red-100 text-red-600" },
    { name: "Bumbu", icon: "🌶️", color: "bg-orange-100 text-orange-600" },
    { name: "Beras", icon: "🌾", color: "bg-yellow-100 text-yellow-600" },
    { name: "Kacang", icon: "🥜", color: "bg-amber-100 text-amber-600" },
    { name: "Rempah", icon: "🧄", color: "bg-purple-100 text-purple-600" },
    { name: "Umbi", icon: "🥔", color: "bg-brown-100 text-brown-600" },
    { name: "Lainnya", icon: "🌱", color: "bg-emerald-100 text-emerald-600" },
  ];

  const promoSlides = [
    {
      title: "Diskon 30% Sayuran Segar",
      subtitle: "Langsung dari petani lokal",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Gratis Ongkir Minimal 50rb",
      subtitle: "Untuk semua produk pertanian",
      image:
        "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Buah Import Terlengkap",
      subtitle: "Kualitas premium harga terjangkau",
      image:
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
    },
  ];

  // Data contoh banner promo
  const promoBanners = [
    {
      items: [
        {
          icon: "🛍️",
          title: "Flash Sale",
          description: "Diskon hingga 70%",
          discount: "UP TO 70%",
          bgColor: "bg-red-50",
        },
        {
          icon: "📱",
          title: "Gadget Sale",
          description: "Smartphone terbaru",
          discount: "UP TO 50%",
          bgColor: "bg-blue-50",
        },
        {
          icon: "👕",
          title: "Fashion Week",
          description: "Koleksi terbaru",
          discount: "UP TO 60%",
          bgColor: "bg-purple-50",
        },
        {
          icon: "🏠",
          title: "Home & Living",
          description: "Dekorasi rumah",
          discount: "UP TO 40%",
          bgColor: "bg-green-50",
        },
      ],
    },
    // Slide kedua dengan 4 banner lainnya
    {
      items: [
        {
          icon: "🍔",
          title: "Food Delivery",
          description: "Gratis ongkir",
          discount: "FREE SHIPPING",
          bgColor: "bg-orange-50",
        },
        {
          icon: "💄",
          title: "Beauty Sale",
          description: "Kosmetik terlengkap",
          discount: "UP TO 45%",
          bgColor: "bg-pink-50",
        },
        {
          icon: "📚",
          title: "Book Fair",
          description: "Buku terbaru",
          discount: "UP TO 30%",
          bgColor: "bg-yellow-50",
        },
        {
          icon: "🎮",
          title: "Gaming Zone",
          description: "Aksesoris gaming",
          discount: "UP TO 55%",
          bgColor: "bg-indigo-50",
        },
      ],
    },
  ];

  // Auto-slide effect untuk banner promo
  useEffect(() => {
    if (!isBannerHovered) {
      const bannerInterval = setInterval(() => {
        setCurrentBannerSlide((prev) =>
          prev === promoBanners.length - 1 ? 0 : prev + 1
        );
      }, 4000); // Ganti slide setiap 4 detik

      return () => clearInterval(bannerInterval);
    }
  }, [isBannerHovered, promoBanners.length]);

  // Function untuk navigasi banner
  const setBannerSlide = (direction) => {
    if (direction === "next") {
      setCurrentBannerSlide((prev) =>
        prev === promoBanners.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentBannerSlide((prev) =>
        prev === 0 ? promoBanners.length - 1 : prev - 1
      );
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">📱 Download Aplikasi</span>
              <span className="text-gray-600">🚚 Gratis Ongkir</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">🛍️ Jual Produk Anda</span>
              <span className="text-gray-600">📞 Bantuan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-emerald-600">
                AgriMarket
              </Link>
              <div className="hidden lg:flex items-center space-x-6">
                <Link
                  to="/kategori"
                  className="text-gray-700 hover:text-emerald-600"
                >
                  Kategori
                </Link>
                <Link
                  to="/promo"
                  className="text-gray-700 hover:text-emerald-600"
                >
                  Promo
                </Link>
                <Link
                  to="/tentang"
                  className="text-gray-700 hover:text-emerald-600"
                >
                  Tentang
                </Link>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari produk pertanian..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
                <button className="absolute right-2 top-2 p-1 text-gray-400 hover:text-emerald-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-emerald-600 relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M17 13v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Carousel */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Kategori</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/kategori/${category.name.toLowerCase()}`}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-sm text-gray-700">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Carousel */}
            <div className="lg:col-span-3">
              <div className="relative rounded-lg overflow-hidden h-64">
                {promoSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div
                      className={`${slide.color} h-full flex items-center justify-between px-8`}
                    >
                      <div className="text-white">
                        <h2 className="text-3xl font-bold mb-2">
                          {slide.title}
                        </h2>
                        <p className="text-lg opacity-90">{slide.subtitle}</p>
                        <button className="mt-4 px-6 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                          Lihat Promo
                        </button>
                      </div>
                      <div className="hidden md:block">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-48 h-32 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {promoSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide
                          ? "bg-white"
                          : "bg-white bg-opacity-50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Banner Promo Carousel - Right below main carousel */}
              <div className="lg:col-span-3 mt-4">
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Banner Promo
                  </h3>

                  {/* Banner Carousel Container */}
                  <div className="relative overflow-hidden rounded-lg">
                    <div
                      className="flex transition-transform duration-1500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentBannerSlide * 100}%)`,
                      }}
                    >
                      {promoBanners.map((banner, index) => (
                        <div key={index} className="w-full flex-shrink-0">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {banner.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                              >
                                <div
                                  className={`${item.bgColor} p-3 text-center`}
                                >
                                  <div className="text-xl mb-1">
                                    {item.icon}
                                  </div>
                                  <h4 className="font-semibold text-xs text-gray-800 mb-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mb-1">
                                    {item.description}
                                  </p>
                                  <span className="text-xs font-bold text-red-600">
                                    {item.discount}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Banner Navigation Arrows */}
                    <button
                      onClick={() => setBannerSlide("prev")}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-md transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
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
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-md transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
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
                  </div>

                  {/* Banner Indicators */}
                  <div className="flex justify-center mt-3 space-x-2">
                    {promoBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBannerSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentBannerSlide
                            ? "bg-blue-600"
                            : "bg-gray-300"
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

      {/* Flash Sale Section */}
      <div className="bg-white py-8 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-900">⚡ Flash Sale</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Berakhir dalam</span>
                <div className="flex space-x-1">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-mono">
                    12
                  </span>
                  <span className="text-gray-600">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-mono">
                    34
                  </span>
                  <span className="text-gray-600">:</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-mono">
                    56
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/flash-sale"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  {product.foto_url ? (
                    <img
                      src={product.foto_url}
                      alt={product.nama_produk}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                    -{Math.floor(Math.random() * 30 + 20)}%
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {product.nama_produk}
                </h3>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-sm font-bold text-red-500">
                    Rp{" "}
                    {Math.floor(Number(product.harga) * 0.8).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    Rp {Number(product.harga).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Jakarta</span>
                  <span className="mx-1">•</span>
                  <span>⭐ 4.8</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-8 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Produk Unggulan</h2>
            <Link
              to="/produk"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/produk/${product.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow group"
                >
                  <div className="relative">
                    {product.foto_url ? (
                      <img
                        src={product.foto_url}
                        alt={product.nama_produk}
                        className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
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
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {product.nama_produk}
                  </h3>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    Rp {Number(product.harga).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Jakarta</span>
                    <div className="flex items-center">
                      <span>⭐</span>
                      <span className="ml-1">4.8</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
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
              <p className="text-gray-500">
                Tidak ada produk unggulan saat ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AgriMarket</h3>
              <p className="text-gray-300 text-sm">
                Platform marketplace yang menghubungkan petani lokal dengan
                pembeli untuk produk pertanian segar dan berkualitas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kategori</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/kategori/sayuran" className="hover:text-white">
                    Sayuran
                  </Link>
                </li>
                <li>
                  <Link to="/kategori/buah" className="hover:text-white">
                    Buah-buahan
                  </Link>
                </li>
                <li>
                  <Link to="/kategori/bumbu" className="hover:text-white">
                    Bumbu Dapur
                  </Link>
                </li>
                <li>
                  <Link to="/kategori/beras" className="hover:text-white">
                    Beras & Padi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/bantuan" className="hover:text-white">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link to="/cara-belanja" className="hover:text-white">
                    Cara Belanja
                  </Link>
                </li>
                <li>
                  <Link to="/pengiriman" className="hover:text-white">
                    Pengiriman
                  </Link>
                </li>
                <li>
                  <Link to="/pengembalian" className="hover:text-white">
                    Pengembalian
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>📧 info@agrimarket.com</li>
                <li>📞 (021) 1234-5678</li>
                <li>📍 Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AgriMarket. Semua hak dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
