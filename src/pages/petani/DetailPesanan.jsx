import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DetailPesanan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [user, setUser] = useState(null);
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    // Cek autentikasi dan role
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== "PETANI") {
      navigate("/");
      return;
    }

    setUser(userObj);

    // Ambil detail transaksi
    const fetchTransactionDetail = async () => {
      try {
        const response = await API.get(`/transaksi/${id}`);
        setTransaction(response.data);

        // Ambil data pembeli jika ada user_id
        if (response.data.user_id) {
          try {
            const buyerResponse = await API.get(
              `/users/${response.data.user_id}`
            );
            setBuyer(buyerResponse.data);
          } catch (error) {
            console.error("Error fetching buyer data:", error);
          }
        }

        setLoading(false);
      } catch (error) {
        alert("Gagal mengambil detail pesanan: " + error.message);
        navigate("/dashboard-petani");
      }
    };

    fetchTransactionDetail();
  }, [id, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await API.put(`/transaksi/${id}/status`, { status: newStatus });
      // Refresh data transaksi
      const response = await API.get(`/transaksi/${id}`);
      setTransaction(response.data);
      alert("Status pesanan berhasil diperbarui");
    } catch (error) {
      alert("Gagal memperbarui status: " + error.message);
    }
  };

  // Fungsi untuk mendapatkan warna berdasarkan status
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "MENUNGGU":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "DIPROSES":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "SELESAI":
        return "bg-green-100 text-green-700 border-green-200";
      case "DIBATALKAN":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Fungsi untuk mencetak label pengiriman
  const handlePrintLabel = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Memuat detail pesanan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/daftar-pesanan"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
            {transaction?.status === "DIPROSES" && (
              <button
                onClick={handlePrintLabel}
                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Cetak Label
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status dan Info Pesanan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Pesanan #{transaction.id.substring(0, 8).toUpperCase()}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.tanggal).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  Rp {transaction.total_harga.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Status */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["MENUNGGU", "DIPROSES", "SELESAI"].includes(
                      transaction.status
                    )
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Menunggu Konfirmasi
                  </p>
                  <p className="text-xs text-gray-500">
                    Pesanan menunggu dikonfirmasi
                  </p>
                </div>
              </div>

              <div
                className={`h-px flex-1 mx-4 ${
                  ["DIPROSES", "SELESAI"].includes(transaction.status)
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              ></div>

              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ["DIPROSES", "SELESAI"].includes(transaction.status)
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Sedang Diproses
                  </p>
                  <p className="text-xs text-gray-500">
                    Pesanan sedang disiapkan
                  </p>
                </div>
              </div>

              <div
                className={`h-px flex-1 mx-4 ${
                  transaction.status === "SELESAI"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              ></div>

              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.status === "SELESAI"
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Selesai</p>
                  <p className="text-xs text-gray-500">Pesanan telah selesai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Detail Produk */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detail Produk
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {transaction.detail_transaksis.map((detail) => (
                  <div key={detail.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {detail.produk.foto_url ? (
                          <img
                            src={detail.produk.foto_url}
                            alt={detail.produk.nama_produk}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
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
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {detail.produk.nama_produk}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {detail.produk.kategori}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {detail.jumlah} {detail.produk.satuan}
                            </span>
                            <span>×</span>
                            <span>
                              Rp {detail.harga_satuan.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            Rp {detail.subtotal.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Total Pesanan</span>
                  <span>
                    Rp {transaction.total_harga.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Kelola Pesanan
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleUpdateStatus("DIPROSES")}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    disabled={transaction.status !== "MENUNGGU"}
                  >
                    Proses Pesanan
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("SELESAI")}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    disabled={transaction.status !== "DIPROSES"}
                  >
                    Selesaikan Pesanan
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("DIBATALKAN")}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    disabled={
                      transaction.status === "SELESAI" ||
                      transaction.status === "DIBATALKAN"
                    }
                  >
                    Batalkan Pesanan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Info Pembeli */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Info Pembeli
                </h3>
              </div>
              <div className="p-6">
                {buyer ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {buyer.nama}
                        </p>
                        <p className="text-sm text-gray-500">{buyer.email}</p>
                        <p className="text-sm text-gray-500">
                          {buyer.no_hp || "No telepon tidak tersedia"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Data pembeli tidak tersedia
                  </p>
                )}
              </div>
            </div>

            {/* Alamat Pengiriman */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Alamat Pengiriman
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {transaction.alamat_pengiriman ||
                        "Alamat pengiriman tidak tersedia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Pesanan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Info Pesanan
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ID Pesanan</span>
                  <span className="text-gray-900 font-mono">
                    {transaction.id.substring(0, 16)}...
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal Pesanan</span>
                  <span className="text-gray-900">
                    {new Date(transaction.tanggal).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Label Area */}
      <div className="hidden print:block">
        <div className="max-w-md mx-auto p-8 bg-white">
          <div className="border-2 border-dashed border-gray-400 p-6 text-center">
            <h2 className="text-xl font-bold mb-6">LABEL PENGIRIMAN</h2>

            <div className="text-left mb-6">
              <div className="mb-4">
                <p className="font-bold text-sm text-gray-600">KEPADA:</p>
                <p className="font-bold text-lg">{buyer?.nama || "Pembeli"}</p>
                <p className="text-sm">{buyer?.telepon || "-"}</p>
                <p className="text-sm leading-relaxed mt-2">
                  {transaction.alamat_pengiriman}
                </p>
              </div>

              <div className="mb-4">
                <p className="font-bold text-sm text-gray-600">DARI:</p>
                <p className="font-bold text-lg">{user?.nama || "Petani"}</p>
                <p className="text-sm">{user?.telepon || "-"}</p>
                <p className="text-sm">{user?.alamat || "-"}</p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <p className="font-bold text-sm text-gray-600">ID PESANAN:</p>
              <p className="font-mono text-lg font-bold">
                {transaction.id.substring(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300">
              <div className="font-mono text-2xl tracking-widest mb-2">
                |||| | ||| || | ||||
              </div>
              <p className="text-xs text-gray-500">{transaction.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
