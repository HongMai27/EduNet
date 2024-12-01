import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Thùng rác
import { IPost } from "../../types/IPost";
import { deletePost } from "../../services/postService";



const PostManagement: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/api/posts/");
        const postsData = response.data;

        // Đếm số like cho mỗi bài viết
        const postsWithLikeCount = postsData.map((post: any) => {
          return {
            ...post,
            likeCount: post.likes ? post.likes.length : 0, // Đếm số like
          };
        });

        setPosts(postsWithLikeCount);
      } catch (err) {
        setError("Failed to fetch posts data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  const handleDelete = async (postId: string) => {
    try {
      // Gọi service xóa bài viết
      await deletePost(postId); 

      // Cập nhật lại danh sách bài viết sau khi xóa thành công
      setPosts(posts.filter((post) => post._id !== postId)); 
    } catch (err) {
      setError("Failed to delete post.");  // Hiển thị lỗi nếu có
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Posts List</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Poster</th>
            <th className="border border-gray-300 px-4 py-2">Tag</th>
            <th className="border border-gray-300 px-4 py-2">Content</th>
            <th className="border border-gray-300 px-4 py-2">Media</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Likes</th>
            <th className="border border-gray-300 px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td className="border border-gray-300 px-4 py-2">{post._id}</td>
              <td className="border border-gray-300 px-4 py-2">{post.user.username}</td>
              <td className="border border-gray-300 px-4 py-2">{post.tag.tagname}</td>
              <td className="border border-gray-300 px-4 py-2">{post.content}</td>
              <td className="border border-gray-300 px-4 py-2">
                {post.image ? (
                  <img
                    src={post.image}
                    alt="Media"
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : (
                  "No media"
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">{new Date(post.date).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-4 py-2">{post.likeCount}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button onClick={() => handleDelete(post._id)} className="text-red-500">
                  <FaTrash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostManagement;
