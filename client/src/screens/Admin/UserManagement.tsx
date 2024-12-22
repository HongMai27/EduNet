import React, { useState, useEffect } from "react";
import axios from "axios";
import useFormattedTimestamp from "../../hooks/useFormatTimestamp";
import { FaTrash } from "react-icons/fa";
import { IUser } from "../../types/IUser";
import { searchUsersByUsername } from "../../services/userService";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { formatTimestamp } = useFormattedTimestamp();
 
  // Fetching user data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/api/auth/");
        const usersData = response.data;

        // Đếm số lượng bài viết cho từng user
        const usersWithPostCounts = usersData.map((user: any) => {
          return {
            ...user,
            postCount: user.posts ? user.posts.length : 0, 
          };
        });

        setUsers(usersWithPostCounts);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);



  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-20 ml-64">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Users List</h2>
      <table className="min-w-full table-auto border-collapse rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-700 text-sm">
            <th className="px-6 py-3 text-left">Username</th>
            <th className="px-6 py-3 text-left">Avatar</th>
            <th className="px-6 py-3 text-left">Point</th>
            <th className="px-6 py-3 text-left">Posts</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Reported</th>
            <th className="px-6 py-3 text-left">Last active</th>
            <th className="px-6 py-3 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
              <td className="border-b border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border-b border-gray-300 px-4 py-2">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mx-auto"
                />
              </td>
              <td className="border-b border-gray-300 px-4 py-2">{user.point || 0}</td>
              <td className="border-b border-gray-300 px-4 py-2 text-center">
                {user.postCount}
              </td>
              <td className="border-b border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border-b border-gray-300 px-4 py-2">
                Chưa làm
              </td>
              <td className="border-b border-gray-300 px-4 py-2">
                {user.lastActive ? formatTimestamp(user.lastActive) : "Không rõ"}
              </td>
              <td className="border-b border-gray-300 px-4 py-2 text-center">
                <div className="flex justify-center items-center h-full">
                  <FaTrash
                    className="text-red-500 cursor-pointer hover:text-red-700"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
