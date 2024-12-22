import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; 
import { IPost } from "../../types/IPost";
import { deletePost } from "../../services/postService";


const SettingsPage: React.FC = () => {
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
      await deletePost(postId); 

      setPosts(posts.filter((post) => post._id !== postId)); 
    } catch (err) {
      setError("Failed to delete post.");  
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-20 ml-64">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Setting</h2>
      <table className="min-w-full table-auto border-collapse rounded-lg shadow-md overflow-hidden">
        <thead>
        <tr className="bg-gray-200 text-gray-700 text-sm">
            <th className="px-6 py-3 text-left">Poster</th>
            <th className="px-6 py-3 text-left">Tag</th>
            <th className="px-6 py-3 text-left">Content</th>
            <th className="px-6 py-3 text-left">Media</th>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-left">Likes</th>
            <th className="px-6 py-3 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
              <td className="border-b border-gray-300 px-6 py-3 text-left">{post.user.username}</td>
              <td className="border-b border-gray-300 px-6 py-3 text-left">{post.tag.tagname}</td>
              <td className="border-b border-gray-300 px-6 py-3 text-left">{post.content}</td>
              <td className="border-b border-gray-300 px-6 py-3 text-left">
                {post.image && (
                  <img
                    src={post.image}
                    alt="Media"
                    className="w-24 h-24 object-cover rounded"
                  />
                )}

                {post.video && (
                  <video
                    controls
                    className="w-24 h-24 object-cover rounded"
                  >
                    <source src={post.video} type="video/mp4" />
                  </video>
              )}
              </td>
              <td className="border-b border-gray-300 px-6 py-3 text-left">{new Date(post.date).toLocaleDateString()}</td>
              <td className="border-b border-gray-300 px-6 py-3 text-left">{post.likeCount}</td>
              <td className="border-b border-gray-300 px-4 py-2 text-center">
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

export default SettingsPage;
