import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../stores/AuthContext';
import { IUser } from '../types/IUser';
import { IPost } from '../types/IPost';
import useLike from '../hooks/useLike';
import Loader from '../components/Forms/Loader';
import useAddcmt from '../hooks/useAddcmt';
import { fetchUserById, editProfile } from '../services/userService';
import NewsFeed from '../components/Forms/Newfeed';
import EditProfileModal from '../components/Modals/EditProfileModal';
import useSocket from '../hooks/useSocket';
import FullscreenModal from '../components/Modals/FullscreenModal';
import Modal from '../components/Modals/CreatePostModal';
import useUploadFile from '../hooks/useUpload';
import { FaCamera } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();
  const { handleLike } = useLike({ socket });
  const { handleAddComment } = useAddcmt();
  const [isModalOpen, setModalOpen] = useState(false); 
  const [avatarModalOpen, setAvatarModalOpen] = useState(false); 
  const [isImageUploaded, setIsImageUploaded] = useState<string | null>(null);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false); 
  const { uploadFile, isUploading, uploadError } = useUploadFile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get user information
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('No user ID found');
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserById(userId);
        setUser(userData);

        const userPosts = await fetchUserById(userId);
        const sortedPosts = userPosts.posts.sort((a: IPost, b: IPost) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPosts(sortedPosts);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);



  // Handle avatar change (view, upload, or take)
  const handleAvatarChange = (type: string) => {
    if (type === 'view' && user?.avatar) {
      setMediaUrl(user.avatar);
      setIsFullscreenModalOpen(true);
    } else if (type === 'upload') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
  
      fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const uploadedImageUrl = await uploadFile(file, 'imageOrVideo'); 
          if (uploadedImageUrl) {
            setIsImageUploaded(uploadedImageUrl);
  
            const updatedProfileData = {
              ...user,
              avatar: uploadedImageUrl, 
            };
  
            try {
              const updatedUser = await editProfile(userId, updatedProfileData); 
              setUser(updatedUser); 
            } catch (error) {
              console.error('Error updating profile:', error);
            }
          }
        }
      };
  
      fileInput.click(); 
    } else if (type === 'take') {
      setIsCameraOpen(true); 
    }
  
    setAvatarModalOpen(false); 
  };
  
  

  // Handle photo capture
  const handleTakePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // draw img fr video to canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        //  canvas to blob and upload
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            
            // Upload Cloudinary
            const uploadedImageUrl = await uploadFile(file, 'imageOrVideo');
            
            if (uploadedImageUrl) {
              setIsImageUploaded(uploadedImageUrl); 
    
              const updatedProfileData = {
                ...user,
                avatar: uploadedImageUrl,
              };
    
              try {
                const updatedUser = await editProfile(userId, updatedProfileData); 
                setUser(updatedUser); 
              } catch (error) {
                console.error('Error updating profile:', error);
              }
            }
    
            // stop cam
            if (videoRef.current && videoRef.current.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              const tracks = stream.getTracks();
              tracks.forEach(track => track.stop());  
            }
  
            setIsCameraOpen(false);  
          }
        });
      }
    }
  };
  
  

  // Start camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera.');
    }
  };

  // Open camera and start it
  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
  }, [isCameraOpen]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());  
    }
    setIsCameraOpen(false); 
  };

  // Edit profile
  const handleEditProfile = async (updatedUser: any) => {
    try {
      const response = await editProfile(userId, updatedUser);
      setUser(response);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  {isUploading && <Loader />}
  {uploadError && <div className="error-message">{uploadError}</div>}

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 flex flex-col pt-20">
      <div className="flex flex-1 p-5">
        <main className="flex-1 bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-10 gap-6">
            <div className="col-span-3 p-4 border border-gray-300 dark:border-gray-700 rounded-lg h-[calc(100vh-160px)] self-start bg-white dark:bg-gray-800 flex flex-col items-center justify-between">
              <div className="w-full mb-4 h-60 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img src={user?.imgcover} alt="Cover" className="w-full h-full object-cover" />
              </div>
              
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mb-2 cursor-pointer relative" onClick={() => setAvatarModalOpen(true)}>
                <img src={isImageUploaded || user?.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
              </div>

              {/* Avatar Modal */}
              <Modal isVisible={avatarModalOpen} onClose={() => setAvatarModalOpen(false)}>
                <h3 className="text-lg font-semibold mb-4 text-center">Choose an action</h3>
                <div className="flex space-x-2 mb-4">
                  <button onClick={() => handleAvatarChange('view')} className="flex-1 p-2 text-blue-500 border border-gray-300 rounded-md hover:bg-gray-100">View avatar</button>
                  <button onClick={() => handleAvatarChange('take')} className="flex-1 p-2 text-blue-500 border border-gray-300 rounded-md hover:bg-gray-100">Take photo</button>
                  <button onClick={() => handleAvatarChange('upload')} className="flex-1 p-2 text-blue-500 border border-gray-300 rounded-md hover:bg-gray-100">Upload image</button>
                </div>
              </Modal>

              {/* Camera */}
              {isCameraOpen && (
                <div 
                  className="relative flex justify-center items-center flex-col" 
                  onClick={stopCamera} // Khi click ra ngoài, đóng camera
                  style={{ position: 'relative', height: 'auto' }}
                >
                  <video ref={videoRef} width="100%"  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} width="460" height="380" />
                  
                  {/* Nút chụp biểu tượng FaCamera nằm trong video */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Ngừng sự kiện bubble để không đóng camera khi nhấn vào nút
                      handleTakePhoto();
                    }} 
                    className="absolute bottom-5 p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
                    style={{ transform: 'translateX(-50%)', left: '50%' }}
                  >
                    <FaCamera size={30} />
                  </button>
                </div>
              )}

              {/* Profile Info */}
              <div className="flex flex-col items-center mb-4">
                <h1 className="text-3xl font-bold text-center">{user?.username}</h1>
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-4">
                <p>Phone: {user?.phone}</p>
                <p>Address: {user?.address}</p>
                <p>Date of birth: {user?.birthday}</p>
                <p>Sex: {user?.sex}</p>
                <p>Point: {user?.point}</p>
                <p>Email: {user?.email}</p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-auto mb-10 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Edit Profile
              </button>
            </div>

            <div className="col-span-7 p-4 border border-gray-300 dark:border-gray-700 rounded-lg overflow-auto h-[calc(100vh-160px)]">
              <h2 className="text-2xl font-bold mb-4">Posts</h2>

              {posts.length ? (
                <NewsFeed
                  posts={posts}
                  userAvatar={user?.avatar || isImageUploaded}
                  handleRedirect={(postId) => console.log(`Redirect to post ${postId}`)}
                  handleRedirectToProfile={() => {}}
                  handleLike={(postId, isLiked) => handleLike(postId, isLiked, setPosts, userId!)}
                  handleAddComment={handleAddComment}
                  setPosts={setPosts}
                  userId={userId!}
                  socket={socket}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <img
                    src="https://cdn.dribbble.com/users/2460221/screenshots/14347554/no-post.png" 
                    alt="No posts"
                    className="w-3/4 max-w-4xl opacity-70"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        user={{
          username: user?.username || '',
          phone: user?.phone || '',
          address: user?.address || '',
          birthday: user?.birthday || '',
          sex: user?.sex || '',
        }}
        onSave={handleEditProfile}
      />

      {isFullscreenModalOpen && mediaUrl && (
        <FullscreenModal isOpen={isFullscreenModalOpen} onClose={() => setIsFullscreenModalOpen(false)}>
          <img src={mediaUrl} alt="Avatar Fullscreen" className="w-full h-auto max-h-screen object-contain rounded-lg" />
        </FullscreenModal>
      )}
    </div>
  );
};

export default Profile;