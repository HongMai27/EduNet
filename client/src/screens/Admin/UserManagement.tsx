import React, { useState, useEffect } from "react";
import axios from "axios";
import useFormattedTimestamp from "../../hooks/useFormatTimestamp";
import { FaTrash } from "react-icons/fa";
import { IUser } from "../../types/IUser";

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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Avatar</th>
            <th className="border border-gray-300 px-4 py-2">Point</th>
            <th className="border border-gray-300 px-4 py-2">Posts</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Reported</th>
            <th className="border border-gray-300 px-4 py-2">Last active</th>
            <th className="border border-gray-300 px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 px-4 py-2">{user._id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mx-auto"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.point || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {user.postCount}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                Chưa làm
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user.lastActive ? formatTimestamp(user.lastActive) : "Không rõ"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <div className="flex justify-center items-center h-full">
                  <FaTrash
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    // Bạn có thể thêm hàm xử lý xóa người dùng vào đây
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
