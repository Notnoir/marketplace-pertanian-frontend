import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa"; // ikon daun untuk tema pertanian

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage-event"));
      alert("Login berhasil: " + res.data.user.nama);

      const { role } = res.data.user;
      if (role === "ADMIN") {
        navigate("/dashboard-admin");
      } else if (role === "PETANI") {
        navigate("/dashboard-petani");
      } else if (role === "PEMBELI") {
        navigate("/dashboard-pembeli");
      } else {
        navigate("/produk");
      }
    } catch (error) {
      alert("Login gagal: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
        <div className="flex justify-center mb-6">
          <FaLeaf className="text-green-600 text-5xl" />
        </div>
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          Selamat Datang di AgriConnect
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Masuk
          </button>
        </form>
        <p className="mt-6 text-center text-green-700">
          Belum punya akun?{" "}
          <a href="/register" className="underline hover:text-green-900">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
