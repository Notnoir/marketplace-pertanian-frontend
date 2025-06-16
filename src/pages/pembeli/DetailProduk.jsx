import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useToast } from "../../components/CustomToast";

export default function DetailProduk() {
  const { id } = useParams();
  const [produk, setProduk] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [petani, setPetani] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Cek apakah user sudah login
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Ambil data produk berdasarkan ID
    API.get(`/produk/${id}`)
      .then((res) => {
        setProduk(res.data);
        // Ambil data petani
        return API.get(`/users/${res.data.user_id}`);
      })
      .then((res) => {
        setPetani(res.data);
      })
      .catch((err) => alert("Gagal memuat produk: " + err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.show({
        message:
          "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang",
        type: "warning",
        duration: 3000,
        position: "top-center",
      });
      navigate("/login");
      return;
    }

    if (user.role !== "PEMBELI") {
      toast.show({
        message: "Hanya pembeli yang dapat menambahkan produk ke keranjang",
        type: "warning",
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    // Ambil keranjang dari localStorage atau buat baru jika belum ada
    const cartData = localStorage.getItem("cart") || "[]";
    const cart = JSON.parse(cartData);

    // Cek apakah produk sudah ada di keranjang
    const existingProductIndex = cart.findIndex(
      (item) => item.produk_id === id
    );

    if (existingProductIndex >= 0) {
      // Update jumlah jika produk sudah ada
      cart[existingProductIndex].jumlah += jumlah;
    } else {
      // Tambahkan produk baru ke keranjang
      cart.push({
        produk_id: id,
        nama_produk: produk.nama_produk,
        harga: produk.harga,
        jumlah: jumlah,
        foto_url: produk.foto_url,
        satuan: produk.satuan,
        petani_id: produk.user_id,
      });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    toast.show({
      message: `${produk.nama_produk} berhasil ditambahkan ke keranjang`,
      type: "success",
      duration: 3000,
      position: "top-right",
    });
  };

  // Fungsi untuk mengarahkan ke halaman chat dengan petani
  const handleChatPetani = () => {
    if (!user) {
      toast.show({
        message: "Silakan login terlebih dahulu untuk chat dengan petani",
        type: "warning",
        duration: 3000,
        position: "top-center",
      });
      navigate("/login");
      return;
    }

    if (user.role !== "PEMBELI") {
      toast.show({
        message: "Hanya pembeli yang dapat chat dengan petani",
        type: "warning",
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    // Simpan data petani ke localStorage untuk digunakan di halaman chat
    localStorage.setItem("selected_chat_user", JSON.stringify(petani));
    navigate("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Produk tidak ditemukan
          </h2>
          <p className="text-gray-500">Produk yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Product Image */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {produk.foto_url ? (
                <img
                  src={produk.foto_url}
                  alt={produk.nama_produk}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-lg">No Image Available</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {produk.nama_produk}
              </h1>

              {/* Rating placeholder - Tokopedia style */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i} className="text-lg">
                      {star}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  (4.8) • 127 ulasan • 341 terjual
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-orange-500 mb-1">
                  Rp{Number(produk.harga).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">per {produk.satuan}</div>
              </div>

              {/* Stock Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stok tersedia</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {produk.stok} {produk.satuan}
                  </span>
                </div>
                {produk.stok < 10 && (
                  <div className="mt-2 text-xs text-red-600 font-medium">
                    Stok terbatas! Tersisa {produk.stok} {produk.satuan}
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Kuantitas
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    disabled={jumlah <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={produk.stok}
                    value={jumlah}
                    onChange={(e) => setJumlah(parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setJumlah(Math.min(produk.stok, jumlah + 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    disabled={jumlah >= produk.stok}
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">
                    Stok total: {produk.stok}
                  </span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">
                    Rp{(Number(produk.harga) * jumlah).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={produk.stok < 1}
                >
                  {produk.stok < 1 ? (
                    "Stok Habis"
                  ) : (
                    <>
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                        />
                      </svg>
                      + Keranjang
                    </>
                  )}
                </button>

                {petani && (
                  <button
                    onClick={handleChatPetani}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Chat Penjual
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="lg:col-span-3">
            {petani && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm font-medium text-gray-500 mb-4">
                  PENJUAL
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">
                      {petani.nama.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {petani.nama}
                    </div>
                    <div className="text-sm text-gray-500">
                      Online 2 jam lalu
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating & Ulasan</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">4.8 (124)</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Jam Operasional</span>
                    <span className="font-medium text-green-600">Buka</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Bergabung</span>
                    <span className="font-medium">3 tahun lalu</span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Kunjungi Toko
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Deskripsi Produk
            </h2>
            <div className="prose max-w-none text-gray-700">
              {produk.deskripsi || "Tidak ada deskripsi untuk produk ini."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
