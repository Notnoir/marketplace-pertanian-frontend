import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EditProduk() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nama_produk: "",
    deskripsi: "",
    harga: "",
    stok: "",
    satuan: "",
    foto_url: "",
  });

  useEffect(() => {
    // Cek autentikasi dan role
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "PETANI") {
      navigate("/");
      return;
    }

    // Ambil data produk yang akan diedit
    const fetchProduk = async () => {
      try {
        const response = await API.get(`/produk/${id}`);
        const produk = response.data;

        // Verifikasi bahwa produk ini milik petani yang sedang login
        if (produk.user_id !== user.id) {
          alert("Anda tidak memiliki akses untuk mengedit produk ini");
          navigate("/dashboard-petani");
          return;
        }

        setForm({
          nama_produk: produk.nama_produk,
          deskripsi: produk.deskripsi,
          harga: produk.harga,
          stok: produk.stok,
          satuan: produk.satuan,
          foto_url: produk.foto_url || "",
        });
        setLoading(false);
      } catch (error) {
        alert("Gagal mengambil data produk: " + error.message);
        navigate("/dashboard-petani");
      }
    };

    fetchProduk();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        harga: parseFloat(form.harga),
        stok: parseInt(form.stok),
      };

      await API.put(`/produk/${id}`, payload);
      alert("Produk berhasil diperbarui!");
      navigate("/dashboard-petani");
    } catch (error) {
      alert(
        "Gagal memperbarui produk: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Produk</h2>
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
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard-petani")}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
