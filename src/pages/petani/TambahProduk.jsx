import { useState, useEffect } from "react";
import API from "../../services/api";

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

  useEffect(() => {
    // Ambil data user dari localStorage
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
      alert("Silakan login terlebih dahulu!");
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
      alert("Produk berhasil ditambahkan!");
      setForm({
        nama_produk: "",
        deskripsi: "",
        harga: "",
        stok: "",
        satuan: "",
        foto_url: "",
      });
    } catch (error) {
      alert(
        "Gagal tambah produk: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Tambah Produk Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="nama_produk"
          placeholder="Nama Produk"
          value={form.nama_produk}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="harga"
          placeholder="Harga (Rp)"
          value={form.harga}
          onChange={handleChange}
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
          required
          min="0"
        />
        <input
          type="text"
          name="satuan"
          placeholder="Satuan (contoh: kg, buah)"
          value={form.satuan}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="foto_url"
          placeholder="URL Foto Produk"
          value={form.foto_url}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Tambah Produk
        </button>
      </form>
    </div>
  );
}
