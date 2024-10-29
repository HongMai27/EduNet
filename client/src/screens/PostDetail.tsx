import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IPost } from "../types/IPost";
import PostActions from "../components/Forms/PostActions";
import useFormattedTimestamp from "../hooks/useFormatTimestamp";
import useAddcmt from "../hooks/useAddcmt";
import useLikeForPost from "../hooks/useLikeForPost";
import { fetchPostDetail } from "../services/postService";
import DropdownMenuButton from "../components/Forms/DropdownMenu";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>(); 
  const [post, setPost] = useState<IPost | null >(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatTimestamp } = useFormattedTimestamp(); 
  const { handleLike } = useLikeForPost();
  const { handleAddComment } = useAddcmt();

  useEffect(() => {
    const fetchDetail = async () => {
      if (postId) {
        try {
          const fetchedPost = await fetchPostDetail(postId);
          setPost(fetchedPost);
          setError(null);
        } catch {
          setError("Failed to fetch post detail");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Post ID is missing");
        setLoading(false);
      }
    };

    fetchDetail();
  }, [postId]);

  if (loading) return <p>Loading post details...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center pl-72 pr-72 mt-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-[95%]">
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
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{post.content}</p>
        {post.image && (
          <div className="mb-4 flex justify-center">
            <img src={post.image} alt="Post" />
          </div>
        )}
        <PostActions
          postId={post._id}
          likes={post.likes || []}
          onLike={(postId, isLiked) => handleLike(postId, isLiked, setPost)} 
          onAddComment={handleAddComment}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-[95%] mt-4">
        <h3 className="text-xl font-semibold">Comments:</h3>
        {post.comments && post.comments.length > 0 ? (
          post.comments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((comment) => (
              <div key={comment._id} className="border-b border-gray-300 mb-4 pb-2">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <img src={comment.user?.avatar} alt="Commenter Avatar" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="font-semibold">{comment.user?.username}</span>
                  <span className="text-sm text-gray-500 ml-2">{formatTimestamp(comment.date)}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
