import React from "react";

interface VideoStreamProps {
  isCalling: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  endCall: () => void;
}

const VideoStream: React.FC<VideoStreamProps> = ({ isCalling, localStream, remoteStream, endCall }) => {
  if (!isCalling) return null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-4 my-32">
      {/* Các video stream nằm trên cùng một hàng */}
      <div className="flex flex-row space-x-4">
        <video
          ref={(ref) => ref && localStream && (ref.srcObject = localStream)}
          autoPlay
          muted
          className="w-1/2 border border-gray-400 rounded-lg"
        />
        <video
          ref={(ref) => ref && remoteStream && (ref.srcObject = remoteStream)}
          autoPlay
          className="w-1/2 border border-gray-400 rounded-lg"
        />
      </div>

      {/* Nút End Call nằm dưới và canh giữa */}
      <button
        onClick={endCall}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoStream;
