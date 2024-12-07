import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IPost } from "../types/IPost";
import PostActions from "../components/Forms/PostActions";
import useFormattedTimestamp from "../hooks/useFormatTimestamp";
import useAddcmt from "../hooks/useAddcmt";
import useLikeForPost from "../hooks/useLikeForPost";
import { deleteComment, editComment, fetchPostDetail } from "../services/postService";
import DropdownMenuButton from "../components/Forms/DropdownMenu";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatTimestamp } = useFormattedTimestamp();
  const { handleLike } = useLikeForPost();
  const { handleAddComment } = useAddcmt();
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false); 
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null); 
  const [editContent, setEditContent] = useState<string>('');


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

  //delete comment
  const handleConfirmDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteComment(postId, commentId); 
      toast.success('Comment deleted successfully');
  
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    } catch (err) {
      toast.error('Failed to delete comment: ' + (err as Error).message);
    } finally {
      setShowDeleteModal(false); 
    }
  };

  //edit comment
  const handleConfirmEditComment = async (postId:string, commentId: string, newContent: string) => {
    try {
      await editComment(postId, commentId, newContent); 
      toast.success('Comment updated successfully');
  
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    } catch (err) {
      toast.error('Failed to update comment: ' + (err as Error).message);
    } finally {
      setShowEditModal(false);
    }
  };

  if (loading) return <p>Loading post details...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center pl-72 pr-72 mt-20">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-[95%]">
        {/* post part */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            <img
              src={post.user?.avatar}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
            />
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
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {post.content}
        </p>
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
      {/* comment part */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-[95%] mt-4">
        {post.comments && post.comments.length > 0 ? (
          post.comments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((comment) => (
              <div
                key={comment._id}
                className="border border-gray-300 dark:border-gray-700 rounded-lg mb-4 p-4 flex items-start"
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <img
                    src={comment.user?.avatar}
                    alt="Commenter Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-base">{comment.user?.username}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTimestamp(comment.date)}
                      </span>
                    </div>

                    {/* Nút Edit và Delete */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditContent(comment.content);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base">{comment.content}</p>
                </div>

            {/* modal delete comment */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="mb-4">Are you sure you want to delete this comment?</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleConfirmDeleteComment(post._id, comment._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              )}

            {/* Modal edit */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Edit Comment</h3>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                    rows={4}
                  ></textarea>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleConfirmEditComment(post._id, comment._id, editContent)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
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
