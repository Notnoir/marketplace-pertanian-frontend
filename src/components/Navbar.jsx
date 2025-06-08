import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaBoxOpen,
  FaUserPlus,
  FaSignInAlt,
  FaTachometerAlt,
  FaShoppingCart,
  FaPlusCircle,
  FaListAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaBell,
  FaUser,
  FaSearch,
  FaMobile,
  FaTruck,
  FaStore,
  FaPhone,
} from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Listen for storage events (for when user logs in/out in another tab)
    const handleStorageEvent = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage-event", handleStorageEvent);
    return () => {
      window.removeEventListener("storage-event", handleStorageEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setShowUserDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produk?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const menuClass =
    "inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200";

  const mobileMenuClass =
    "block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 flex items-center space-x-3 transition-all duration-200";

  return (
    <div className="sticky top-0 z-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <FaMobile className="text-blue-500" />
                <span className="hidden sm:inline">Download Aplikasi</span>
                <span className="sm:hidden">App</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
                <FaTruck className="text-green-500" />
                <span className="hidden sm:inline">Gratis Ongkir</span>
                <span className="sm:hidden">Gratis Ongkir</span>
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-200">
                <FaStore className="text-purple-500" />
                <span className="hidden sm:inline">Jual Produk Anda</span>
                <span className="sm:hidden">Jual</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200">
                <FaPhone className="text-orange-500" />
                <span className="hidden sm:inline">Bantuan</span>
                <span className="sm:hidden">Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Brand */}
            <div className="flex-shrink-0 flex items-center cursor-pointer text-xl font-bold space-x-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg shadow-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
              <Link to="/" className="text-green-600">
                AgriConnect
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Search"
                >
                  <span className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Cari
                  </span>
                </button>
              </form>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/produk" className={menuClass}>
                <FaBoxOpen className="text-lg" />
                <span>Produk</span>
              </Link>

              {!user ? (
                <>
                  <Link
                    to="/register"
                    className={`${menuClass} bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200`}
                  >
                    <FaUserPlus className="text-lg" />
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/login"
                    className={`${menuClass} bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 hover:text-white shadow-md hover:shadow-lg`}
                  >
                    <FaSignInAlt className="text-lg" />
                    <span>Login</span>
                  </Link>
                </>
              ) : (
                <>
                  {/* Role-based navigation */}
                  {user.role === "ADMIN" && (
                    <Link to="/dashboard-admin" className={menuClass}>
                      <FaTachometerAlt className="text-lg" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {user.role === "PETANI" && (
                    <>
                      <Link to="/dashboard-petani" className={menuClass}>
                        <FaTachometerAlt className="text-lg" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/tambah-produk" className={menuClass}>
                        <FaPlusCircle className="text-lg" />
                        <span>Tambah Produk</span>
                      </Link>
                    </>
                  )}

                  {user.role === "PEMBELI" && (
                    <>
                      <Link to="/dashboard-pembeli" className={menuClass}>
                        <FaTachometerAlt className="text-lg" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/keranjang" className={`${menuClass} relative`}>
                        <FaShoppingCart className="text-lg" />
                        <span>Keranjang</span>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          3
                        </span>
                      </Link>
                    </>
                  )}

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative"
                    >
                      <FaBell className="text-lg" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                        2
                      </span>
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
                          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                            <FaBell className="mr-2 text-blue-500" />
                            Notifikasi
                          </h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <div className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-l-4 border-transparent hover:border-blue-400 transition-all duration-200">
                            <p className="text-sm text-gray-800 font-medium">
                              Pesanan baru diterima
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              2 menit yang lalu
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-green-50 cursor-pointer border-l-4 border-transparent hover:border-green-400 transition-all duration-200">
                            <p className="text-sm text-gray-800 font-medium">
                              Produk Anda telah disetujui
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              1 jam yang lalu
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                            Lihat semua notifikasi →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <span className="text-sm font-medium">{user.nama}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showUserDropdown ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                          <p className="text-sm font-medium text-gray-900">
                            {user.nama}
                          </p>
                          <p className="text-xs text-gray-500 bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-block mt-1">
                            {user.role}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FaUser className="inline mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <FaSignOutAlt className="inline mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {user && (
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative">
                  <FaBell className="text-lg" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    2
                  </span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            id="mobile-menu"
          >
            <div className="px-4 pt-4 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cari produk..."
                />
              </div>

              <Link
                to="/produk"
                className={mobileMenuClass}
                onClick={() => setIsOpen(false)}
              >
                <FaBoxOpen className="text-lg" />
                <span>Produk</span>
              </Link>

              {!user ? (
                <>
                  <Link
                    to="/register"
                    className={`${mobileMenuClass} bg-blue-50 text-blue-600 border border-blue-200`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserPlus className="text-lg" />
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/login"
                    className={`${mobileMenuClass} bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaSignInAlt className="text-lg" />
                    <span>Login</span>
                  </Link>
                </>
              ) : (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mb-3 border border-blue-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <FaUser className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.nama}
                      </p>
                      <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {user.role === "ADMIN" && (
                    <Link
                      to="/dashboard-admin"
                      className={mobileMenuClass}
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTachometerAlt className="text-lg" />
                      <span>Dashboard Admin</span>
                    </Link>
                  )}

                  {user.role === "PETANI" && (
                    <>
                      <Link
                        to="/dashboard-petani"
                        className={mobileMenuClass}
                        onClick={() => setIsOpen(false)}
                      >
                        <FaTachometerAlt className="text-lg" />
                        <span>Dashboard Petani</span>
                      </Link>
                      <Link
                        to="/tambah-produk"
                        className={mobileMenuClass}
                        onClick={() => setIsOpen(false)}
                      >
                        <FaPlusCircle className="text-lg" />
                        <span>Tambah Produk</span>
                      </Link>
                    </>
                  )}

                  {user.role === "PEMBELI" && (
                    <>
                      <Link
                        to="/dashboard-pembeli"
                        className={mobileMenuClass}
                        onClick={() => setIsOpen(false)}
                      >
                        <FaTachometerAlt className="text-lg" />
                        <span>Dashboard Pembeli</span>
                      </Link>
                      <Link
                        to="/keranjang"
                        className={`${mobileMenuClass} relative`}
                        onClick={() => setIsOpen(false)}
                      >
                        <FaShoppingCart className="text-lg" />
                        <span>Keranjang</span>
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          3
                        </span>
                      </Link>
                    </>
                  )}

                  <Link
                    to="/profile"
                    className={mobileMenuClass}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="text-lg" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`${mobileMenuClass} w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700`}
                    title="Logout"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
