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

  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case "MENUNGGU":
        return {
          class: "bg-orange-50 text-orange-700 border-orange-200",
          bgClass: "bg-orange-100",
          text: "Menunggu Konfirmasi",
          icon: "⏰",
        };
      case "DIPROSES":
        return {
          class: "bg-blue-50 text-blue-700 border-blue-200",
          bgClass: "bg-blue-100",
          text: "Sedang Diproses",
          icon: "🚛",
        };
      case "SELESAI":
        return {
          class: "bg-green-50 text-green-700 border-green-200",
          bgClass: "bg-green-100",
          text: "Pesanan Selesai",
          icon: "✅",
        };
      case "DIBATALKAN":
        return {
          class: "bg-red-50 text-red-700 border-red-200",
          bgClass: "bg-red-100",
          text: "Dibatalkan",
          icon: "❌",
        };
      default:
        return {
          class: "bg-gray-50 text-gray-700 border-gray-200",
          bgClass: "bg-gray-100",
          text: status,
          icon: "📦",
        };
    }
  };

  const filterButtons = [
    { key: "SEMUA", label: "Semua", color: "emerald" },
    { key: "MENUNGGU", label: "Menunggu", color: "orange" },
    { key: "DIPROSES", label: "Diproses", color: "blue" },
    { key: "SELESAI", label: "Selesai", color: "green" },
    { key: "DIBATALKAN", label: "Dibatalkan", color: "red" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Filter Status Pesanan
            </h2>
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    statusFilter === filter.key
                      ? `bg-${filter.color}-600 text-white shadow-md transform scale-105`
                      : `bg-${filter.color}-50 text-${filter.color}-700 hover:bg-${filter.color}-100 border border-${filter.color}-200`
                  }`}
                >
                  {filter.label}
                  {statusFilter === filter.key && (
                    <span className="ml-2 bg-white bg-opacity-30 rounded-full px-2 py-0.5 text-xs">
                      {filter.key === "SEMUA"
                        ? transactions.length
                        : filteredTransactions.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <span className="text-6xl block mb-4">📦</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada pesanan ditemukan
              </h3>
              <p className="text-gray-500">
                Pesanan dengan status "{statusFilter.toLowerCase()}" tidak
                tersedia.
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const statusInfo = getStatusInfo(transaction.status);

              return (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-emerald-300"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${statusInfo.bgClass} text-xl`}
                        >
                          {statusInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            #{transaction.id.substring(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-500">ID Transaksi</p>
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.class}`}
                      >
                        <span className="mr-1.5">{statusInfo.icon}</span>
                        {statusInfo.text}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📅</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(transaction.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tanggal Pesanan
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xl">💰</span>
                        <div>
                          <p className="text-sm font-bold text-emerald-600">
                            Rp{" "}
                            {Number(transaction.total_harga).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            Total Pembayaran
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="text-xl mt-0.5">📍</span>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium text-gray-900 truncate"
                            title={transaction.alamat_pengiriman}
                          >
                            {transaction.alamat_pengiriman}
                          </p>
                          <p className="text-xs text-gray-500">
                            Alamat Pengiriman
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <Link
                        to={`/detail-pesanan-pembeli/${transaction.id}`}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        Lihat Detail
                        <svg
                          className="ml-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
