import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "PEMBELI",
    alamat: "",
    no_hp: "",
  });

  const [errors, setErrors] = useState({
    nama: "",
    email: "",
    password: "",
    alamat: "",
    no_hp: "",
  });

  // Validasi email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validasi password
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password harus minimal 8 karakter";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password harus memiliki minimal 1 huruf besar";
    }
    if (!/[0-9]/.test(password)) {
      return "Password harus memiliki minimal 1 angka";
    }
    if (!/[.,?\/#!$%^&*()\-_=+{}[\]|:;"'<>]/.test(password)) {
      return "Password harus memiliki minimal 1 simbol (.,?/#)";
    }
    return "";
  };

  // Sanitasi input
  const sanitizeInput = (input) => {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/script/gi, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    let newErrors = { ...errors };

    if (!sanitizedValue) {
      newErrors[name] = `${
        name[0].toUpperCase() + name.slice(1)
      } tidak boleh kosong`;
    } else {
      newErrors[name] = "";
    }

    if (name === "email" && sanitizedValue) {
      if (!validateEmail(sanitizedValue)) {
        newErrors.email = "Format email tidak valid";
      }
    }

    if (name === "password" && sanitizedValue) {
      newErrors.password = validatePassword(sanitizedValue);
    }

    setForm({ ...form, [name]: sanitizedValue });
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(form.password);

    const hasErrors =
      !form.nama ||
      !form.email ||
      !form.password ||
      !form.alamat ||
      !form.no_hp ||
      errors.email ||
      passwordError;

    if (hasErrors) {
      setErrors((prev) => ({
        ...prev,
        password: passwordError,
      }));
      alert("Mohon lengkapi form dengan benar");
      return;
    }

    try {
      const registerRes = await API.post("/users/register", form);
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      alert(
        "Registrasi gagal: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          Buat Akun Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className={`w-full px-4 py-3 border ${
                errors.nama ? "border-red-500" : "border-green-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {errors.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-green-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full px-4 py-3 border ${
                errors.password ? "border-red-500" : "border-green-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Password harus memiliki minimal 8 karakter, 1 huruf besar, 1
              angka, dan 1 simbol (.,?/#)
            </p>
          </div>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="PEMBELI">Pembeli</option>
            <option value="PETANI">Petani</option>
          </select>
          <div>
            <input
              type="text"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Alamat"
              className={`w-full px-4 py-3 border ${
                errors.alamat ? "border-red-500" : "border-green-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {errors.alamat && (
              <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
              placeholder="Nomor HP"
              className={`w-full px-4 py-3 border ${
                errors.no_hp ? "border-red-500" : "border-green-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {errors.no_hp && (
              <p className="text-red-500 text-sm mt-1">{errors.no_hp}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
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
