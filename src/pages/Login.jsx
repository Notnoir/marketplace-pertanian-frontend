import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
      // Simpan data user di localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login berhasil: " + res.data.user.nama);

      // Arahkan ke dashboard sesuai role
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
