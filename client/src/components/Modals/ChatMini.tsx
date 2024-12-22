// src/components/ChatModal.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../stores/AuthContext";
import { io } from "socket.io-client";
import { IMessage } from "../../types/IMessage";
import { FaPaperPlane } from "react-icons/fa";

const ChatModal: React.FC<{ receiverId: string; onClose: () => void }> = ({ receiverId, onClose }) => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null); 
  const token = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<{ avatar: string; username: string } | null>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    const fetchUserInfo = async (id: string) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceiverInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (receiverId) {
      fetchUserInfo(receiverId);
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/${userId}/messages/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
        if (response.data.length > 0) {
          const id = response.data[0].conversationId;
          setConversationId(id); 
          socket.current.emit('joinConversation', id); 
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const handleNewMessage = (message: IMessage) => {
      if (message.senderId !== userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.current.on("newMessage", handleNewMessage);

    return () => {
      socket.current.off("newMessage", handleNewMessage); 
      socket.current.disconnect(); 
    };
  }, [userId, receiverId, token]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom(); // Cuộn xuống cuối 
  }, [messages]);

  const handleSendMessage = async () => {
    if (!content || !conversationId) return;

    const messageData = {
      conversationId,
      sender: userId,
      receiverId,
      content,
      date: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/${userId}/messages/${receiverId}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket.current.emit("sendMessage", response.data);

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...response.data, _id: Math.random().toString(), sender: userId } 
      ]);
      
      setContent(""); // Clear the input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg w-80 max-h-[70%] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-200 rounded-t-lg">
        <h2 className="text-lg font-semibold">{receiverInfo?.username}</h2>
        <button onClick={onClose} className="text-red-500">✖</button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 max-h-60">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
            key={message._id}
            className={`flex items-start my-2 space-x-2 ${
              message.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            {/* Hiển thị avatar của người gửi bên cạnh tin nhắn */}
            {message.sender !== userId && receiverInfo && (
              <img
                src={receiverInfo.avatar}
                alt="Receiver Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className={`flex flex-col ${message.sender === userId ? "items-end" : "items-start"}`}>
              <div
                className={`p-3 rounded-3xl max-w-xl w-fit ${
                  message.sender === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                <p>{message.content}</p>
              </div>
              {/* Time*/}
              <p className={`text-xs text-gray-600`}>
                {new Date(message.date).toLocaleTimeString()}
              </p>
            </div>
          </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No message!</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-2 flex">
        <input
          type="text"
          className="flex-grow p-1 border rounded-md"
          placeholder="Type..."
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

export default ChatModal;
