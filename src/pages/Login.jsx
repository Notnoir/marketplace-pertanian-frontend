import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa"; // ikon daun untuk tema pertanian
import { useToast } from "../components/CustomToast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const toast = useToast();

  // Override alert function
  const alert = (message) => {
    let type = "warning";
    if (message.includes("berhasil")) {
      type = "success";
      toast.show({
        message: message,
        type: "success",
        duration: 3000,
        position: "top-center",
      });
    } else if (message.includes("gagal") || message.includes("Login gagal")) {
      type = "error";
      toast.show({
        message: message,
        type: "error",
        duration: 3000,
        position: "top-center",
      });
    } else {
      toast.show({
        message: message,
        type: "warning",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  // const closeCustomAlert = () => {
  //   setCustomAlert((prev) => ({ ...prev, isVisible: false }));
  // };

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
      {/* <CustomAlert
        type={customAlert.type}
        message={customAlert.message}
        onClose={closeCustomAlert}
        isVisible={customAlert.isVisible}
      /> */}

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
