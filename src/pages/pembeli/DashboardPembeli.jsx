import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DashboardPembeli() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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

    // Ambil data transaksi pembeli
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
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Dashboard Pembeli
      </h1>
      <p className="mb-6">Selamat datang, {user?.nama}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Pembelian</h2>
          <p className="text-3xl font-bold text-green-600">
            {transactions.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Status Pesanan Aktif</h2>
          <p className="text-3xl font-bold text-green-600">
            {
              transactions.filter(
                (t) => t.status !== "SELESAI" && t.status !== "DIBATALKAN"
              ).length
            }
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Link
          to="/produk"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Belanja Lagi
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Riwayat Pembelian</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tanggal</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Alamat</th>
                <th className="py-2 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b">
                    {new Date(transaction.tanggal).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    Rp {transaction.total_harga}
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.status}</td>
                  <td className="py-2 px-4 border-b">
                    {transaction.alamat_pengiriman}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/detail-transaksi/${transaction.id}`}
                      className="text-blue-500 hover:underline"
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
