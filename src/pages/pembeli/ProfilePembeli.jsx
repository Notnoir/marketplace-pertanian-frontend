import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

export default function ProfilePembeli() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== "PEMBELI") {
      navigate("/");
      return;
    }

    setUser(userObj);
    setFormData({
      nama: userObj.nama || "",
      email: userObj.email || "",
      alamat: userObj.alamat || "",
      no_hp: userObj.no_hp || "",
    });
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await API.put(`/users/${user.id}`, formData);

      // Update local storage with new user data
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess("Profil berhasil diperbarui");
      setIsEditing(false);

      // Trigger storage event to update navbar
      window.dispatchEvent(new Event("storage-event"));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Gagal memperbarui profil. Silakan coba lagi."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">Beranda</span>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-700">Pengaturan Akun</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-300">
                <h3 className="font-semibold text-gray-800">Pengaturan Akun</h3>
              </div>
              <div className="p-2">
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  Biodata Diri
                </div>
                <div className="mt-1 space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    Daftar Alamat
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    Keamanan Akun
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    Notifikasi
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    Privasi Akun
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-2xl" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-white border-2 border-gray-200 rounded-full p-1 hover:bg-gray-50">
                      <FaCamera className="text-gray-500 text-xs" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">
                      {user.nama}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        {user.role}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaShieldAlt className="mr-1" />
                        Akun Terverifikasi
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>Member sejak 2024</span>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-white border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <FaEdit className="text-sm" />
                      Ubah
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">!</span>
                </div>
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </div>
                {success}
              </div>
            )}

            {/* Profile Details Card */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-300">
                <h2 className="font-semibold text-gray-900">Biodata Diri</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola informasi profil Anda untuk mengontrol, melindungi dan
                  mengamankan akun
                </p>
              </div>

              <div className="p-6">
                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">
                        Nama
                      </div>
                      <div className="sm:col-span-2 text-sm text-gray-900">
                        {user.nama}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">
                        Email
                      </div>
                      <div className="sm:col-span-2 text-sm text-gray-900 flex items-center gap-2">
                        {user.email}
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          Terverifikasi
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">
                        Nomor HP
                      </div>
                      <div className="sm:col-span-2 text-sm text-gray-900">
                        {user.no_hp || (
                          <span className="text-gray-400 italic">
                            Belum diisi
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">
                        Alamat
                      </div>
                      <div className="sm:col-span-2">
                        {user.alamat ? (
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {user.alamat}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-sm">
                            Belum diisi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                      <label className="text-sm font-medium text-gray-700">
                        Nama <span className="text-red-500">*</span>
                      </label>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                      <label className="text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="sm:col-span-2">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                      <label className="text-sm font-medium text-gray-700">
                        Nomor HP
                      </label>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          name="no_hp"
                          value={formData.no_hp}
                          onChange={handleChange}
                          placeholder="Contoh: 08123456789"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                      <label className="text-sm font-medium text-gray-700">
                        Alamat
                      </label>
                      <div className="sm:col-span-2">
                        <textarea
                          name="alamat"
                          value={formData.alamat}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Masukkan alamat lengkap Anda"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            nama: user.nama || "",
                            email: user.email || "",
                            alamat: user.alamat || "",
                            no_hp: user.no_hp || "",
                          });
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <FaTimes className="text-sm" />
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <FaSave className="text-sm" />
                        Simpan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
