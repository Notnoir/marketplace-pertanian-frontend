import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

export default function DetailPesanan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [user, setUser] = useState(null);
  const [buyer, setBuyer] = useState(null);

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

        // Ambil data pembeli jika ada user_id
        if (response.data.user_id) {
          try {
            const buyerResponse = await API.get(
              `/users/${response.data.user_id}`
            );
            setBuyer(buyerResponse.data);
          } catch (error) {
            console.error("Error fetching buyer data:", error);
          }
        }

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

  // Fungsi untuk mendapatkan warna berdasarkan status
  const getStatusColor = (status) => {
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

  // Fungsi untuk mencetak label pengiriman
  const handlePrintLabel = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Detail Pesanan #{transaction.id.substring(0, 8)}
        </h1>
        <div className="flex space-x-2">
          <Link
            to="/daftar-pesanan"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali ke Daftar Pesanan
          </Link>
          {transaction.status === "DIPROSES" && (
            <button
              onClick={handlePrintLabel}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Cetak Label
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Informasi Pesanan */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Informasi Pesanan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">ID Pesanan:</p>
              <p className="font-semibold">{transaction.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Tanggal Pesanan:</p>
              <p className="font-semibold">
                {new Date(transaction.tanggal).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Status:</p>
              <p className="font-semibold">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Harga:</p>
              <p className="font-semibold">
                Rp {transaction.total_harga.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Informasi Pembeli */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Informasi Pembeli
          </h2>
          {buyer ? (
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Nama:</p>
                <p className="font-semibold">{buyer.nama}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-semibold">{buyer.email}</p>
              </div>
              <div>
                <p className="text-gray-600">No. Telepon:</p>
                <p className="font-semibold">{buyer.telepon || "-"}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Data pembeli tidak tersedia</p>
          )}
        </div>
      </div>

      {/* Alamat Pengiriman */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Alamat Pengiriman
        </h2>
        <p className="whitespace-pre-line">
          {transaction.alamat_pengiriman || "Tidak ada alamat pengiriman"}
        </p>
      </div>

      {/* Detail Produk */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Detail Produk
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="py-3 px-4 border-b">Produk</th>
                <th className="py-3 px-4 border-b">Harga Satuan</th>
                <th className="py-3 px-4 border-b">Jumlah</th>
                <th className="py-3 px-4 border-b">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {transaction.detail_transaksis.map((detail) => (
                <tr key={detail.id} className="hover:bg-green-50">
                  <td className="py-3 px-4 border-b">
                    <div className="flex items-center">
                      {detail.produk.gambar && (
                        <img
                          src={detail.produk.gambar}
                          alt={detail.produk.nama_produk}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {detail.produk.nama_produk}
                        </p>
                        <p className="text-sm text-gray-500">
                          {detail.produk.kategori}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    Rp {detail.harga_satuan.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {detail.jumlah} {detail.produk.satuan}
                  </td>
                  <td className="py-3 px-4 border-b">
                    Rp {detail.subtotal.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td
                  colSpan="3"
                  className="py-3 px-4 border-b text-right font-semibold"
                >
                  Total:
                </td>
                <td className="py-3 px-4 border-b font-semibold">
                  Rp {transaction.total_harga.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Pesanan */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Update Status Pesanan
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleUpdateStatus("DIPROSES")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={transaction.status !== "MENUNGGU"}
          >
            Proses Pesanan
          </button>
          <button
            onClick={() => handleUpdateStatus("SELESAI")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={transaction.status !== "DIPROSES"}
          >
            Selesaikan Pesanan
          </button>
          <button
            onClick={() => handleUpdateStatus("DIBATALKAN")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={
              transaction.status === "SELESAI" ||
              transaction.status === "DIBATALKAN"
            }
          >
            Batalkan Pesanan
          </button>
        </div>
      </div>

      {/* Area yang hanya muncul saat print */}
      <div className="hidden print:block p-8">
        <div className="border-2 border-dashed border-gray-400 p-6 mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            Label Pengiriman
          </h2>
          <div className="mb-4">
            <p className="font-bold">Kepada:</p>
            <p className="text-lg">{buyer?.nama || "Pembeli"}</p>
            <p>{transaction.alamat_pengiriman}</p>
            <p>{buyer?.telepon || "-"}</p>
          </div>
          <div className="mb-4">
            <p className="font-bold">Dari:</p>
            <p className="text-lg">{user?.nama || "Petani"}</p>
            <p>{user?.alamat || "-"}</p>
            <p>{user?.telepon || "-"}</p>
          </div>
          <div className="mb-4">
            <p className="font-bold">ID Pesanan:</p>
            <p>{transaction.id}</p>
          </div>
          <div className="text-center mt-6">
            <p className="font-mono text-sm mb-2">
              ||| | || | ||| || | ||| | || | |||
            </p>
            <p className="text-xs">{transaction.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
