import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useToast } from "../../components/CustomToast";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

// Custom Alert Component
const CustomAlert = ({ type, message, onClose, isVisible }) => {
  if (!isVisible) return null;

  const alertConfig = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    },
  };

  const config = alertConfig[type] || alertConfig.warning;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div
        className={`${config.bg} ${config.border} border rounded-lg p-4 max-w-sm w-full shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {config.icon}
            <p className={`ml-3 text-sm ${config.text}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 ${config.text} hover:opacity-70`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const toast = useToast();

  // Override alert function
  const alert = (message) => {
    let type = "warning";
    if (message.includes("berhasil")) {
      type = "success";
      toast.show({
        message: message,
        type: "success",
        duration: 3000,
        position: "top-center",
      });
    } else if (
      message.includes("gagal") ||
      message.includes("Terjadi kesalahan") ||
      message.includes("kosong")
    ) {
      type = "error";
      toast.show({
        message: message,
        type: "error",
        duration: 3000,
        position: "top-center",
      });
    } else {
      toast.show({
        message: message,
        type: "warning",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const closeCustomAlert = () => {
    setCustomAlert((prev) => ({ ...prev, isVisible: false }));
  };

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Alert */}
      <CustomAlert
        type={customAlert.type}
        message={customAlert.message}
        onClose={closeCustomAlert}
        isVisible={customAlert.isVisible}
      />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-5 h-16">
            <Link
              to="/dashboard-pembeli"
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900 ">Keranjang</h1>
            <div className="text-sm text-gray-500">{cart.length} produk</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a2 2 0 100 4 2 2 0 000-4zm7 0a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Wah, keranjang belanja Anda kosong
            </h3>
            <p className="text-gray-500 mb-6">
              Yuk, isi dengan barang-barang impianmu!
            </p>
            <Link
              to="/produk"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900">
                    Produk Pilihan
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {item.foto_url ? (
                            <img
                              src={item.foto_url}
                              alt={item.nama_produk}
                              className="h-20 w-20 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="h-20 w-20 bg-gray-200 rounded-lg border flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-gray-900 mb-1">
                            {item.nama_produk}
                          </h3>
                          <p className="text-lg font-bold text-gray-900">
                            Rp {Number(item.harga).toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.jumlah - 1)
                              }
                              className="p-2 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                              disabled={item.jumlah <= 1}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
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
                              className="w-12 text-center py-2 border-0 focus:outline-none focus:ring-0"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(index, item.jumlah + 1)
                              }
                              className="p-2 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-150"
                            title="Hapus item"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-4 flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Subtotal untuk produk ini
                        </span>
                        <span className="font-semibold text-gray-900">
                          Rp {Number(item.harga * item.jumlah).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ringkasan belanja
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Total Harga ({cart.length} barang)
                    </span>
                    <span className="font-medium">
                      Rp {Number(calculateSubTotal()).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Ongkos Kirim</span>
                    <span className="font-medium text-green-600">
                      Rp {paymentData.ongkosKirim.toLocaleString()}
                    </span>
                  </div>
                </div>

                <hr className="border-gray-200 mb-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Tagihan
                  </span>
                  <span className="text-xl font-bold text-orange-500">
                    Rp {Number(calculateTotal()).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Beli ({cart.length})
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/produk"
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Lanjutkan Belanja
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Pilih Pembayaran
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Ringkasan Pesanan
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal Produk</span>
                    <span>Rp {calculateSubTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ongkos Kirim</span>
                    <span>Rp {paymentData.ongkosKirim.toLocaleString()}</span>
                  </div>
                  <hr className="border-gray-200 my-2" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total Pembayaran</span>
                    <span className="text-orange-500">
                      Rp {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentData.jenisePembayaran}
                  onChange={(e) =>
                    handlePaymentDataChange("jenisePembayaran", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih metode pembayaran</option>
                  {jenisePembayaranOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipping Method */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Pilihan Pengiriman
                </label>
                <select
                  value={paymentData.jenisePengiriman}
                  onChange={(e) =>
                    handlePaymentDataChange("jenisePengiriman", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih jenis pengiriman</option>
                  {jenisePengirimanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - Rp {option.ongkos.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Amount */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Nominal Pembayaran
                </label>
                <input
                  type="number"
                  value={paymentData.nominalPembayaran}
                  onChange={(e) =>
                    handlePaymentDataChange("nominalPembayaran", e.target.value)
                  }
                  placeholder="Masukkan nominal pembayaran"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Minimal: Rp {calculateTotal().toLocaleString()}
                </p>
              </div>

              {/* Error Message */}
              {paymentError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg
                      className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-red-700">{paymentError}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
