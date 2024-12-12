import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Forms/Loader";
import axios from "axios";
import NewsFeed from "../components/Forms/Newfeed";
import useAddcmt from "../hooks/useAddcmt";
import Modal from "../components/Modals/CreatePostModal";
import PostForm from "../components/Forms/CreatePostForm";
import { fetchPosts } from "../services/postService";

const GroupPage: React.FC = () => {
  const { groupId } = useParams(); 
  const [group, setGroup] = useState<any | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]); 
  const { handleAddComment } = useAddcmt();
  const [groups, setGroups] = useState<any[]>([]); 
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false); 



  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:5000/api/posts/groupdetail/${groupId}`)
      .then((response) => {
        setGroup(response.data);
        setPosts(response.data.posts); 
        setLoading(false); 
      })
      .catch((err) => {
        setError("Failed to fetch group data.");
        setLoading(false);
      });
  }, [groupId]);

  
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

  const generateAvatar = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };
  
    // Handle post create
    const handlePostCreated = async () => {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
        setIsModalVisible(false);  
      };

  const handleGroupClick = (groupId: string) => {
    navigate(`/group/${groupId}`);  
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>; 
  if (!group) return <div className="text-center">No group information available.</div>; 

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 mt-20 flex" style={{
        backgroundImage: `url('https://media.istockphoto.com/id/1367756031/vector/light-blue-watercolor-background-illustration.jpg?s=612x612&w=0&k=20&c=qiJl7j-2terwHd-1YJxiFIo1VJx6l6IsmoqlgeypQ7c=')`,
      }}>
      {/* Left: groups list */}
      <div className="fixed left-0 shadow-md top-20 bottom-0 w-72 bg-white dark:bg-gray-800 p-8 overflow-y-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Groups</h2>
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
                    {generateAvatar(group.name)} 
                  </span>
                )}
              </div>
              {group.name}
            </li>
          ))
        )}
      </ul>
        </section>
      </div>

    {/* Group Information */}
      <div className="w-full mx-80 ">
        <section className="mb-8 bg-white mt-10 dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mr-4 overflow-hidden flex items-center justify-center">
                {group.avtgr ? (
                    <img
                    src={group.avtgr}
                    alt="Group Avatar"
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-white text-3xl font-bold">
                    {generateAvatar(group.name)}
                    </span>
                )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{group.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{group.description || "No description available."}</p>
                    <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 h-12 rounded-3xl border border-gray-300 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-2"
                            onClick={() => setIsModalVisible(true)}
                        >
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="flex-1 p-2 bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100"
                        />
                        </div>
                    </div>
                </div>
            {/* Create Post Modal */}
            <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
                <PostForm onPostCreated={handlePostCreated} />
            </Modal>
            </div>
            </section>

        {/* NewsFeed Section */}
        <section className="space-y-6">
          {posts.length ? (
            <NewsFeed
              posts={posts}
              userAvatar={group.admin.avatar || "https://via.placeholder.com/50"} 
              handleRedirect={(postId) => console.log(`Redirect to post ${postId}`)}
              handleRedirectToProfile={() => {}}
              handleLike={(postId, isLiked) => {
                console.log(`Liked post ${postId} with like status ${isLiked}`);
              }}
              handleAddComment={handleAddComment} 
              setPosts={setPosts}
              userId={group.admin._id}
              socket={null}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <img
                src="https://cdn.dribbble.com/users/2460221/screenshots/14347554/no-post.png" 
                alt="No posts"
                className="w-3/4 max-w-4xl opacity-70"
              />
              <p>No posts available.</p>
            </div>
          )}
        </section>
      </div>

      {/* Right: members */}
      <div className="fixed right-0 shadow-md top-20 bottom-0 w-72 bg-white dark:bg-gray-800 p-8 overflow-y-auto">
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
            Members ({group.members.length}) 
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {group.members.map((member: any) => (
                <li key={member._id} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    <img
                    src={member.avatar}
                    alt={member.username}
                    className="w-full h-full object-cover"
                    />
                </div>
                <span>{member.username}</span>
                </li>
            ))}
            </ul>
        </section>
        </div>
    </div>
  );
};

export default GroupPage;
