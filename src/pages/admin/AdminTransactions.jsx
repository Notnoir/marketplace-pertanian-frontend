import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminTransactions() {
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
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }

    // Ambil data transaksi
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
      alert(
        "Gagal memperbarui status: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesStatus;
  });

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-green-800">
            Kelola Transaksi
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Menu Navigasi Admin */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/dashboard-admin"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kelola Pengguna
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kelola Produk
          </Link>
          <Link
            to="/admin/transactions"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Kelola Transaksi
          </Link>
        </div>

        {/* Transactions Management */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <select
              className="px-4 py-2 border rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Pembeli</th>
                    <th className="py-2 px-4 border-b">Tanggal</th>
                    <th className="py-2 px-4 border-b">Total</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="py-2 px-4 border-b">
                        {transaction.id.substring(0, 8)}...
                      </td>
                      <td className="py-2 px-4 border-b">
                        {transaction.user?.nama || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(transaction.tanggal).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        Rp {transaction.total_harga}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.status === "SELESAI"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "DIBATALKAN"
                              ? "bg-red-100 text-red-800"
                              : transaction.status === "DIPROSES"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          onClick={() =>
                            navigate(`/transaksi/${transaction.id}`)
                          }
                        >
                          Detail
                        </button>
                        <div className="relative inline-block text-left">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={transaction.status}
                            onChange={(e) =>
                              handleUpdateTransactionStatus(
                                transaction.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="MENUNGGU">Menunggu</option>
                            <option value="DIPROSES">Diproses</option>
                            <option value="SELESAI">Selesai</option>
                            <option value="DIBATALKAN">Dibatalkan</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
