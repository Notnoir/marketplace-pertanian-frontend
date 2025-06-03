import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function Keranjang() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek autentikasi dan role
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

    // Ambil data keranjang dari localStorage
    const cartData = localStorage.getItem("cart") || "[]";
    setCart(JSON.parse(cartData));
  }, [navigate]);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (index, newQuantity) => {
    const newCart = [...cart];
    newCart[index].jumlah = Math.max(1, newQuantity);
    updateCart(newCart);
  };

  const handleRemoveItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.harga * item.jumlah, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang belanja kosong");
      return;
    }

    try {
      // Buat transaksi baru
      const transaksiData = {
        user_id: user.id,
        total_harga: calculateTotal(),
        status: "MENUNGGU",
        alamat_pengiriman: user.alamat || "",
      };

      const transaksiRes = await API.post("/transaksi", transaksiData);
      const transaksiId = transaksiRes.data.id;

      // Buat detail transaksi untuk setiap item di keranjang
      for (const item of cart) {
        const detailData = {
          transaksi_id: transaksiId,
          produk_id: item.produk_id,
          jumlah: item.jumlah,
          harga_satuan: item.harga,
          subtotal: item.harga * item.jumlah,
        };

        await API.post("/detail-transaksi", detailData);
      }

      // Kosongkan keranjang
      localStorage.removeItem("cart");
      setCart([]);

      alert("Checkout berhasil! Pesanan Anda sedang diproses.");
      navigate("/dashboard-pembeli");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan saat checkout. Silakan coba lagi.");
    }
  };

  if (!user) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Keranjang Belanja
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600 mb-4">
            Keranjang belanja Anda kosong
          </p>
          <Link
            to="/produk"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Produk</th>
                  <th className="py-2 px-4 border-b">Harga</th>
                  <th className="py-2 px-4 border-b">Jumlah</th>
                  <th className="py-2 px-4 border-b">Subtotal</th>
                  <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center">
                        {item.foto_url ? (
                          <img
                            src={item.foto_url}
                            alt={item.nama_produk}
                            className="h-16 w-16 object-cover mr-4"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-400 mr-4">
                            No Image
                          </div>
                        )}
                        <span>{item.nama_produk}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      Rp {Number(item.harga).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.jumlah - 1)
                          }
                          className="bg-gray-200 px-2 py-1 rounded-l"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.jumlah}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-12 text-center border-t border-b py-1"
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.jumlah + 1)
                          }
                          className="bg-gray-200 px-2 py-1 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      Rp {Number(item.harga * item.jumlah).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link
                to="/produk"
                className="text-green-600 hover:text-green-800"
              >
                ← Lanjutkan Belanja
              </Link>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold mb-4">
                Total: Rp {Number(calculateTotal()).toLocaleString()}
              </p>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
