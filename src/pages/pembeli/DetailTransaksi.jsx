import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function DetailTransaksi() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [details, setDetails] = useState([]);
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

    // Ambil data transaksi dan detailnya
    const fetchData = async () => {
      try {
        // Ambil data transaksi
        const transactionsRes = await API.get(
          `/transaksi?user_id=${userObj.id}`
        );
        const transaction = transactionsRes.data.find((t) => t.id === id);

        if (!transaction) {
          alert("Transaksi tidak ditemukan");
          navigate("/dashboard-pembeli");
          return;
        }

        setTransaction(transaction);

        // Ambil detail transaksi
        const detailsRes = await API.get(`/detail-transaksi/${id}`);

        // Ambil informasi produk untuk setiap detail
        const detailsWithProduct = await Promise.all(
          detailsRes.data.map(async (detail) => {
            const productRes = await API.get(`/produk/${detail.produk_id}`);
            return {
              ...detail,
              product: productRes.data,
            };
          })
        );

        setDetails(detailsWithProduct);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const getStatusBadgeClass = (status) => {
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
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link
          to="/dashboard-pembeli"
          className="text-green-600 hover:text-green-800"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Detail Transaksi
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Transaksi</h2>
            <p className="mb-2">
              <span className="font-semibold">ID Transaksi:</span>{" "}
              {transaction.id}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Tanggal:</span>{" "}
              {new Date(transaction.tanggal).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Total:</span> Rp{" "}
              {Number(transaction.total_harga).toLocaleString()}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
            <p>{transaction.alamat_pengiriman}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
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
              {details.map((detail) => (
                <tr key={detail.id}>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      {detail.product.foto_url ? (
                        <img
                          src={detail.product.foto_url}
                          alt={detail.product.nama_produk}
                          className="h-16 w-16 object-cover mr-4"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-400 mr-4">
                          No Image
                        </div>
                      )}
                      <span>{detail.product.nama_produk}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    Rp {Number(detail.harga_satuan).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {detail.jumlah} {detail.product.satuan}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    Rp {Number(detail.subtotal).toLocaleString()}
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
