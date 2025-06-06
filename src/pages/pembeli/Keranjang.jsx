import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function Keranjang() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    jenisePembayaran: "",
    jenisePengiriman: "",
    nominalPembayaran: "",
    ongkosKirim: 0,
  });
  const [paymentError, setPaymentError] = useState("");
  const navigate = useNavigate();

  // Opsi jenis pembayaran
  const jenisePembayaranOptions = [
    { value: "TRANSFER_BANK", label: "Transfer Bank" },
    { value: "E_WALLET", label: "E-Wallet (GoPay, OVO, DANA)" },
    { value: "COD", label: "Bayar di Tempat (COD)" },
    { value: "KARTU_KREDIT", label: "Kartu Kredit" },
  ];

  // Opsi jenis pengiriman dengan ongkos kirim
  const jenisePengirimanOptions = [
    { value: "REGULER", label: "Reguler (3-5 hari)", ongkos: 15000 },
    { value: "EXPRESS", label: "Express (1-2 hari)", ongkos: 25000 },
    { value: "SAME_DAY", label: "Same Day", ongkos: 35000 },
    { value: "PICKUP", label: "Ambil Sendiri", ongkos: 0 },
  ];

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

  const calculateSubTotal = () => {
    return cart.reduce((total, item) => total + item.harga * item.jumlah, 0);
  };

  const calculateTotal = () => {
    return calculateSubTotal() + paymentData.ongkosKirim;
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang Anda kosong");
      return;
    }

    // Reset payment data dan error
    setPaymentData({
      jenisePembayaran: "",
      jenisePengiriman: "",
      nominalPembayaran: "",
      ongkosKirim: 0,
    });
    setPaymentError("");
    setShowPaymentModal(true);
  };

  const handlePaymentDataChange = (field, value) => {
    setPaymentData((prev) => {
      const newData = { ...prev, [field]: value };

      // Update ongkos kirim jika pengiriman berubah
      if (field === "jenisePengiriman") {
        const selectedPengiriman = jenisePengirimanOptions.find(
          (opt) => opt.value === value
        );
        newData.ongkosKirim = selectedPengiriman
          ? selectedPengiriman.ongkos
          : 0;
      }

      return newData;
    });

    // Clear error saat user mulai mengisi
    if (paymentError) {
      setPaymentError("");
    }
  };

  const validatePayment = () => {
    if (!paymentData.jenisePembayaran) {
      setPaymentError("Silakan pilih jenis pembayaran");
      return false;
    }

    if (!paymentData.jenisePengiriman) {
      setPaymentError("Silakan pilih jenis pengiriman");
      return false;
    }

    const nominalPembayaran = parseFloat(paymentData.nominalPembayaran) || 0;
    const totalPembayaran = calculateTotal();

    if (nominalPembayaran <= 0) {
      setPaymentError("Silakan masukkan nominal pembayaran");
      return false;
    }

    if (nominalPembayaran < totalPembayaran) {
      const kekurangan = totalPembayaran - nominalPembayaran;
      setPaymentError(
        `Nominal pembayaran kurang Rp ${kekurangan.toLocaleString()}. Total yang harus dibayar: Rp ${totalPembayaran.toLocaleString()}`
      );
      return false;
    }

    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validatePayment()) {
      return;
    }

    try {
      // Buat objek transaksi dengan detail items dan pembayaran
      const checkoutData = {
        transaksi: {
          user_id: user.id,
          tanggal: new Date().toISOString(),
          total_harga: calculateTotal(),
          status: "MENUNGGU",
          alamat_pengiriman: user.alamat || "",
          jenis_pembayaran: paymentData.jenisePembayaran,
          jenis_pengiriman: paymentData.jenisePengiriman,
          ongkos_kirim: paymentData.ongkosKirim,
          nominal_pembayaran: parseFloat(paymentData.nominalPembayaran),
          kembalian:
            parseFloat(paymentData.nominalPembayaran) - calculateTotal(),
        },
        detail_items: cart.map((item) => ({
          produk_id: item.produk_id,
          jumlah: item.jumlah,
          harga_satuan: item.harga,
          subtotal: item.harga * item.jumlah,
        })),
      };

      // Kirim semua data dalam satu request
      await API.post("/transaksi/checkout", checkoutData);

      // Kosongkan keranjang
      localStorage.removeItem("cart");
      setCart([]);
      setShowPaymentModal(false);

      const kembalian =
        parseFloat(paymentData.nominalPembayaran) - calculateTotal();
      let message = "Checkout berhasil! Pesanan Anda sedang diproses.";
      if (kembalian > 0) {
        message += ` Kembalian Anda: Rp ${kembalian.toLocaleString()}`;
      }

      alert(message);
      navigate("/dashboard-pembeli");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan saat checkout. Silakan coba lagi.");
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentError("");
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
                Subtotal: Rp {Number(calculateSubTotal()).toLocaleString()}
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

      {/* Modal Pembayaran */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Konfirmasi Pembayaran
            </h2>

            {/* Ringkasan Pesanan */}
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Ringkasan Pesanan:</h3>
              <div className="flex justify-between text-sm">
                <span>Subtotal Produk:</span>
                <span>Rp {calculateSubTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ongkos Kirim:</span>
                <span>Rp {paymentData.ongkosKirim.toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total Pembayaran:</span>
                <span>Rp {calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            {/* Pilihan Jenis Pembayaran */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Pembayaran *
              </label>
              <select
                value={paymentData.jenisePembayaran}
                onChange={(e) =>
                  handlePaymentDataChange("jenisePembayaran", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Pilih Jenis Pembayaran --</option>
                {jenisePembayaranOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pilihan Jenis Pengiriman */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Pengiriman *
              </label>
              <select
                value={paymentData.jenisePengiriman}
                onChange={(e) =>
                  handlePaymentDataChange("jenisePengiriman", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Pilih Jenis Pengiriman --</option>
                {jenisePengirimanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - Rp {option.ongkos.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Nominal Pembayaran */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominal Pembayaran *
              </label>
              <input
                type="number"
                value={paymentData.nominalPembayaran}
                onChange={(e) =>
                  handlePaymentDataChange("nominalPembayaran", e.target.value)
                }
                placeholder="Masukkan nominal pembayaran"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimal: Rp {calculateTotal().toLocaleString()}
              </p>
            </div>

            {/* Error Message */}
            {paymentError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {paymentError}
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
