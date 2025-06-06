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

  // Fungsi untuk memuat daftar percakapan
  const loadConversations = (userId) => {
    setLoading(true);
    API.get(`/chat/users/${userId}`)
      .then((res) => {
        console.log("Conversations loaded:", res.data);
        setConversations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching conversations:", err);
        // Keep this alert for debugging
        alert(
          "Error fetching conversations: " +
            (err.response?.data?.message || err.message)
        );
      })
      .finally(() => setLoading(false));
  };

  // Cek autentikasi
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Cek apakah ada pengguna yang dipilih dari halaman lain
    const selectedChatUser = localStorage.getItem("selected_chat_user");
    if (selectedChatUser) {
      setSelectedUser(JSON.parse(selectedChatUser));
      // Hapus dari localStorage setelah digunakan
      localStorage.removeItem("selected_chat_user");
    }

    // Ambil daftar percakapan
    loadConversations(parsedUser.id);

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
      loadConversations(user.id);
    }
  };

  // Toggle tampilan semua pengguna
  const toggleShowAllUsers = () => {
    setShowAllUsers(!showAllUsers);
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
          <div className="p-4">
            {/* Search bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Cari pengguna..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Toggle button */}
            <div className="mb-4">
              <button
                onClick={toggleShowAllUsers}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {showAllUsers ? "Tampilkan Percakapan" : "Cari Pengguna Baru"}
              </button>
            </div>

            {/* User list */}
            <div className="space-y-2">
              {showAllUsers ? (
                // Tampilkan semua pengguna yang tersedia untuk chat
                filteredAllUsers.length > 0 ? (
                  filteredAllUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-3 border rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                      onClick={() => handleSelectUser(u)}
                    >
                      <div>
                        <p className="font-medium">{u.nama}</p>
                        <p className="text-xs text-gray-500">{u.role}</p>
                      </div>
                      <span className="text-green-600 text-sm">Mulai Chat</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 my-4">
                    Tidak ada pengguna yang ditemukan
                  </p>
                )
              ) : // Tampilkan daftar percakapan yang sudah ada
              filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 border rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                    onClick={() => handleSelectUser(conv)}
                  >
                    <div>
                      <p className="font-medium">{conv.nama}</p>
                      <p className="text-xs text-gray-500">{conv.role}</p>
                    </div>
                    <span className="text-green-600 text-sm">
                      Lanjutkan Chat
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 my-4">
                  Belum ada percakapan. Mulai chat dengan pengguna baru!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
