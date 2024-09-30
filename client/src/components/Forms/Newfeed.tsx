import React from 'react';
import { IPost } from '../../types/IPost';
import useFormattedTimestamp from '../../hooks/useFormatTimestamp';
import DropdownMenuButton from './DropdownMenu';
import PostActions from './PostActions';


interface NewsFeedProps {
    posts: IPost[];
    handleRedirect: (postId: string) => void;
    handleLike: (postId: string, isLiked: boolean, setPosts: React.Dispatch<React.SetStateAction<IPost[]>>) => void;
    handleAddComment: (postId: string, content: string) => Promise<void>; 
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>; 
  }
  
  const NewsFeed: React.FC<NewsFeedProps> = ({ posts, handleRedirect, handleLike, handleAddComment, setPosts }) => {
    const { formatTimestamp } = useFormattedTimestamp();
  
    return (
      <section className="space-y-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                <img src={post.user?.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{post.user?.username}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTimestamp(post.date)}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-block px-2 py-1 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900">
                  {post.tag.tagname}
                </span>
                <DropdownMenuButton post={post} />
              </div>
            </div>
            <p
              className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-justify"
              onClick={() => handleRedirect(post._id)}
            >
              {post.content}
            </p>
            {post.image && (
              <div className="mb-4 flex justify-center">
                <img src={post.image} alt="Post" />
              </div>
            )}
            {/* PostActions component */}
            <PostActions
              postId={post._id}
              likes={post.likes || []}
              onLike={(postId, isLiked) => handleLike(postId, isLiked, setPosts)} 
              onAddComment={handleAddComment} 
            />
          </div>
        ))}
      </section>
    );
  };

export default NewsFeed;
