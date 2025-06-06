import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const navigate = useNavigate();

  // Cek autentikasi
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Ambil daftar percakapan
    API.get(`/chat/users/${parsedUser.id}`)
      .then((res) => setConversations(res.data))
      .catch((err) => console.error("Error fetching conversations:", err))
      .finally(() => setLoading(false));

    // Ambil semua pengguna untuk pencarian
    API.get("/users")
      .then((res) => {
        // Filter out current user
        const filteredUsers = res.data.filter((u) => u.id !== parsedUser.id);
        setAllUsers(filteredUsers);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [navigate]);

  // Filter percakapan berdasarkan pencarian
  const filteredConversations = conversations.filter((conv) =>
    conv.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter semua pengguna berdasarkan pencarian
  const filteredAllUsers = allUsers.filter((u) =>
    u.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pilih pengguna untuk chat
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowAllUsers(false);
  };

  // Kembali ke daftar percakapan
  const handleBack = () => {
    setSelectedUser(null);
    // Refresh daftar percakapan
    if (user) {
      API.get(`/chat/users/${user.id}`)
        .then((res) => setConversations(res.data))
        .catch((err) => console.error("Error refreshing conversations:", err));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Chat</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[600px]">
        {selectedUser ? (
          <ChatBox
            currentUser={user}
            otherUser={selectedUser}
            onBack={handleBack}
          />
        ) : (
          <div className="h-full">
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onFocus={() => setShowAllUsers(true)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex mt-3">
                <button
                  onClick={() => setShowAllUsers(false)}
                  className={`mr-4 pb-2 ${
                    !showAllUsers
                      ? "border-b-2 border-green-500 font-medium text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  Percakapan Terbaru
                </button>
                <button
                  onClick={() => setShowAllUsers(true)}
                  className={`pb-2 ${
                    showAllUsers
                      ? "border-b-2 border-green-500 font-medium text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  Semua Pengguna
                </button>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
              {showAllUsers ? (
                filteredAllUsers.length > 0 ? (
                  filteredAllUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                          {user.nama.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{user.nama}</h3>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Tidak ada pengguna yang ditemukan
                  </div>
                )
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectUser(conv)}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        {conv.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{conv.nama}</h3>
                        <p className="text-sm text-gray-500">{conv.role}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Belum ada percakapan. Cari pengguna untuk memulai chat!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
