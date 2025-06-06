import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function DetailProduk() {
  const { id } = useParams();
  const [produk, setProduk] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [petani, setPetani] = useState(null);
  const navigate = useNavigate();

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
      alert(
        "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang"
      );
      navigate("/login");
      return;
    }

    if (user.role !== "PEMBELI") {
      alert("Hanya pembeli yang dapat menambahkan produk ke keranjang");
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
    alert("Produk berhasil ditambahkan ke keranjang");
  };

  // Fungsi untuk mengarahkan ke halaman chat dengan petani
  const handleChatPetani = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk chat dengan petani");
      navigate("/login");
      return;
    }

    if (user.role !== "PEMBELI") {
      alert("Hanya pembeli yang dapat chat dengan petani");
      return;
    }

    // Simpan data petani ke localStorage untuk digunakan di halaman chat
    localStorage.setItem("selected_chat_user", JSON.stringify(petani));
    navigate("/chat");
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!produk) {
    return <div className="text-center p-10">Produk tidak ditemukan</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {produk.foto_url ? (
              <img
                src={produk.foto_url}
                alt={produk.nama_produk}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="p-8 md:w-1/2">
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              {produk.nama_produk}
            </h1>
            <p className="text-2xl font-bold text-green-700 mb-4">
              Rp {Number(produk.harga).toLocaleString()}
            </p>
            <p className="text-gray-600 mb-6">{produk.deskripsi}</p>
            <div className="mb-6">
              <p className="text-gray-700">
                Stok: {produk.stok} {produk.satuan}
              </p>
              {petani && (
                <p className="text-gray-700 mt-2">Penjual: {petani.nama}</p>
              )}
            </div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                className="bg-gray-200 px-3 py-1 rounded-l"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={produk.stok}
                value={jumlah}
                onChange={(e) => setJumlah(parseInt(e.target.value) || 1)}
                className="w-16 text-center border-t border-b py-1"
              />
              <button
                onClick={() => setJumlah(Math.min(produk.stok, jumlah + 1))}
                className="bg-gray-200 px-3 py-1 rounded-r"
              >
                +
              </button>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                disabled={produk.stok < 1}
              >
                {produk.stok < 1 ? "Stok Habis" : "Tambahkan ke Keranjang"}
              </button>
              {petani && (
                <button
                  onClick={handleChatPetani}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Chat dengan Penjual
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
