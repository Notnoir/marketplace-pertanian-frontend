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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    // Ubah bagian header dan styling pesan
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 flex items-center">
        <button
          onClick={onBack}
          className="mr-3 text-white hover:text-blue-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">{otherUser.nama}</h3>
            <p className="text-xs text-blue-100">{otherUser.role}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            Belum ada pesan. Mulai percakapan sekarang!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                msg.sender_id === currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  msg.sender_id === currentUser.id
                    ? "bg-gradient-to-r from-green-500 to-blue-600 text-white"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <p>{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender_id === currentUser.id
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 border rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-r-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
  );
}
