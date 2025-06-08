import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DetailPesananPembeli() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [details, setDetails] = useState([]);
  const [user, setUser] = useState(null);

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

    // Ambil data transaksi dan detailnya
    const fetchData = async () => {
      try {
        // Ambil data transaksi
        const transactionsRes = await API.get(
          `/transaksi?user_id=${userObj.id}`
        );
        const transaction = transactionsRes.data.find((t) => t.id === id);

        if (!transaction) {
          alert("Transaksi tidak ditemukan");
          navigate("/daftar-pesanan-pembeli");
          return;
        }

        setTransaction(transaction);

        // Ambil detail transaksi
        const detailsRes = await API.get(`/detail-transaksi/${id}`);

        // Ambil informasi produk untuk setiap detail
        const detailsWithProduct = await Promise.all(
          detailsRes.data.map(async (detail) => {
            const productRes = await API.get(`/produk/${detail.produk_id}`);
            return {
              ...detail,
              product: productRes.data,
            };
          })
        );

        setDetails(detailsWithProduct);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "MENUNGGU":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "DIPROSES":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "SELESAI":
        return "bg-green-100 text-green-700 border border-green-200";
      case "DIBATALKAN":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "MENUNGGU":
        return "⏳";
      case "DIPROSES":
        return "📦";
      case "SELESAI":
        return "✅";
      case "DIBATALKAN":
        return "❌";
      default:
        return "📋";
    }
  };

  // Tambahkan fungsi untuk membatalkan pesanan
  const cancelOrder = () => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      setLoading(true);
      API.put(`/transaksi/${id}/status`, { status: "DIBATALKAN" })
        .then(() => {
          alert("Pesanan berhasil dibatalkan");
          // Refresh data
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error cancelling order:", error);
          alert("Gagal membatalkan pesanan: " + error.message);
        })
        .finally(() => setLoading(false));
    }
  };

  // Tambahkan fungsi untuk menghubungi penjual
  const contactSeller = (sellerId, sellerName) => {
    // Simpan informasi penjual untuk halaman chat
    localStorage.setItem(
      "selected_chat_user",
      JSON.stringify({
        id: sellerId,
        nama: sellerName,
        role: "PETANI",
      })
    );
    navigate("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/daftar-pesanan-pembeli"
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
              <h1 className="text-lg font-semibold text-gray-900">
                Detail Pesanan
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">
                    {getStatusIcon(transaction.status)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Pesanan #{transaction.id.substring(0, 8)}
                </h2>
                <p className="text-gray-600">
                  Dipesan pada{" "}
                  {new Date(transaction.tanggal).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {Number(transaction.total_harga).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {transaction.status === "MENUNGGU" && (
                <button
                  onClick={cancelOrder}
                  className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Batalkan Pesanan
                </button>
              )}
              {details.length > 0 &&
                details[0].product &&
                details[0].product.user_id && (
                  <button
                    onClick={() =>
                      contactSeller(
                        details[0].product.user_id,
                        details[0].product.user_nama || "Penjual"
                      )
                    }
                    className="flex items-center px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Hubungi Penjual
                  </button>
                )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Produk yang Dipesan
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {details.map((detail, index) => (
                  <div key={detail.id} className="p-6">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        {detail.product.foto_url ? (
                          <img
                            src={detail.product.foto_url}
                            alt={detail.product.nama_produk}
                            className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="h-20 w-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <svg
                              className="h-8 w-8 text-gray-400"
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

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-1">
                              {detail.product.nama_produk}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Dijual oleh:{" "}
                              <span className="font-medium">
                                {detail.product.user_nama || "Penjual"}
                              </span>
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                Rp{" "}
                                {Number(detail.harga_satuan).toLocaleString(
                                  "id-ID"
                                )}{" "}
                                per {detail.product.satuan}
                              </span>
                              <span>×</span>
                              <span>
                                {detail.jumlah} {detail.product.satuan}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              Rp{" "}
                              {Number(detail.subtotal).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Section */}
              <div className="bg-gray-50 p-6 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    Total Pesanan
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    Rp {Number(transaction.total_harga).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Info Pengiriman
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Alamat Tujuan
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {transaction.alamat_pengiriman}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      ID Transaksi
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-mono text-gray-900">
                        {transaction.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Status Pesanan
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        transaction.status === "SELESAI" ||
                        transaction.status === "DIPROSES" ||
                        transaction.status === "MENUNGGU" ||
                        transaction.status === "DIBATALKAN"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Pesanan Dibuat
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.tanggal).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        transaction.status === "DIPROSES" ||
                        transaction.status === "SELESAI"
                          ? "bg-green-500"
                          : transaction.status === "DIBATALKAN"
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.status === "DIBATALKAN"
                          ? "Pesanan Dibatalkan"
                          : "Pesanan Diproses"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.status === "MENUNGGU"
                          ? "Menunggu konfirmasi"
                          : ""}
                      </p>
                    </div>
                  </div>

                  {transaction.status !== "DIBATALKAN" && (
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          transaction.status === "SELESAI"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Pesanan Selesai
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.status === "SELESAI"
                            ? "Pesanan telah selesai"
                            : "Menunggu penyelesaian"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
