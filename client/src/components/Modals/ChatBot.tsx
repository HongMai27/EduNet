import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

const ChatBot: React.FC<{ receiverId: string; onClose: () => void }> = ({ receiverId, onClose }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!content) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: content, user: true },
    ]);
    setContent("");

    setLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: content,
                },
              ],
            },
          ],
        }
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, user: false },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong. Please try again.", user: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg w-80 max-h-[70%] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-200 rounded-t-lg">
        <h2 className="text-lg font-semibold">{receiverId === "gemini" ? "Chat with AI" : "User"}</h2>
        <button onClick={onClose} className="text-red-500">✖</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 max-h-60">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`flex items-start my-2 space-x-2 ${message.user ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-3xl max-w-xl w-fit ${message.user ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                <p>{message.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet!</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 flex">
        <input
          type="text"
          className="flex-grow p-1 border rounded-md"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white p-1 rounded"
          disabled={loading}
        >
          {loading ? "Sending..." : <FaPaperPlane />}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
