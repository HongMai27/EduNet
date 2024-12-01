import React, { useEffect, useState } from 'react';
import LeftSetting from '../components/Sidebars/LeftSetting';
import Modal from '../components/Modals/CreatePostModal';
import { changePassword, requestPasswordReset } from '../services/authService';
import ForgotPasswordForm from '../components/Forms/ForgotPasswordForm';
import ChangePasswordForm from '../components/Forms/ChangePasswordForm';
import { toast } from 'react-toastify';
import { getSavedPosts } from '../services/postService';
import { useAuth } from '../stores/AuthContext';
import FullscreenModal from '../components/Modals/FullscreenModal';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('savePosts');
  const { userId } = useAuth();
  const [isModalForfotpass, setModalForgotpass] = useState<boolean>(false); 
  const [isModalChangepass, setModalChangepass] = useState<boolean>(false); 
  const [isModalFullscreen, setIsModalFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(localStorage.getItem('email') || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);  


  useEffect(() => {
    if (userId && selectedOption === 'savePosts') {
      getSavedPosts(userId)
        .then((posts) => {
          setSavedPosts(posts); 
        })
        .catch((error) => {
          console.error('Error fetching saved posts:', error);
        });
    }
  }, [selectedOption, userId]); 

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handlePasswordReset = async () => {
    try {
      const message = await requestPasswordReset(email);
      setStatusMessage(message);
    } catch (error) {
      setStatusMessage((error as Error).message); 
    }
  };
  
  const handleChangePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      setStatusMessage('');
      
      const result = await changePassword(oldPassword, newPassword, confirmPassword);
      
      setStatusMessage(result);  
      toast.success(result || 'Password changed successfully!');
      setModalChangepass(false); 
    } catch (error: any) {
      setStatusMessage(error.message || "Failed to change password.");
    } finally {
      setIsLoading(false); 
    }
  };
  
  const handleRedirect = (postId: string) => {
    navigate(`/detail/${postId}`);
  };

   // Handle redirect to profile
   const handleRedirectToProfile = (userId: string) => {
    navigate(`/profiles/${userId}`); 
  };

  const openFullscreen = (image: string) => {
    setSelectedImage(image);
    setIsModalFullscreen(true);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
    setIsModalFullscreen(false);
  };
  return (
    <div className="flex mt-20">
      {/* LeftSidebar  */}
      <LeftSetting
        className="w-72"
        onSelectOption={handleSelectOption}
        selectedOption={selectedOption}
      />

      <div className="flex-1 ml-72 bg-gray-100 dark:bg-gray-900 p-6">
      {/* saved posts*/}
        {selectedOption === 'savePosts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedPosts.length > 0 ? (
              savedPosts.map((post: any) => (
                <div key={post._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full flex flex-col">
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.user?.avatar}
                      alt="avatar"
                      className="w-12 h-12 rounded-full"
                      onClick={() => handleRedirectToProfile(post.user?._id)}
                    />
                    <div>
                      <h3 className="font-semibold dark:text-gray-300 text-lg" onClick={() => handleRedirectToProfile(post.user?._id)}>{post.user?.username}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{new Date(post.date).toLocaleDateString()} </p>
                    </div>
                  </div>
                  <p 
                    className={`mt-4 text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis ${post.image ? 'max-h-16' : 'max-h-56'}`}
                    onClick={() => handleRedirect(post._id)}
                  >
                    {post.content}
                  </p>
                  
                  {post.image && (
                    <div className="mt-4">
                      <img
                        src={post.image}
                        alt="Post Image"
                        className="w-full h-48 rounded-lg object-cover"
                        onClick={() => openFullscreen(post.image)} 
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">No saved posts found</div>
            )}
          </div>
        )}


        {/* Manage Password */}
        {selectedOption === 'password' && (
          <div className="grid grid-cols-2 gap-8">
            {/* Forget Password */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Forget Password</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Click here if you've forgotten your password and need help recovering it.
              </p>
              <img
                src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg?t=st=1730974051~exp=1730977651~hmac=6803c99620a24e82b4f2a70402c258c50973c0595f6355b799d39f66417645b4&w=740" 
                alt="Forget Password Illustration"
                className="w-full h-auto object-cover rounded-lg"
                onClick={() => setModalForgotpass(true)}
              />
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Change Password</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Update your current password to keep your account secure.
              </p>
              <img
                src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7966.jpg?t=st=1730973561~exp=1730977161~hmac=8d411338d148957d0ddcae995eb638221718ff54e37b6a5521172cb216ff6a4c&w=740" 
                alt="Change Password Illustration"
                className="w-full h-auto object-cover rounded-lg"
                onClick={() => setModalChangepass(true)}
              />
            </div>
          </div>
        )}

        {selectedOption === 'activity' && <div>Activity content</div>}
        {selectedOption === 'notification' && <div>Notification content</div>}
        {selectedOption === 'language' && <div>Language content</div>}
        {selectedOption === 'help' && <div>Help content</div>}
      </div>
      {/* Modal Forget Password */}
      <Modal isVisible={isModalForfotpass} onClose={() => setModalForgotpass(false)}>
        <ForgotPasswordForm
          onSubmit={handlePasswordReset}
          isLoading={isLoading}
          statusMessage={statusMessage}
        />
      </Modal>

      {/* Modal Change Password */}
      <Modal isVisible={isModalChangepass} onClose={() => setModalChangepass(false)}>
        <ChangePasswordForm
          onSubmit={handleChangePassword}
          isLoading={isLoading}
          statusMessage={statusMessage}
        />
      </Modal>
      
       {/* Modal show image fullscreen */}
       <FullscreenModal isOpen={isModalFullscreen} onClose={closeFullscreen}>
        {selectedImage && <img src={selectedImage} alt="Fullscreen Image" className="w-full h-auto max-h-screen object-contain rounded-lg" />}
      </FullscreenModal>
    </div>
  );
};

export default SettingsPage;