import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login
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

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 text-xl font-bold cursor-pointer">
            <Link to="/">Marketplace Pertanian</Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/produk"
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
            >
              Produk
            </Link>

            {!user ? (
              // Menu untuk user yang belum login
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
                >
                  Login
                </Link>
              </>
            ) : (
              // Menu untuk user yang sudah login
              <>
                {user.role === "ADMIN" && (
                  <Link
                    to="/dashboard-admin"
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
                  >
                    Dashboard Admin
                  </Link>
                )}

                {user.role === "PETANI" && (
                  <>
                    <Link
                      to="/dashboard-petani"
                      className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
                    >
                      Dashboard Petani
                    </Link>
                    <Link
                      to="/tambah-produk"
                      className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
                    >
                      Tambah Produk
                    </Link>
                  </>
                )}

                {user.role === "PEMBELI" && (
                  <Link
                    to="/dashboard-pembeli"
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
                  >
                    Dashboard Pembeli
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-800"
                >
                  Logout ({user.nama})
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
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
              onClick={() => setIsOpen(false)}
            >
              Produk
            </Link>

            {!user ? (
              // Menu untuk user yang belum login (mobile)
              <>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </>
            ) : (
              // Menu untuk user yang sudah login (mobile)
              <>
                {user.role === "ADMIN" && (
                  <Link
                    to="/dashboard-admin"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard Admin
                  </Link>
                )}

                {user.role === "PETANI" && (
                  <>
                    <Link
                      to="/dashboard-petani"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard Petani
                    </Link>
                    <Link
                      to="/tambah-produk"
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
                      onClick={() => setIsOpen(false)}
                    >
                      Tambah Produk
                    </Link>
                  </>
                )}

                {user.role === "PEMBELI" && (
                  <Link
                    to="/dashboard-pembeli"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard Pembeli
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-green-800"
                >
                  Logout ({user.nama})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
