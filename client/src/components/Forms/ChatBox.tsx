import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../stores/AuthContext";
import { io } from "socket.io-client";
import { IMessage } from "../../types/IMessage";
import { FaPhone, FaVideo } from "react-icons/fa";

const Chat: React.FC<{ receiverId: string }> = ({ receiverId }) => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null); 
  const token = localStorage.getItem('accessToken');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<{ avatar: string; username: string } | null>(null);
  const [senderInfo, setSenderInfo] = useState<{ avatar: string; username: string } | null>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    // Fetch thông tin người gửi và người nhận
    const fetchUserInfo = async (id: string, setUserInfo: Function) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (receiverId) {
      fetchUserInfo(receiverId, setReceiverInfo);
    }
  
    if (userId) {
      fetchUserInfo(userId, setSenderInfo);
    }

    // Fetch messages when component mounts
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

    // Listen for new messages
    const handleNewMessage = (message: IMessage) => {
      console.log("Received new message:", message);
      if (message.senderId !== userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.current.on("newMessage", handleNewMessage);

    return () => {
      socket.current.off("newMessage", handleNewMessage); 
      socket.current.disconnect(); 
    };
  }, [userId, receiverId, token]); // Exclude socket from dependency array

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


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom(); // Cuộn xuống cuối khi component lần đầu render hoặc khi có tin nhắn mới
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header với tên và avatar của người nhận */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          {receiverInfo && (
            <>
              <img
                src={receiverInfo.avatar}
                alt="Receiver Avatar"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-lg font-semibold">{receiverInfo.username}</h2>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <FaPhone className="text-xl" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <FaVideo className="text-xl" />
          </button>
        </div>
      </div>
  
      <div className="overflow-y-auto flex-1 p-4">
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
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có tin nhắn nào</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>



      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-300">
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-md"
            placeholder="Nhập tin nhắn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSendMessage}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Chat;
