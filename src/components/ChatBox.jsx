import { useState, useEffect, useRef } from "react";
import API from "../services/api";

export default function ChatBox({ currentUser, otherUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Ambil pesan antara dua pengguna
  useEffect(() => {
    if (currentUser && otherUser) {
      setLoading(true);
      API.get(`/chat/conversation/${currentUser.id}/${otherUser.id}`)
        .then((res) => {
          setMessages(res.data);
          // Tandai pesan sebagai telah dibaca
          const unreadMessages = res.data
            .filter((msg) => msg.receiver_id === currentUser.id && !msg.is_read)
            .map((msg) => msg.id);

          if (unreadMessages.length > 0) {
            API.put("/chat/read", { message_ids: unreadMessages });
          }
        })
        .catch((err) => console.error("Error fetching messages:", err))
        .finally(() => setLoading(false));
    }
  }, [currentUser, otherUser]);

  // Scroll ke bawah setiap kali pesan berubah
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Kirim pesan baru
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await API.post("/chat", {
        sender_id: currentUser.id,
        receiver_id: otherUser.id,
        message: newMessage,
      });

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Polling untuk pesan baru setiap 5 detik
  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const interval = setInterval(() => {
      API.get(`/chat/conversation/${currentUser.id}/${otherUser.id}`)
        .then((res) => {
          if (res.data.length > messages.length) {
            setMessages(res.data);
            // Tandai pesan baru sebagai telah dibaca
            const unreadMessages = res.data
              .filter(
                (msg) => msg.receiver_id === currentUser.id && !msg.is_read
              )
              .map((msg) => msg.id);

            if (unreadMessages.length > 0) {
              API.put("/chat/read", { message_ids: unreadMessages });
            }
          }
        })
        .catch((err) => console.error("Error polling messages:", err));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser, otherUser, messages]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Memuat pesan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
              <span className="text-white font-semibold text-sm">
                {otherUser.nama?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">
                {otherUser.nama}
              </h3>
              <p className="text-xs text-gray-500">{otherUser.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
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
              Belum ada pesan
            </h3>
            <p className="text-xs text-gray-500">
              Mulai percakapan dengan mengirim pesan pertama
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const isCurrentUser = msg.sender_id === currentUser.id;
              const showTime =
                index === 0 ||
                (index > 0 &&
                  new Date(msg.created_at).getTime() -
                    new Date(messages[index - 1].created_at).getTime() >
                    300000);

              return (
                <div key={msg.id}>
                  {showTime && (
                    <div className="flex justify-center mb-4">
                      <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        isCurrentUser ? "order-2" : "order-1"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          isCurrentUser
                            ? "bg-green-500 text-white rounded-br-md"
                            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {msg.message}
                        </p>
                      </div>

                      <div
                        className={`flex items-center mt-1 space-x-1 ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.created_at)}
                        </span>
                        {isCurrentUser && (
                          <div className="flex items-center">
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {msg.is_read && (
                              <svg
                                className="w-3 h-3 text-green-500 -ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="w-full p-3 pr-12 text-sm border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-gray-50 max-h-20"
              rows="1"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`absolute right-2 bottom-2 p-2 rounded-full transition-all duration-200 ${
                newMessage.trim()
                  ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
