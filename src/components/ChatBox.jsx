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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center">
        <button
          onClick={onBack}
          className="mr-3 text-white hover:text-green-200"
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
        <div>
          <h3 className="font-bold">{otherUser.nama}</h3>
          <p className="text-xs">{otherUser.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
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
                    ? "bg-green-500 text-white"
                    : "bg-white"
                }`}
              >
                <p>{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
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
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
