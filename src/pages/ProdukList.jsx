import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ProdukList() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/produk")
      .then((res) => setProduk(res.data))
      .catch((err) => alert("Gagal load produk: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        Loading produk...
      </p>
    );

  if (produk.length === 0)
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        Tidak ada produk tersedia.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto mt-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {produk.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
        >
          <Link to={`/produk/${p.id}`}>
            {p.foto_url ? (
              <img
                src={p.foto_url}
                alt={p.nama_produk}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-green-800 mb-1">
                {p.nama_produk}
              </h3>
              <p className="text-sm text-gray-600 flex-grow">{p.deskripsi}</p>
              <div className="mt-3 flex justify-between items-center">
                <p className="font-bold text-green-700 text-lg">
                  Rp {Number(p.harga).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Stok: {p.stok} {p.satuan}
                </p>
              </div>
            </div>
          </Link>
          <div className="px-4 pb-4">
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
              onClick={() => navigate(`/produk/${p.id}`)}
            >
              Lihat Detail
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
