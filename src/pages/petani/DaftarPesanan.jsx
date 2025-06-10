import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DaftarPesanan() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

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

    // Ambil data transaksi
    const fetchTransactions = async () => {
      try {
        const response = await API.get(`/transaksi/petani/${userObj.id}`);
        setTransactions(response.data);
        setFilteredTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Gagal mengambil data transaksi: " + error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  // Filter transaksi berdasarkan status
  useEffect(() => {
    if (statusFilter === "SEMUA") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(
          (transaction) =>
            transaction.transaksi?.status?.toUpperCase() === statusFilter
        )
      );
    }
  }, [statusFilter, transactions]);

  // Fungsi untuk memproses pesanan
  const handleProcessOrder = async (transaction) => {
    setProcessingId(transaction.transaksi.id);
    try {
      // Update status transaksi menjadi DIPROSES
      await API.put(`/transaksi/update-status/${transaction.transaksi.id}`, {
        status: "DIPROSES",
      });

      // Update state lokal
      const updatedTransactions = transactions.map((t) =>
        t.transaksi.id === transaction.transaksi.id
          ? { ...t, transaksi: { ...t.transaksi, status: "DIPROSES" } }
          : t
      );
      setTransactions(updatedTransactions);

      // Tampilkan modal label belanja
      setSelectedTransaction({
        ...transaction,
        transaksi: { ...transaction.transaksi, status: "DIPROSES" },
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Gagal memproses pesanan: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Fungsi untuk menampilkan modal cetak label
  const handlePrintLabel = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  // Fungsi untuk mencetak label
  const handlePrint = () => {
    window.print();
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  // Generate barcode sederhana (untuk demo)
  const generateBarcode = (id) => {
    return `|||  |  ||  |  |||  ||  |  |||  |  ||  |  |||`; // Simplified barcode representation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar Pesanan
              </h1>
              <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {filteredTransactions.length} Pesanan
              </span>
            </div>
            <Link
              to="/dashboard-petani"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Filter Status Pesanan
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "SEMUA", label: "Semua", count: transactions.length },
                {
                  key: "MENUNGGU",
                  label: "Menunggu Konfirmasi",
                  count: transactions.filter(
                    (t) => t.transaksi?.status === "MENUNGGU"
                  ).length,
                },
                {
                  key: "DIPROSES",
                  label: "Sedang Diproses",
                  count: transactions.filter(
                    (t) => t.transaksi?.status === "DIPROSES"
                  ).length,
                },
                {
                  key: "SELESAI",
                  label: "Selesai",
                  count: transactions.filter(
                    (t) => t.transaksi?.status === "SELESAI"
                  ).length,
                },
                {
                  key: "DIBATALKAN",
                  label: "Dibatalkan",
                  count: transactions.filter(
                    (t) => t.transaksi?.status === "DIBATALKAN"
                  ).length,
                },
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setStatusFilter(status.key)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status.key
                      ? getActiveFilterColor(status.key)
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.label}
                  <span className="ml-2 bg-white text-gray-700 bg-opacity-30 text-xs px-2 py-1 rounded-full">
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada pesanan
              </h3>
              <p className="text-gray-500">
                Pesanan dengan status "
                {statusFilter === "SEMUA"
                  ? "semua"
                  : statusFilter.toLowerCase()}
                " belum tersedia
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header Card */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ID Transaksi</p>
                        <p className="font-medium text-gray-900">
                          #{transaction.transaksi?.id.substring(0, 8) || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                      <p className="font-medium text-gray-900">
                        {transaction.transaksi?.tanggal
                          ? new Date(
                              transaction.transaksi.tanggal
                            ).toLocaleDateString("id-ID", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {transaction.foto_url ? (
                        <img
                          src={product.foto_url}
                          alt={product.nama_produk}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                          loading="lazy"
                        />
                      ) : (
                        <svg
                          className="w-16 h-16 text-gray-400"
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
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {transaction.produk?.nama_produk || "N/A"}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Jumlah: {transaction.jumlah || "N/A"} × Rp{" "}
                        {(transaction.produk?.harga ?? 0).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {transaction.transaksi?.user?.nama || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          transaction.transaksi?.status || ""
                        )}`}
                      >
                        {getStatusIcon(transaction.transaksi?.status)}
                        {transaction.transaksi?.status || "N/A"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Pembayaran</p>
                      <p className="text-lg font-bold text-gray-900">
                        Rp {(transaction.subtotal ?? 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/pesanan/${transaction.transaksi?.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Lihat Detail
                    </Link>

                    <div className="flex space-x-2">
                      {transaction.transaksi?.status === "MENUNGGU" && (
                        <button
                          onClick={() => handleProcessOrder(transaction)}
                          disabled={processingId === transaction.transaksi.id}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === transaction.transaksi.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                              Memproses...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Proses Pesanan
                            </>
                          )}
                        </button>
                      )}

                      {transaction.transaksi?.status === "DIPROSES" && (
                        <button
                          onClick={() => handlePrintLabel(transaction)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <svg
                            className="w-4 h-4 mr-1.5"
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Label Belanja */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Label Pengiriman
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg
                    className="w-6 h-6"
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

            <div id="printableArea" className="p-6 space-y-6">
              {/* Struk Belanja */}
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    STRUK BELANJA
                  </h4>
                  <div className="w-16 h-1 bg-green-500 mx-auto mt-2"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">ID Transaksi</span>
                    <span className="font-mono text-sm font-semibold">
                      #{selectedTransaction.transaksi?.id.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Tanggal</span>
                    <span className="text-sm font-medium">
                      {new Date(
                        selectedTransaction.transaksi?.tanggal
                      ).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Produk</span>
                    <span className="text-sm font-medium text-right max-w-48">
                      {selectedTransaction.produk?.nama_produk}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Jumlah</span>
                    <span className="text-sm font-medium">
                      {selectedTransaction.jumlah}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Harga Satuan</span>
                    <span className="text-sm font-medium">
                      Rp{" "}
                      {(selectedTransaction.produk?.harga ?? 0).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-900">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      Rp{" "}
                      {(selectedTransaction.subtotal ?? 0).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Pembeli</span>
                    <span className="text-sm font-medium">
                      {selectedTransaction.transaksi?.user?.nama}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-medium text-blue-600">
                      {selectedTransaction.transaksi?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barcode Pengiriman */}
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    BARCODE PENGIRIMAN
                  </h4>
                  <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
                </div>

                <div className="text-center space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-mono text-sm bg-white p-3 rounded border-2 border-gray-200">
                      {generateBarcode(selectedTransaction.transaksi?.id)}
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold text-gray-900">
                    {selectedTransaction.transaksi?.id}
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-900 mb-1">
                      Alamat Pengiriman:
                    </div>
                    {selectedTransaction.transaksi?.alamat_pengiriman ||
                      "Alamat tidak tersedia"}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Cetak Label
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS untuk print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printableArea, #printableArea * {
            visibility: visible;
          }
          #printableArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// Fungsi untuk mendapatkan warna berdasarkan status
function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case "MENUNGGU":
      return "bg-yellow-100 text-yellow-800";
    case "DIPROSES":
      return "bg-blue-100 text-blue-800";
    case "SELESAI":
      return "bg-green-100 text-green-800";
    case "DIBATALKAN":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Fungsi untuk mendapatkan warna filter aktif
function getActiveFilterColor(status) {
  switch (status) {
    case "SEMUA":
      return "bg-gray-700 text-white";
    case "MENUNGGU":
      return "bg-yellow-600 text-white";
    case "DIPROSES":
      return "bg-blue-600 text-white";
    case "SELESAI":
      return "bg-green-600 text-white";
    case "DIBATALKAN":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
}

// Fungsi untuk mendapatkan icon status
function getStatusIcon(status) {
  switch (status?.toUpperCase()) {
    case "MENUNGGU":
      return "⏳ ";
    case "DIPROSES":
      return "🔄 ";
    case "SELESAI":
      return "✅ ";
    case "DIBATALKAN":
      return "❌ ";
    default:
      return "📦 ";
  }
}
