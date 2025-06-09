import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  Filter,
  ArrowLeft,
} from "lucide-react";

export default function LaporanPenjualan() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalPenjualan: 0,
    totalProdukTerjual: 0,
    totalPendapatan: 0,
  });
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek autentikasi dan role
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "PETANI") {
      navigate("/");
      return;
    }

    // Set default date range (1 bulan terakhir)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });

    // Ambil data transaksi petani
    const fetchTransactions = async () => {
      try {
        const response = await API.get(`/transaksi/petani/${user.id}`);
        const completedTransactions = response.data.filter(
          (t) => t.transaksi?.status === "SELESAI" || t.status === "SELESAI"
        );
        setTransactions(completedTransactions);
        setFilteredTransactions(completedTransactions);
        calculateSummary(completedTransactions);
        prepareChartData(completedTransactions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const prepareChartData = (data) => {
    // Membuat objek untuk menyimpan total penjualan per hari
    const dailySales = {};

    // Mengelompokkan transaksi berdasarkan tanggal
    data.forEach((transaction) => {
      const date = new Date(
        transaction.tanggal || transaction.transaksi?.tanggal
      );
      const dateStr = date.toISOString().split("T")[0];

      if (!dailySales[dateStr]) {
        dailySales[dateStr] = {
          date: dateStr,
          totalPenjualan: 0,
          totalPendapatan: 0,
        };
      }

      // Menambahkan jumlah penjualan
      dailySales[dateStr].totalPenjualan += 1;

      // Menambahkan pendapatan
      const details = transaction.detail_transaksis || [transaction];
      details.forEach((detail) => {
        dailySales[dateStr].totalPendapatan += parseFloat(detail.subtotal || 0);
      });
    });

    // Mengubah objek menjadi array dan mengurutkan berdasarkan tanggal
    const chartDataArray = Object.values(dailySales).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    setChartData(chartDataArray);
  };

  const applyFilter = () => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59); // Set to end of day

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(
        transaction.tanggal || transaction.transaksi?.tanggal
      );
      return transactionDate >= start && transactionDate <= end;
    });

    setFilteredTransactions(filtered);
    calculateSummary(filtered);
    prepareChartData(filtered);
  };

  const calculateSummary = (data) => {
    const totalPenjualan = data.length;
    let totalProdukTerjual = 0;
    let totalPendapatan = 0;

    data.forEach((transaction) => {
      const details = transaction.detail_transaksis || [transaction];
      details.forEach((detail) => {
        totalProdukTerjual += detail.jumlah || 0;
        totalPendapatan += parseFloat(detail.subtotal || 0);
      });
    });

    setSummary({
      totalPenjualan,
      totalProdukTerjual,
      totalPendapatan,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard-petani"
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali
              </Link>
              <div className="border-l h-6 border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Laporan Penjualan
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                Filter Periode
              </h2>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <button
                onClick={applyFilter}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Penjualan
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalPenjualan}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Transaksi berhasil
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm  p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Produk Terjual
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalProdukTerjual}
                </p>
                <p className="text-xs text-green-600 mt-1">Unit produk</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm  p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Pendapatan
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {summary.totalPendapatan.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">Pendapatan kotor</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm  mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Grafik Penjualan Harian
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Trend penjualan dan pendapatan harian
            </p>
          </div>
          <div className="p-6">
            <div className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#666"
                      fontSize={12}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name) => {
                        if (name === "totalPendapatan") {
                          return [`Rp ${value.toLocaleString()}`, "Pendapatan"];
                        }
                        return [
                          value,
                          name === "totalPenjualan" ? "Penjualan" : name,
                        ];
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("id-ID");
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalPenjualan"
                      name="Jumlah Penjualan"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalPendapatan"
                      name="Total Pendapatan (Rp)"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <TrendingUp className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-500">
                      Tidak ada data untuk ditampilkan
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Coba ubah rentang tanggal filter
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Detail Penjualan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Rincian transaksi penjualan dalam periode yang dipilih
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga Satuan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.flatMap((transaction) => {
                    const details = transaction.detail_transaksis || [
                      transaction,
                    ];
                    return details.map((detail, index) => (
                      <tr
                        key={`${transaction.id}-${detail.id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(
                            transaction.tanggal ||
                              transaction.transaksi?.tanggal
                          ).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            #{transaction.id || transaction.transaksi_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">
                            {detail.produk?.nama_produk || "Produk"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            {detail.jumlah || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          Rp{" "}
                          {parseFloat(
                            detail.harga_satuan || 0
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                          Rp {parseFloat(detail.subtotal || 0).toLocaleString()}
                        </td>
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <Package className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Tidak ada data penjualan
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Tidak ada transaksi dalam periode yang dipilih
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
