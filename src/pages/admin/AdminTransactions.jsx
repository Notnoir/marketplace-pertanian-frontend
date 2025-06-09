// AdminTransactions.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return navigate("/login");
    const user = JSON.parse(userData);
    if (user.role !== "ADMIN") return navigate("/");
    fetchTransactions();
  }, [navigate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await API.get("/transaksi");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransactionStatus = async (id, status) => {
    try {
      await API.patch(`/transaksi/${id}/status`, { status });
      fetchTransactions();
      alert("Status transaksi berhasil diperbarui");
    } catch (error) {
      alert("Gagal memperbarui status: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return statusFilter === "all" || transaction.status === statusFilter;
  });

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-green-800">Kelola Transaksi</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/dashboard-admin" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            Dashboard
          </Link>
          <Link to="/admin/users" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            Kelola Pengguna
          </Link>
          <Link to="/admin/products" className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            Kelola Produk
          </Link>
          <Link to="/admin/transactions" className="px-4 py-2 bg-green-700 text-white rounded shadow">
            Kelola Transaksi
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <select className="px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="MENUNGGU">Menunggu</option>
            <option value="DIPROSES">Diproses</option>
            <option value="SELESAI">Selesai</option>
            <option value="DIBATALKAN">Dibatalkan</option>
          </select>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-green-50">
              <tr>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Pembeli</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Tanggal</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Total</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="py-2 px-4 text-left text-green-800 text-xs font-medium uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-green-50">
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">{transaction.id.substring(0, 8)}...</td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">{transaction.user?.nama || "N/A"}</td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">{new Date(transaction.tanggal).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">Rp {transaction.total_harga}</td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        transaction.status === "SELESAI"
                          ? "bg-green-100 text-green-700"
                          : transaction.status === "DIBATALKAN"
                          ? "bg-red-100 text-red-700"
                          : transaction.status === "DIPROSES"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-t whitespace-nowrap text-sm text-gray-700">
                    <button className="text-green-600 hover:underline mr-2" onClick={() => navigate(`/transaksi/${transaction.id}`)}>
                      Detail
                    </button>
                    <select className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-400" value={transaction.status} onChange={(e) => handleUpdateTransactionStatus(transaction.id, e.target.value)}>
                      <option value="MENUNGGU">Menunggu</option>
                      <option value="DIPROSES">Diproses</option>
                      <option value="SELESAI">Selesai</option>
                      <option value="DIBATALKAN">Dibatalkan</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
