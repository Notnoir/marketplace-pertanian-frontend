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

  // Function untuk membagi produk menjadi slides (4 produk per slide)
  const getProductSlides = () => {
    const slides = [];
    for (let i = 0; i < featuredProducts.length; i += 4) {
      slides.push(featuredProducts.slice(i, i + 4));
    }
    return slides;
  };

  const productSlides = getProductSlides();

  // Auto-slide effect untuk produk unggulan
  useEffect(() => {
    if (!isBannerHovered && productSlides.length > 1) {
      const bannerInterval = setInterval(() => {
        setCurrentBannerSlide((prev) =>
          prev === productSlides.length - 1 ? 0 : prev + 1
        );
      }, 4000); // Ganti slide setiap 4 detik

      return () => clearInterval(bannerInterval);
    }
  }, [isBannerHovered, productSlides.length]);

  // Function untuk navigasi banner
  const setBannerSlide = (direction) => {
    if (direction === "next") {
      setCurrentBannerSlide((prev) =>
        prev === productSlides.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentBannerSlide((prev) =>
        prev === 0 ? productSlides.length - 1 : prev - 1
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

              {/* Produk Unggulan Carousel - Right below main carousel */}
              <div className="lg:col-span-3 mt-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ⭐ Produk Unggulan
                    </h3>
                    <Link
                      to="/produk"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Lihat Semua
                    </Link>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : productSlides.length > 0 ? (
                    <>
                      {/* Featured Products Carousel Container */}
                      <div
                        className="relative overflow-hidden rounded-lg"
                        onMouseEnter={() => setIsBannerHovered(true)}
                        onMouseLeave={() => setIsBannerHovered(false)}
                      >
                        <div
                          className="flex transition-transform duration-1500 ease-in-out"
                          style={{
                            transform: `translateX(-${
                              currentBannerSlide * 100
                            }%)`,
                          }}
                        >
                          {productSlides.map((slide, index) => (
                            <div key={index} className="w-full flex-shrink-0">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {slide.map((product) => (
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
                                          Rp{" "}
                                          {Number(
                                            product.harga
                                          ).toLocaleString()}
                                        </span>
                                        <div className="flex items-center text-xs text-gray-500">
                                          <span>⭐</span>
                                          <span className="ml-1">4.8</span>
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Jakarta
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Navigation Arrows - only show if more than 1 slide */}
                        {productSlides.length > 1 && (
                          <>
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
                          </>
                        )}
                      </div>

                      {/* Indicators - only show if more than 1 slide */}
                      {productSlides.length > 1 && (
                        <div className="flex justify-center mt-3 space-x-2">
                          {productSlides.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentBannerSlide(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentBannerSlide
                                  ? "bg-emerald-600"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
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
      <div className="bg-white py-8">
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
      <div className="bg-white py-8">
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
