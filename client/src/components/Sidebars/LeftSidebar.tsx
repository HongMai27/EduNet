import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import { useAuth } from '../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';


interface LeftSidebarProps {
  className?: string; 
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ className }) => {
  const { userId } = useAuth();  
  const [myGroups, setMyGroups] = useState<string[]>([]);  
  const [groups, setGroups] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);  
  const [newGroupName, setNewGroupName] = useState<string>('');  
  const [newGroupDescription, setNewGroupDescription] = useState<string>('');  
  const [newGroupMembers, setNewGroupMembers] = useState<string>('');  
  const [showCreateGroupForm, setShowCreateGroupForm] = useState<boolean>(false); 
  const [newGroupAvatar, setNewGroupAvatar] = useState<string>(''); 
  const navigate = useNavigate();


  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/posts/group');
        setGroups(response.data);  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []); 

  // craete gr
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert('Please enter a group name.');
      return;
    }
  
    if (!userId) {
      alert('User ID is missing. Please log in first.');
      return;
    }
   
    try {
      const token = localStorage.getItem('accessToken');  
      
      if (!token) {
        alert('You are not authenticated.');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:5000/api/posts/group', 
        {
          name: newGroupName,
          description: newGroupDescription,
          members: newGroupMembers.split(','),  
          avatar: newGroupAvatar,
          admin: userId, 
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,  
          }
        }
      );
  
      setGroups([...groups, response.data]);
      setShowCreateGroupForm(false);  // Đóng form tạo nhóm
      setNewGroupName('');  // Reset tên nhóm mới
      setNewGroupDescription('');  // Reset mô tả nhóm
      setNewGroupMembers('');  // Reset thành viên nhóm
      setNewGroupAvatar('');  // Reset avatar nhóm
    } catch (error: unknown) {  
      if (error instanceof AxiosError && error.response) {  
        if (error.response.status === 401) {
          alert('Unauthorized. Please log in.');
        } else {
          console.error('Error creating group:', error.response.data);
          console.log("Frontend userId:", userId);

        }
      } else {
        console.error('Unknown error occurred:', error);
      }
    }
  };

  const generateAvatar = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase(); // Lấy chữ cái đầu tiên của tên nhóm
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/group/${groupId}`);  
  };

  return (
    <div className={`fixed w-72 h-screen bg-white dark:bg-gray-800 p-4 mt-20 shadow-md flex flex-col ${className}`}>
      {/* My Groups Section
      <h2 className="text-lg font-semibold mb-4 dark:text-white">My Groups</h2>
        {myGroups.length === 0 ? (
        <p className=" text-gray-500 dark:text-gray-400">You have no group. Let create new group! </p>
        ) : (
          <ul className="space-y-4 mb-6">
            {myGroups.map((group, index) => (
              <li
                key={index}
                className="flex items-center text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
              >
                <img
                  src={generateRandomAvatar(index)}
                  alt="group avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                {group}
              </li>
            ))}
          </ul>
      )} */}

      {/* Groups Section */}
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Groups</h2>
      <ul className="space-y-4">
        {loading ? (
          <li className="text-center text-black dark:text-white">Loading...</li>
        ) : (
          groups.map((group) => (
            <li
              key={group._id}
              className="flex items-center text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
              onClick={() => handleGroupClick(group._id)} 
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 mr-2">
                {group.avtgr ? (
                  <img
                    src={group.avtgr}
                    alt="group avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {generateAvatar(group.name)}  {/* Hiển thị chữ cái đầu tiên của tên nhóm */}
                  </span>
                )}
              </div>
              {group.name}
            </li>
          ))
        )}
      </ul>

      {/* Create Group Button */}
      <button
        onClick={() => setShowCreateGroupForm(true)}
        className="mt-96 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Group
      </button>

      {/* Create Group Form Modal */}
      {showCreateGroupForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
            <div className="mb-4">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Group Description"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={newGroupMembers}
                onChange={(e) => setNewGroupMembers(e.target.value)}
                placeholder="Add Members"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
 
            <div className="flex justify-between">
              <button
                onClick={() => setShowCreateGroupForm(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
