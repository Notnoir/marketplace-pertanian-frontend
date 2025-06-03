import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengambil 4 produk terbaru untuk ditampilkan di halaman utama
    API.get("/produk?limit=4")
      .then((res) => setFeaturedProducts(res.data))
      .catch((err) => console.error("Gagal load produk unggulan:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section dengan Design Modern */}
      <div className="relative bg-emerald-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-emerald-700 opacity-20"></div>
          <img
            src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1500&q=80"
            alt="Pertanian"
            className="w-full h-full object-cover opacity-30"
          />
          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-400 rounded-full opacity-20"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 bg-emerald-300 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white rounded-full opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500 bg-opacity-20 backdrop-blur-sm rounded-full border border-emerald-400 border-opacity-30 mb-8">
              <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></span>
              <span className="text-emerald-100 text-sm font-medium">
                Platform Terpercaya #1
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
              Marketplace
              <br />
              <span className="text-emerald-200">Pertanian Lokal</span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-50 mb-12 max-w-4xl mx-auto leading-relaxed">
              Temukan produk segar dan berkualitas langsung dari petani lokal.
              Dukung pertanian berkelanjutan dan nikmati hasil bumi terbaik.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/produk"
                className="group px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-lg border-4 border-transparent hover:border-emerald-200"
              >
                <span className="flex items-center justify-center">
                  Jelajahi Produk
                  <svg
                    className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                to="/register"
                className="group px-10 py-5 bg-transparent border-4 border-white text-white hover:bg-white hover:text-emerald-600 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-2 text-lg"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Daftar Sekarang
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-4xl font-black text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                1000+
              </div>
              <div className="text-gray-600 font-medium">Petani Terdaftar</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                5000+
              </div>
              <div className="text-gray-600 font-medium">Produk Tersedia</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                15K+
              </div>
              <div className="text-gray-600 font-medium">Pelanggan Puas</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="text-gray-600 font-medium">Kota Terjangkau</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section dengan Card Modern */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <span className="text-emerald-600 text-sm font-semibold">
                Keunggulan Kami
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Platform kami menghubungkan petani lokal langsung dengan pembeli,
              menciptakan ekosistem yang menguntungkan semua pihak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-emerald-600 transition-colors">
                Produk Segar & Berkualitas
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Produk langsung dari petani lokal, dipanen saat sudah matang
                untuk menjamin kesegaran dan kualitas terbaik setiap hari.
              </p>
            </div>

            <div className="group bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                Harga Terjangkau
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Tanpa perantara, kami menawarkan harga yang lebih terjangkau
                untuk pembeli dan keuntungan maksimal untuk petani.
              </p>
            </div>

            <div className="group bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-orange-600 transition-colors">
                Dukung Petani Lokal
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Setiap pembelian Anda secara langsung mendukung petani lokal dan
                membantu mengembangkan perekonomian daerah.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products dengan Design Menarik */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <span className="text-emerald-600 text-sm font-semibold">
                Pilihan Terbaik
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Produk Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Temukan produk pertanian segar dan berkualitas dari petani lokal
              terbaik yang telah dipilih khusus untuk Anda.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    {product.foto_url ? (
                      <img
                        src={product.foto_url}
                        alt={product.nama_produk}
                        className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-56 w-full bg-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-gray-300 transition-colors">
                        <svg
                          className="w-16 h-16"
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
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Fresh
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {product.nama_produk}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {product.deskripsi}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-black text-emerald-600">
                        Rp {Number(product.harga).toLocaleString()}
                      </p>
                      <Link
                        to={`/produk/${product.id}`}
                        className="group/link bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105"
                      >
                        <span className="flex items-center">
                          Lihat
                          <svg
                            className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform"
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
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-6"
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
              <p className="text-xl text-gray-500">
                Tidak ada produk unggulan saat ini.
              </p>
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/produk"
              className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Lihat Semua Produk
              <svg
                className="w-6 h-6 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials dengan Design Card Modern */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full mb-6">
              <span className="text-yellow-600 text-sm font-semibold">
                Testimoni
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Apa Kata Mereka
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Pengalaman nyata dari pelanggan dan petani yang telah bergabung
              dengan platform kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Pratama",
                role: "Pembeli",
                avatar: "BP",
                content:
                  "Saya sangat senang berbelanja di sini. Produknya segar, harganya terjangkau, dan yang terpenting saya tahu bahwa saya mendukung petani lokal secara langsung.",
                rating: 5,
              },
              {
                name: "Siti Suryani",
                role: "Petani",
                avatar: "SS",
                content:
                  "Platform ini membantu saya menjangkau lebih banyak pembeli. Saya bisa menjual hasil panen dengan harga yang lebih baik dan mendapatkan pembayaran langsung tanpa menunggu lama.",
                rating: 5,
              },
              {
                name: "Andi Wijaya",
                role: "Pembeli",
                avatar: "AW",
                content:
                  "Kualitas produk di sini jauh lebih baik dibandingkan di supermarket. Saya bisa mendapatkan sayuran dan buah-buahan segar dengan harga yang masuk akal. Sangat direkomendasikan!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-bold text-lg">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-emerald-600 font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action dengan Design Menarik */}
      <div className="py-24 bg-emerald-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full opacity-20 -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-700 rounded-full opacity-20 translate-y-24 -translate-x-24"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500 bg-opacity-30 backdrop-blur-sm rounded-full border border-emerald-400 border-opacity-50 mb-8">
            <span className="text-emerald-100 text-sm font-medium">
              Bergabung Sekarang
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Siap Bergabung dengan Kami?
          </h2>
          <p className="text-xl md:text-2xl text-emerald-50 mb-12 max-w-4xl mx-auto leading-relaxed">
            Daftarkan diri Anda sekarang dan nikmati pengalaman berbelanja
            produk pertanian segar langsung dari petani lokal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="group px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 text-lg"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Daftar Sekarang
              </span>
            </Link>
            <Link
              to="/produk"
              className="group px-10 py-5 bg-transparent border-4 border-white text-white hover:bg-white hover:text-emerald-600 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-2 text-lg"
            >
              <span className="flex items-center justify-center">
                Jelajahi Produk
                <svg
                  className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
