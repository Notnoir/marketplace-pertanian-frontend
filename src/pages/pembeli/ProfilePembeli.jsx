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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Profil Saya</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Profile Picture */}
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              <div className="w-40 h-40 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                <FaUser className="text-white text-6xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.nama}
              </h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full mt-2">
                {user.role}
              </span>
            </div>

            {/* Profile Details */}
            <div className="md:w-2/3">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaUser className="text-green-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nama Lengkap</p>
                      <p className="text-lg font-medium text-gray-800">
                        {user.nama}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaEnvelope className="text-green-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-800">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhone className="text-green-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nomor Telepon</p>
                      <p className="text-lg font-medium text-gray-800">
                        {user.no_hp || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-green-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Alamat</p>
                      <p className="text-lg font-medium text-gray-800">
                        {user.alamat || "-"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profil
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <FaSave className="mr-2" />
                      Simpan
                    </button>
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
                      className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    >
                      <FaTimes className="mr-2" />
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}