import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function DetailProduk() {
  const { id } = useParams();
  const [produk, setProduk] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Ambil data produk berdasarkan ID
    API.get(`/produk/${id}`)
      .then((res) => setProduk(res.data))
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
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
              disabled={produk.stok < 1}
            >
              {produk.stok < 1 ? "Stok Habis" : "Tambahkan ke Keranjang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
