import React from "react";
import UserManagement from "./UserManagement"; 
import PostManagement from "./PostManagement"; 
import ReportManagement from "./ReportManagement";
import { useMatch } from "react-router-dom";
import PostDetails from "./ReportDetail";

interface ContentAreaProps {
  selectedMenu: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ selectedMenu }) => {
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
    default:
      return <div>Welcome to Admin Dashboard</div>;
  }
};

export default ContentArea;
