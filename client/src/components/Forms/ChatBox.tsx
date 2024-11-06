import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../stores/AuthContext";
import { io } from "socket.io-client";
import { IMessage } from "../../types/IMessage";
import { FaPhone, FaRegWindowMaximize, FaVideo } from "react-icons/fa";
import ChatModal from "../Modals/ChatMini";
import { useChat } from "../../stores/ChatMiniContext";

const Chat: React.FC<{ receiverId: string }> = ({ receiverId }) => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  // const [isChatOpen, setChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null); 
  const token = localStorage.getItem('accessToken');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<{ avatar: string; username: string } | null>(null);
  const [senderInfo, setSenderInfo] = useState<{ avatar: string; username: string } | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const socket = useRef<any>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ callerId: string; callerName: string; offer: RTCSessionDescriptionInit } | null>(null);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const { isOpen, openChat, closeChat } = useChat();

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

  const handleToggleChat = () => {
    if (!isOpen) {
      openChat(receiverId);
    } else {
      closeChat();
    }
  };
  useEffect(() => {
    socket.current.on("callRejected", () => {
      alert("Cuộc gọi đã bị từ chối");
      setIsCalling(false);
    });
  
    return () => {
      socket.current.off("callRejected");
    };
  }, []);
  
  // Listen for call events
useEffect(() => {
  socket.current.on("videoCall", ({ offer, senderId, callerName }: { offer: RTCSessionDescriptionInit; senderId: string; callerName: string }) => {
    setIncomingCall({ callerId: senderId, callerName, offer });
    setIsReceivingCall(true);
    handleAnswerCall(offer);
  });

  socket.current.on("videoCallAnswer", async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
    await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
  });

  return () => {
    socket.current.off("videoCall");
    socket.current.off("videoCallAnswer");
  };
}, []);
  

// Start Call
const startCall = async (isVideoCall: boolean) => {
  setIsCalling(true);
  peerConnection.current = new RTCPeerConnection();

  if (isVideoCall) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => peerConnection.current!.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices.", error);
      return;
    } 
  }

  const offer = await peerConnection.current.createOffer();
  await peerConnection.current.setLocalDescription(offer);
  socket.current.emit("videoCall", { offer, receiverId, callerName: senderInfo?.username });
};


// Answer Call
const handleAnswerCall = async (offer: RTCSessionDescriptionInit) => {
  if (peerConnection.current) return;
  peerConnection.current = new RTCPeerConnection();

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setLocalStream(stream);
  stream.getTracks().forEach((track) => peerConnection.current!.addTrack(track, stream));

  await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.current.createAnswer();
  await peerConnection.current.setLocalDescription(answer);
  socket.current.emit("videoCallAnswer", { answer, senderId: receiverId });
};



const acceptCall = async () => {
  if (!incomingCall) return; // Kiểm tra nếu incomingCall không phải là null

  setIsReceivingCall(false); // Ẩn thông báo cuộc gọi đến
  peerConnection.current = new RTCPeerConnection(); // Khởi tạo kết nối peer

  // Lấy video và audio từ thiết bị
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  setLocalStream(stream); // Lưu stream địa phương
  stream.getTracks().forEach((track) => peerConnection.current!.addTrack(track, stream)); // Thêm các track vào peer connection

  // Thiết lập remote description bằng offer
  await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));

  // Tạo và gửi answer
  const answer = await peerConnection.current.createAnswer();
  await peerConnection.current.setLocalDescription(answer);
  socket.current.emit("videoCallAnswer", { answer, receiverId: incomingCall.callerId }); // Gửi answer tới người gọi
};


const rejectCall = () => {
  setIsReceivingCall(false);
  socket.current.emit("callRejected", { receiverId: incomingCall?.callerId });
};


const endCall = () => {
  // Kiểm tra nếu `localStream` không phải là null trước khi truy cập các track của nó
  if (localStream) {
    // Ngừng tất cả các track
    localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    setLocalStream(null); // Đặt lại `localStream` về null sau khi dừng các track
  }

  // Đóng peer connection nếu tồn tại
  if (peerConnection.current) {
    peerConnection.current.close();
    peerConnection.current = null;
  }

  // Ngắt socket khỏi các sự kiện liên quan đến cuộc gọi video
  socket.current.off("videoCall");
  socket.current.off("videoCallAnswer");

  // Cập nhật trạng thái để UI biết cuộc gọi đã kết thúc
  setIsCalling(false);
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
       {/* Phần thông báo cuộc gọi đến */}
       {isReceivingCall && incomingCall && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Cuộc gọi đến từ {incomingCall.callerName}</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => acceptCall()} // Sử dụng `incomingCall.offer` hợp lệ
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Chấp nhận
              </button>
              <button
                onClick={rejectCall}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
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
          <button onClick={() => startCall(false)} className="p-2 rounded-full hover:bg-gray-200">
            <FaPhone className="text-xl" />
          </button>
          <button onClick={() => startCall(true)} className="p-2 rounded-full hover:bg-gray-200">
            <FaVideo className="text-xl" />
          </button>
          <button onClick={handleToggleChat} className="p-2 rounded-full hover:bg-gray-200">
            <FaRegWindowMaximize className="text-xl" />
          </button>
        </div>
      </div>
    
    {/* Video Stream */}
    {isCalling && (
          <div className="flex flex-col items-center justify-center flex-1">
            <video
              ref={(ref) => ref && localStream && (ref.srcObject = localStream)}
              autoPlay
              muted
              className="w-1/2 border border-gray-400 rounded-lg"
            />
            <video
              ref={(ref) => ref && remoteStream && (ref.srcObject = remoteStream)}
              autoPlay
              className="w-1/2 border border-gray-400 rounded-lg mt-4"
            />
            <button onClick={endCall} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">End Call</button>
          </div>
        )}

  {isReceivingCall && (
    <div className="call-notification fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold mb-4">{incomingCall?.callerName} is calling you...</p>
        <button onClick={() => acceptCall()} className="px-4 py-2 bg-green-500 text-white rounded-md mr-2">Accept</button>
        <button onClick={() => rejectCall()} className="px-4 py-2 bg-red-500 text-white rounded-md">Reject</button>
      </div>
    </div>
  )}
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
            <p className="text-gray-500">No message between us</p>
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
            Send
          </button>
        </div>
      </div>
      {isOpen && (
        <ChatModal receiverId={receiverId} onClose={closeChat} />
      )}
    </div>
  );
  
};

export default Chat;
