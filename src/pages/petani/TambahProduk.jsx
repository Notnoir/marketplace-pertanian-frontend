import { useState, useEffect } from "react";
import API from "../../services/api";
import { useToast } from "../../components/CustomToast";

export default function TambahProduk() {
  const [form, setForm] = useState({
    nama_produk: "",
    deskripsi: "",
    harga: "",
    stok: "",
    satuan: "",
    foto_url: "",
  });
  const [userId, setUserId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.show({
        message: "Silakan login terlebih dahulu!",
        type: "error",
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    try {
      const payload = {
        ...form,
        harga: parseFloat(form.harga),
        stok: parseInt(form.stok),
        user_id: userId,
      };

      await API.post("/produk", payload);
      toast.show({
        message: "Produk berhasil ditambahkan!",
        type: "success",
        duration: 3000,
        position: "top-center",
      });
      setForm({
        nama_produk: "",
        deskripsi: "",
        harga: "",
        stok: "",
        satuan: "",
        foto_url: "",
      });
    } catch (error) {
      toast.show({
        message:
          "Gagal tambah produk: " +
          (error.response?.data?.message || error.message),
        type: "error",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
          Tambah Produk Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="nama_produk"
            placeholder="Nama Produk"
            value={form.nama_produk}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={4}
            required
          />
          <input
            type="number"
            name="harga"
            placeholder="Harga (Rp)"
            value={form.harga}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="stok"
            placeholder="Stok"
            value={form.stok}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            min="0"
          />
          <input
            type="text"
            name="satuan"
            placeholder="Satuan (contoh: kg, buah)"
            value={form.satuan}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="foto_url"
            placeholder="URL Foto Produk"
            value={form.foto_url}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Tambah Produk
          </button>
        </form>
      </div>
    </div>
  );
}
