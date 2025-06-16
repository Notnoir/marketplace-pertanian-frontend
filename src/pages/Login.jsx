import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa"; // ikon daun untuk tema pertanian
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

// Custom Alert Component
const CustomAlert = ({ type, message, onClose, isVisible }) => {
  if (!isVisible) return null;

  const alertConfig = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    },
  };

  const config = alertConfig[type] || alertConfig.warning;

  return (
    <div className="fixed inset-0 bg-black/-50 flex items-center justify-center z-50 px-4">
      <div
        className={`${config.bg} ${config.border} border rounded-lg p-4 max-w-sm w-full shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {config.icon}
            <p className={`ml-3 text-sm ${config.text}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 ${config.text} hover:opacity-70`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // State untuk custom alert
  const [customAlert, setCustomAlert] = useState({
    isVisible: false,
    type: "warning",
    message: "",
  });

  // Override alert function
  const alert = (message) => {
    let type = "warning";
    if (message.includes("berhasil")) {
      type = "success";
    } else if (message.includes("gagal") || message.includes("Login gagal")) {
      type = "error";
    }

    setCustomAlert({
      isVisible: true,
      type: type,
      message: message,
    });
  };

  const closeCustomAlert = () => {
    setCustomAlert((prev) => ({ ...prev, isVisible: false }));
  };

  // Fungsi untuk validasi email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Fungsi untuk validasi password
  const validatePassword = (password) => {
    // Minimal 8 karakter
    if (password.length < 8) {
      return "Password harus minimal 8 karakter";
    }

    // Harus memiliki minimal 1 huruf besar
    if (!/[A-Z]/.test(password)) {
      return "Password harus memiliki minimal 1 huruf besar";
    }

    // Harus memiliki minimal 1 angka
    if (!/[0-9]/.test(password)) {
      return "Password harus memiliki minimal 1 angka";
    }

    // Harus memiliki minimal 1 simbol (.,?/#)
    if (!/[.,?\/#!$%^&*()\-_=+{}[\]|:;"'<>]/.test(password)) {
      return "Password harus memiliki minimal 1 simbol (.,?/#)";
    }

    return ""; // Password valid
  };

  // Fungsi untuk sanitasi input
  const sanitizeInput = (input) => {
    // Menghapus karakter berbahaya seperti <, >, ", ', dan script tags
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

    // Validasi input
    let newErrors = { ...errors };

    if (name === "email") {
      if (!sanitizedValue) {
        newErrors.email = "Email tidak boleh kosong";
      } else if (!validateEmail(sanitizedValue)) {
        newErrors.email = "Format email tidak valid";
      } else {
        newErrors.email = "";
      }
    }

    if (name === "password") {
      if (!sanitizedValue) {
        newErrors.password = "Password tidak boleh kosong";
      } else {
        // Gunakan fungsi validatePassword untuk validasi kompleks
        newErrors.password = validatePassword(sanitizedValue);
      }
    }

    setErrors(newErrors);
    setForm({ ...form, [name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form sebelum submit
    const passwordError = validatePassword(form.password);
    if (errors.email || passwordError || !form.email || !form.password) {
      // Update error state untuk password jika ada
      if (passwordError) {
        setErrors((prev) => ({ ...prev, password: passwordError }));
      }
      alert("Mohon perbaiki input yang tidak valid");
      return;
    }

    try {
      const res = await API.post("/users/login", form);

      // Simpan token JWT dan data user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Trigger event untuk update state di komponen lain
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
      // Tangani respons dari rate limiting dan brute force protection
      if (error.response && error.response.status === 429) {
        // Rate limit atau brute force protection
        alert("Peringatan keamanan: " + error.response.data.message);
      } else {
        alert(
          "Login gagal: " + (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Custom Alert */}
      <CustomAlert
        type={customAlert.type}
        message={customAlert.message}
        onClose={closeCustomAlert}
        isVisible={customAlert.isVisible}
      />

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
        <div className="flex justify-center mb-6">
          <FaLeaf className="text-green-600 text-5xl" />
        </div>
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          Selamat Datang di AgriMarket
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
