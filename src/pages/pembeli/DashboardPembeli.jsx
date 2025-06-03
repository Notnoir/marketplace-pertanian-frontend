import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DashboardPembeli() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    const fetchData = async () => {
      try {
        const transactionsRes = await API.get(
          `/transaksi?user_id=${userObj.id}`
        );
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="text-center p-10 text-green-700 font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">
        Dashboard Pembeli
      </h1>
      <p className="text-center text-green-700 mb-10 text-lg">
        Selamat datang, <span className="font-semibold">{user?.nama}</span>!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-green-600 text-5xl font-extrabold mb-2">
            {transactions.length}
          </div>
          <div className="text-gray-700 font-medium">Total Pembelian</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="text-green-600 text-5xl font-extrabold mb-2">
            {
              transactions.filter(
                (t) => t.status !== "SELESAI" && t.status !== "DIBATALKAN"
              ).length
            }
          </div>
          <div className="text-gray-700 font-medium">Pesanan Aktif</div>
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <Link
          to="/produk"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition"
        >
          Belanja Lagi
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">
          Riwayat Pembelian
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="py-3 px-5 border-b font-semibold">Tanggal</th>
                <th className="py-3 px-5 border-b font-semibold">Total</th>
                <th className="py-3 px-5 border-b font-semibold">Status</th>
                <th className="py-3 px-5 border-b font-semibold">Alamat</th>
                <th className="py-3 px-5 border-b font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="py-3 px-5 border-b">
                    {new Date(transaction.tanggal).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-5 border-b">Rp {transaction.total_harga.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-5 border-b capitalize">{transaction.status.toLowerCase()}</td>
                  <td className="py-3 px-5 border-b truncate max-w-xs" title={transaction.alamat_pengiriman}>
                    {transaction.alamat_pengiriman}
                  </td>
                  <td className="py-3 px-5 border-b">
                    <Link
                      to={`/detail-transaksi/${transaction.id}`}
                      className="text-green-600 hover:underline font-medium"
                    >
                      Detail
                    </Link>
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
