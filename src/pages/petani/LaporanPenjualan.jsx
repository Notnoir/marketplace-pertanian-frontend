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
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
        <Link
          to="/dashboard-petani"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Dashboard
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Periode</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={applyFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Terapkan Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Penjualan</h2>
          <p className="text-3xl font-bold text-green-600">
            {summary.totalPenjualan}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Produk Terjual</h2>
          <p className="text-3xl font-bold text-green-600">
            {summary.totalProdukTerjual}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Pendapatan</h2>
          <p className="text-3xl font-bold text-green-600">
            Rp {summary.totalPendapatan.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Penjualan Harian */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Grafik Penjualan Harian</h2>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "totalPendapatan") {
                      return [`Rp ${value.toLocaleString()}`, "Pendapatan"];
                    }
                    return [
                      value,
                      name === "totalPenjualan" ? "Penjualan" : name,
                    ];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalPenjualan"
                  name="Jumlah Penjualan"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalPendapatan"
                  name="Total Pendapatan"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Detail Penjualan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tanggal</th>
                <th className="py-2 px-4 border-b">ID Pesanan</th>
                <th className="py-2 px-4 border-b">Produk</th>
                <th className="py-2 px-4 border-b">Jumlah</th>
                <th className="py-2 px-4 border-b">Harga Satuan</th>
                <th className="py-2 px-4 border-b">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.flatMap((transaction) => {
                  const details = transaction.detail_transaksis || [
                    transaction,
                  ];
                  return details.map((detail) => (
                    <tr key={`${transaction.id}-${detail.id}`}>
                      <td className="py-2 px-4 border-b">
                        {new Date(
                          transaction.tanggal || transaction.transaksi?.tanggal
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        #{transaction.id || transaction.transaksi_id}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {detail.produk?.nama_produk || "Produk"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {detail.jumlah || 0}
                      </td>
                      <td className="py-2 px-4 border-b">
                        Rp{" "}
                        {parseFloat(detail.harga_satuan || 0).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        Rp {parseFloat(detail.subtotal || 0).toLocaleString()}
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    Tidak ada data penjualan dalam periode ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
