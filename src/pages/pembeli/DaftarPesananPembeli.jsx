import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DaftarPesananPembeli() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("SEMUA");
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

    // Ambil data transaksi
    const fetchTransactions = async () => {
      try {
        const response = await API.get(`/transaksi?user_id=${userObj.id}`);
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
          (transaction) => transaction.status?.toUpperCase() === statusFilter
        )
      );
    }
  }, [statusFilter, transactions]);

  const getStatusBadgeClass = (status) => {
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
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Daftar Pesanan Saya
        </h1>
        <Link
          to="/dashboard-pembeli"
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
                <th className="py-3 px-4 border-b">Total</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Alamat</th>
                <th className="py-3 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
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
                      {transaction.id.substring(0, 8)}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {new Date(transaction.tanggal).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b">
                      Rp{" "}
                      {Number(transaction.total_harga).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td
                      className="py-3 px-4 border-b truncate max-w-xs"
                      title={transaction.alamat_pengiriman}
                    >
                      {transaction.alamat_pengiriman}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <Link
                        to={`/detail-pesanan-pembeli/${transaction.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
