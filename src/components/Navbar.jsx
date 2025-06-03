import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLeaf, FaBoxOpen, FaUserPlus, FaSignInAlt, FaTachometerAlt, FaShoppingCart, FaPlusCircle, FaListAlt, FaFileAlt, FaSignOutAlt } from "react-icons/fa";

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const menuClass =
    "inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800";

  const mobileMenuClass =
    "block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800 flex items-center space-x-2";

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer text-xl font-bold space-x-2">
            <FaLeaf className="text-green-300 text-2xl" />
            <Link to="/">AgriConnect</Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/produk" className={menuClass}>
              <FaBoxOpen />
              <span>Produk</span>
            </Link>

            {!user ? (
              <>
                <Link to="/register" className={menuClass}>
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
                <Link to="/login" className={menuClass}>
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <>
                {user.role === "ADMIN" && (
                  <Link to="/dashboard-admin" className={menuClass}>
                    <FaTachometerAlt />
                    <span>Dashboard Admin</span>
                  </Link>
                )}

                {user.role === "PETANI" && (
                  <>
                    <Link to="/dashboard-petani" className={menuClass}>
                      <FaTachometerAlt />
                      <span>Dashboard Petani</span>
                    </Link>
                    <Link to="/tambah-produk" className={menuClass}>
                      <FaPlusCircle />
                      <span>Tambah Produk</span>
                    </Link>
                  </>
                )}

                {user.role === "PEMBELI" && (
                  <>
                    <Link to="/dashboard-pembeli" className={menuClass}>
                      <FaTachometerAlt />
                      <span>Dashboard Pembeli</span>
                    </Link>
                    <Link to="/keranjang" className={menuClass}>
                      <FaShoppingCart />
                      <span>Keranjang</span>
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className={`${menuClass} bg-green-800 hover:bg-green-900`}
                  title="Logout"
                >
                  <FaSignOutAlt />
                  <span>Logout ({user.nama})</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white"
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
        <div className="md:hidden bg-green-700" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/produk"
              className={mobileMenuClass}
              onClick={() => setIsOpen(false)}
            >
              <FaBoxOpen />
              <span>Produk</span>
            </Link>

            {!user ? (
              <>
                <Link
                  to="/register"
                  className={mobileMenuClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
                <Link
                  to="/login"
                  className={mobileMenuClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    to="/dashboard-admin"
                    className={mobileMenuClass}
                    onClick={() => setIsOpen(false)}
                  >
                    <FaTachometerAlt />
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
                      <FaTachometerAlt />
                      <span>Dashboard Petani</span>
                    </Link>
                    <Link
                      to="/tambah-produk"
                      className={mobileMenuClass}
                      onClick={() => setIsOpen(false)}
                    >
                      <FaPlusCircle />
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
                      <FaTachometerAlt />
                      <span>Dashboard Pembeli</span>
                    </Link>
                    <Link
                      to="/keranjang"
                      className={mobileMenuClass}
                      onClick={() => setIsOpen(false)}
                    >
                      <FaShoppingCart />
                      <span>Keranjang</span>
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className={`${mobileMenuClass} w-full text-left`}
                  title="Logout"
                >
                  <FaSignOutAlt />
                  <span>Logout ({user.nama})</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
