// Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaBoxOpen,
  FaUserPlus,
  FaSignInAlt,
  FaSearch,
  FaMobile,
  FaTruck,
  FaStore,
  FaPhone
} from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuClass =
    "inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200";

  return (
    <div className="sticky top-0 z-50">
      {/* Header Banner */}
      <div className="bg-blue-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2 text-gray-600">
                <FaMobile className="text-blue-500" />
                <span>Download Aplikasi</span>
              </span>
              <span className="flex items-center space-x-2 text-gray-600">
                <FaTruck className="text-green-500" />
                <span>Gratis Ongkir</span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2 text-gray-600">
                <FaStore className="text-purple-500" />
                <span>Jual Produk Anda</span>
              </span>
              <span className="flex items-center space-x-2 text-gray-600">
                <FaPhone className="text-orange-500" />
                <span>Bantuan</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer text-xl font-bold space-x-2">
              <div className="bg-green-500 p-2 rounded-lg shadow-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
              <Link to="/" className="text-green-600">
                AgriConnect
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari produk..."
                />
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex items-center space-x-2">
              <Link to="/produk" className={menuClass}>
                <FaBoxOpen className="text-lg" />
                <span>Produk</span>
              </Link>
              <Link to="/register" className={`${menuClass} bg-blue-50 text-blue-600 border border-blue-200`}>
                <FaUserPlus className="text-lg" />
                <span>Register</span>
              </Link>
              <Link to="/login" className={`${menuClass} bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-md`}>
                <FaSignInAlt className="text-lg" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
