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
      .catch((err) =>
        alert("Error: " + (err.response?.data?.message || err.message))
      )
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {selectedUser ? (
        <ChatBox
          currentUser={user}
          otherUser={selectedUser}
          onBack={handleBack}
        />
      ) : (
        <div className="flex flex-col h-full">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
              <button
                onClick={toggleShowAllUsers}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
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
              <input
                type="text"
                placeholder="Cari kontak..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setShowAllUsers(false)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  !showAllUsers
                    ? "text-green-600 border-green-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Percakapan
              </button>
              <button
                onClick={() => setShowAllUsers(true)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  showAllUsers
                    ? "text-green-600 border-green-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Semua Kontak
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {(showAllUsers ? filteredAllUsers : filteredConversations)
              .length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {showAllUsers ? "Tidak ada kontak" : "Belum ada percakapan"}
                </h3>
                <p className="text-xs text-gray-500">
                  {showAllUsers
                    ? "Tidak ditemukan kontak yang sesuai dengan pencarian"
                    : "Mulai percakapan dengan memilih kontak"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {(showAllUsers ? filteredAllUsers : filteredConversations).map(
                  (item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectUser(item)}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {item.nama?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.nama}
                          </h3>
                          {!showAllUsers && (
                            <span className="text-xs text-gray-500 ml-2">
                              12:30
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500 truncate">
                            {showAllUsers ? item.role : "Pesan terakhir..."}
                          </p>
                          {!showAllUsers && (
                            <div className="flex items-center ml-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 ml-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
