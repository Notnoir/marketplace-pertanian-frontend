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
      await API.put(`/transaksi/${transaction.transaksi.id}/status`, {
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
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Daftar Pesanan</h1>
        <Link
          to="/dashboard-petani"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Filter Status</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("SEMUA")}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "SEMUA"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter("MENUNGGU")}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "MENUNGGU"
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Menunggu
            </button>
            <button
              onClick={() => setStatusFilter("DIPROSES")}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "DIPROSES"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              Diproses
            </button>
            <button
              onClick={() => setStatusFilter("SELESAI")}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "SELESAI"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800"
              }`}
            >
              Selesai
            </button>
            <button
              onClick={() => setStatusFilter("DIBATALKAN")}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "DIBATALKAN"
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Dibatalkan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="py-3 px-4 border-b">ID Transaksi</th>
                <th className="py-3 px-4 border-b">Tanggal</th>
                <th className="py-3 px-4 border-b">Produk</th>
                <th className="py-3 px-4 border-b">Pembeli</th>
                <th className="py-3 px-4 border-b">Jumlah</th>
                <th className="py-3 px-4 border-b">Total</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-4 text-center">
                    Tidak ada pesanan ditemukan
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="py-3 px-4 border-b">
                      {transaction.transaksi?.id.substring(0, 8) || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {transaction.transaksi?.tanggal
                        ? new Date(
                            transaction.transaksi.tanggal
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {transaction.produk?.nama_produk || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {transaction.transaksi?.user?.nama || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {transaction.jumlah || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      Rp {(transaction.subtotal ?? 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          transaction.transaksi?.status || ""
                        )}`}
                      >
                        {transaction.transaksi?.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <div className="flex gap-2">
                        <Link
                          to={`/pesanan/${transaction.transaksi?.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          Detail
                        </Link>

                        {/* Tombol Proses Pesanan atau Cetak Label */}
                        {transaction.transaksi?.status === "MENUNGGU" && (
                          <button
                            onClick={() => handleProcessOrder(transaction)}
                            disabled={processingId === transaction.transaksi.id}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                          >
                            {processingId === transaction.transaksi.id
                              ? "Processing..."
                              : "Proses Pesanan"}
                          </button>
                        )}

                        {transaction.transaksi?.status === "DIPROSES" && (
                          <button
                            onClick={() => handlePrintLabel(transaction)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Cetak Label
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Label Belanja */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Label Belanja</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div id="printableArea" className="space-y-4">
              {/* Struk Belanja */}
              <div className="border border-gray-300 p-4 rounded">
                <h4 className="font-semibold text-center mb-3 border-b pb-2">
                  STRUK BELANJA
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ID Transaksi:</span>
                    <span>
                      {selectedTransaction.transaksi?.id.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <span>
                      {new Date(
                        selectedTransaction.transaksi?.tanggal
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produk:</span>
                    <span>{selectedTransaction.produk?.nama_produk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah:</span>
                    <span>{selectedTransaction.jumlah}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga Satuan:</span>
                    <span>
                      Rp{" "}
                      {(selectedTransaction.produk?.harga ?? 0).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>
                      Rp{" "}
                      {(selectedTransaction.subtotal ?? 0).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pembeli:</span>
                    <span>{selectedTransaction.transaksi?.user?.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-blue-600 font-medium">
                      {selectedTransaction.transaksi?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barcode Pengiriman */}
              <div className="border border-gray-300 p-4 rounded">
                <h4 className="font-semibold text-center mb-3 border-b pb-2">
                  BARCODE PENGIRIMAN
                </h4>
                <div className="text-center space-y-2">
                  <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                    {generateBarcode(selectedTransaction.transaksi?.id)}
                  </div>
                  <div className="text-sm font-medium">
                    {selectedTransaction.transaksi?.id}
                  </div>
                  <div className="text-xs text-gray-600">
                    Alamat:{" "}
                    {selectedTransaction.transaksi?.alamat_pengiriman ||
                      "Alamat tidak tersedia"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handlePrint}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Cetak Label
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Tutup
              </button>
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
