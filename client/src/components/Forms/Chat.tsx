import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../stores/AuthContext";
import { io } from "socket.io-client";
import { IMessage } from "../../types/IMessage";

const Chat: React.FC<{ receiverId: string }> = ({ receiverId }) => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const token = localStorage.getItem('accessToken');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Create socket connection outside of useEffect to avoid multiple connections
  const socket = useRef<any>(null); 

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    const conversationId = "some_conversation_id"; // Replace with the actual conversation ID
  
    // Join the conversation
    socket.current.emit('joinConversation', conversationId);
  
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
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for new messages
    const handleNewMessage = (message: IMessage) => { // Specify message type
        setMessages((prevMessages) => [...prevMessages, message]);
      };
    
      socket.current.on("newMessage", handleNewMessage);
    
      // Clean up the socket connection and event listener on unmount
      return () => {
        socket.current.off("newMessage", handleNewMessage); // Clean up event listener
        socket.current.disconnect(); // Disconnect socket
      };
  }, [userId, receiverId, token]); // Exclude socket from dependency array

  const handleSendMessage = async () => {
    if (!content) return;

    const messageData = {
      conversationId: "some_conversation_id", // Replace with the actual conversation ID
      senderId: userId,
      receiverId,
      content,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(
        `http://localhost:5000/api/auth/${userId}/messages/${receiverId}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Emit the message to the server
      socket.current.emit("sendMessage", messageData);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: userId, content, date: messageData.date },
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
    <div className="flex flex-col ">
  {/* Messages Display */}
  <div className="overflow-y-auto  min-h-screen">
    {messages.length > 0 ? (
      messages.map((message) => {
        return (
          <div
            key={message._id}
            className={`p-2 my-2 rounded-xl max-w-xs ${
              message.sender === userId ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-black"
            }`}
          >
            <p>{message.content}</p>
            <p className="text-xs text-right text-gray-600">
              {new Date(message.date).toLocaleTimeString()}
            </p>
          </div>
        );
      })
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Không có tin nhắn nào</p>
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>

  {/* Message Input */}
  <div className="p-4 bg-white border-t border-gray-300 ">
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
