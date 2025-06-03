import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function DaftarPesanan() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
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

    // Ambil data transaksi petani
    const fetchTransactions = async () => {
      try {
        const response = await API.get(`/transaksi/petani/${user.id}`);
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  // Filter transaksi berdasarkan status
  const filteredTransactions = transactions.filter((transaction) => {
    if (statusFilter === "all") return true;
    return transaction.status === statusFilter;
  });

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Pesanan</h1>
        <Link
          to="/dashboard-petani"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Dashboard
        </Link>
      </div>

      <div className="mb-4">
        <label className="mr-2">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Semua Status</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DIPROSES">Diproses</option>
          <option value="SELESAI">Selesai</option>
          <option value="DIBATALKAN">Dibatalkan</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID Pesanan</th>
                <th className="py-2 px-4 border-b">Tanggal</th>
                <th className="py-2 px-4 border-b">Produk</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="py-2 px-4 border-b">#{transaction.id}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(transaction.tanggal).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.produk?.nama_produk || "Multiple"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      Rp {transaction.total_harga}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Link
                        to={`/pesanan/${transaction.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    Tidak ada pesanan ditemukan
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

// Fungsi untuk mendapatkan warna berdasarkan status
function getStatusColor(status) {
  switch (status) {
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
