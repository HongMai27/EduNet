import React from "react";
import UserManagement from "./UserManagement"; // Component quản lý người dùng
import PostManagement from "./PostManagement"; // Component quản lý bài viết

interface ContentAreaProps {
  selectedMenu: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ selectedMenu }) => {
  if (selectedMenu === "user") {
    return <UserManagement />;
  }

  if (selectedMenu === "posts") {
    return <PostManagement />;
  }

  return <div className="p-6">Choose 1 section.</div>;
};

export default ContentArea;
