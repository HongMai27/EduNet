import React, { useState } from 'react';
import { IPost } from '../../types/IPost';
import useFormattedTimestamp from '../../hooks/useFormatTimestamp';
import DropdownMenuButton from './DropdownMenu';
import PostActions from './PostActions';
import { Socket } from 'socket.io-client';
import FullscreenModal from '../Modals/FullscreenModal';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCaretRight } from 'react-icons/fa';

interface NewsFeedProps {
  posts: IPost[];
  handleRedirect: (postId: string) => void;
  handleRedirectToProfile: (userId: string) => void;
  handleLike: (
    postId: string, 
    isLiked: boolean, 
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>, 
    userId: string
  ) => void;
  handleAddComment: (
    postId: string, 
    content: string, 
    userId: string, 
    username:string, 
    avatar:string,
    setComments: React.Dispatch<React.SetStateAction<any[]>>
  ) => Promise<void>;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  userId: string;
  socket: Socket | null;
  userAvatar?: any;
  onDeletePost: (postId: string) => void; 

}

const NewsFeed: React.FC<NewsFeedProps> = ({
  posts,
  handleRedirect,
  handleRedirectToProfile,
  handleLike,
  handleAddComment,
  setPosts,
  userId,
  socket,
  onDeletePost, 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]); 
  const { formatTimestamp } = useFormattedTimestamp();
  const navigate = useNavigate();


  const openFullscreen = (type: 'image' | 'video', url: string) => {
    setMediaType(type);
    setMediaUrl(url);
    setIsModalOpen(true);
  };

  const closeFullscreen = () => {
    setIsModalOpen(false);
    setMediaUrl(null);
    setMediaType(null);
  };

  return (
    <section className="space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-4">
            <div
              className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4 cursor-pointer"
              onClick={() => handleRedirectToProfile(post.user._id)}
            >
              <img src={post.user?.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
            </div>

            <div className="cursor-pointer" onClick={() => handleRedirectToProfile(post.user._id)}>
              <h3 className="text-lg font-semibold dark:text-white flex items-center">
                {post.user?.username}
                {post.group && (
                 <span className="text-black dark:text-gray-400 mx-2">
                 <FaCaretRight /> 
               </span>
                )}
                {post.group && (
                  <span
                    className="text-blue-500 dark:text-blue-400 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      navigate(`/group/${post.group._id}`);
                    }}
                  >
                    {post.group.name}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(post.date)}</p>
            </div>

            <div className="flex items-center ml-auto">
              <span className="inline-block px-2 py-1 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900">
                {post.tag.tagname}
              </span>
              <DropdownMenuButton post={post} onDelete={onDeletePost} />
            </div>
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-justify"  onClick={() => navigate(`/detail/${post._id}`)}>
            {post.content}
          </p>

          {post.image && (
            <div className="mb-4 flex justify-center">
              <img
                src={post.image}
                alt="Post"
                className="rounded-lg w-full h-auto max-w-5xl object-cover"
                onClick={() => openFullscreen('image', post.image!)} 
              />
            </div>
          )}

          {post.video && (
            <div className="mb-4 flex justify-center">
              <video
                controls
                className="rounded-lg w-full h-auto max-w-5xl object-cover"
                onClick={() => openFullscreen('video', post.video!)}
              >
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {post.doc && post.doc.endsWith(".pdf") && (
            <div className="mb-4 flex justify-center">
              <embed 
                src={post.doc} 
                type="application/pdf" 
                width="100%" 
                height="600px" 
              />
            </div>
          )}


          <PostActions
            postId={post._id} 
            likes={post.likes || []}
            onLike={(postId, isLiked) => handleLike(postId, isLiked, setPosts, userId)} 
            onAddComment={handleAddComment}
            setComments={setComments}
          />

         {/* FullscreenModal  */}
          <FullscreenModal isOpen={isModalOpen} onClose={closeFullscreen}>
            {mediaType === 'image' && mediaUrl && (
              <img src={mediaUrl} alt="Fullscreen" className="w-full h-auto max-h-screen object-contain rounded-lg" />
            )}
            {mediaType === 'video' && mediaUrl && (
              <video
                src={mediaUrl}
                controls
                autoPlay 
                className="w-full h-auto max-h-screen object-contain rounded-lg"
              ></video>
            )}
          </FullscreenModal>
        </div>
      ))}
    </section>
  );
};

export default NewsFeed;
