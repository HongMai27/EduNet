import React from "react";
import UserManagement from "./UserManagement";
import PostManagement from "./PostManagement";
import ReportManagement from "./ReportManagement";
import { useMatch } from "react-router-dom";
import PostDetails from "./ReportDetail";
import StatisticalPage from "./Statistical";
import SettingPage from "./Setting";

interface ContentAreaProps {
  selectedMenu: string;
  users: any[]; // Dữ liệu người dùng tìm kiếm
}

const ContentArea: React.FC<ContentAreaProps> = ({ selectedMenu, users }) => {
  const isPostDetail = useMatch("/admin/posts/:id");

  if (isPostDetail) {
    return <PostDetails />;
  }

  switch (selectedMenu) {
    case "user":
      return <UserManagement />;
    case "posts":
      return <PostManagement />;
    case "report":
      return <ReportManagement />;
    case "statistical":
      return <StatisticalPage />;
    case "setting":
      return <SettingPage />;
    case "search":
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Avatar</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
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
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return <div>Welcome to Admin Dashboard</div>;
  }
};

export default ContentArea;
