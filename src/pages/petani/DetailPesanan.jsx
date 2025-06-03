import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DetailPesanan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [user, setUser] = useState(null);

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

    setUser(userObj);

    // Ambil detail transaksi
    const fetchTransactionDetail = async () => {
      try {
        const response = await API.get(`/transaksi/${id}`);
        setTransaction(response.data);
        setLoading(false);
      } catch (error) {
        alert("Gagal mengambil detail pesanan: " + error.message);
        navigate("/dashboard-petani");
      }
    };

    fetchTransactionDetail();
  }, [id, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await API.put(`/transaksi/${id}/status`, { status: newStatus });
      // Refresh data transaksi
      const response = await API.get(`/transaksi/${id}`);
      setTransaction(response.data);
      alert("Status pesanan berhasil diperbarui");
    } catch (error) {
      alert("Gagal memperbarui status: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detail Pesanan #{transaction.id}</h1>
        <Link
          to="/dashboard-petani"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Kembali
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Informasi Pesanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Tanggal Pesanan:</p>
            <p className="font-semibold">
              {new Date(transaction.tanggal).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Status:</p>
            <p className="font-semibold">{transaction.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Harga:</p>
            <p className="font-semibold">Rp {transaction.total_harga}</p>
          </div>
          <div>
            <p className="text-gray-600">Alamat Pengiriman:</p>
            <p className="font-semibold">{transaction.alamat_pengiriman}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Detail Produk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Produk</th>
                <th className="py-2 px-4 border-b">Harga Satuan</th>
                <th className="py-2 px-4 border-b">Jumlah</th>
                <th className="py-2 px-4 border-b">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {transaction.detail_transaksis.map((detail) => (
                <tr key={detail.id}>
                  <td className="py-2 px-4 border-b">
                    {detail.produk.nama_produk}
                  </td>
                  <td className="py-2 px-4 border-b">
                    Rp {detail.harga_satuan}
                  </td>
                  <td className="py-2 px-4 border-b">{detail.jumlah}</td>
                  <td className="py-2 px-4 border-b">Rp {detail.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Update Status Pesanan</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateStatus("DIPROSES")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={transaction.status !== "MENUNGGU"}
          >
            Proses Pesanan
          </button>
          <button
            onClick={() => handleUpdateStatus("SELESAI")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={transaction.status !== "DIPROSES"}
          >
            Selesaikan Pesanan
          </button>
          <button
            onClick={() => handleUpdateStatus("DIBATALKAN")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            disabled={
              transaction.status === "SELESAI" ||
              transaction.status === "DIBATALKAN"
            }
          >
            Batalkan Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}
