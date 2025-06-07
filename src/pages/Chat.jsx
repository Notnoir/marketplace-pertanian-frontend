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

  const loadConversations = (userId) => {
    setLoading(true);
    API.get(`/chat/users/${userId}`)
      .then((res) => setConversations(res.data))
      .catch((err) => alert("Error: " + (err.response?.data?.message || err.message)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return navigate("/login");

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const selectedChatUser = localStorage.getItem("selected_chat_user");
    if (selectedChatUser) {
      setSelectedUser(JSON.parse(selectedChatUser));
      localStorage.removeItem("selected_chat_user");
    }

    loadConversations(parsedUser.id);

    API.get("/users")
      .then((res) => {
        const filtered = res.data.filter((u) => u.id !== parsedUser.id);
        setAllUsers(filtered);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [navigate]);

  const filteredConversations = conversations.filter((conv) =>
    conv.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAllUsers = allUsers.filter((u) =>
    u.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowAllUsers(false);
  };

  const handleBack = () => {
    setSelectedUser(null);
    if (user) loadConversations(user.id);
  };

  const toggleShowAllUsers = () => setShowAllUsers(!showAllUsers);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Pesan</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[600px]">
        {selectedUser ? (
          <ChatBox currentUser={user} otherUser={selectedUser} onBack={handleBack} />
        ) : (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <input
                type="text"
                placeholder="Cari pengguna..."
                className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={toggleShowAllUsers}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                {showAllUsers ? "Tampilkan Percakapan" : "Cari Pengguna Baru"}
              </button>
            </div>

            <div className="space-y-3">
              {(showAllUsers ? filteredAllUsers : filteredConversations).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectUser(item)}
                  className="cursor-pointer p-4 bg-gray-50 border rounded-lg hover:bg-green-50 flex items-center justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{item.nama}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">
                    {showAllUsers ? "Mulai Chat" : "Lanjutkan Chat"}
                  </span>
                </div>
              ))}
              {(showAllUsers ? filteredAllUsers : filteredConversations).length === 0 && (
                <p className="text-center text-gray-500 py-6">
                  {showAllUsers
                    ? "Tidak ada pengguna yang ditemukan"
                    : "Belum ada percakapan. Mulai chat dengan pengguna baru!"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
