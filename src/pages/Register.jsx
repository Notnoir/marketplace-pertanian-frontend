import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "PEMBELI",
    alamat: "",
    no_hp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", form);
      alert("Registrasi berhasil! Silakan login.");
      // Bisa redirect ke login jika ingin
    } catch (error) {
      alert(
        "Registrasi gagal: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Buat Akun Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="nama"
            placeholder="Nama Lengkap"
            onChange={handleChange}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <select
            name="role"
            onChange={handleChange}
            value={form.role}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="PEMBELI">Pembeli</option>
            <option value="PETANI">Petani</option>
          </select>
          <input
            type="text"
            name="alamat"
            placeholder="Alamat"
            onChange={handleChange}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="no_hp"
            placeholder="Nomor HP"
            onChange={handleChange}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition"
          >
            Daftar
          </button>
        </form>
        <p className="mt-6 text-center text-green-700">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="underline hover:text-green-900 font-semibold"
          >
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}
