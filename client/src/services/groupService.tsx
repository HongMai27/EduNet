import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

export const fetchGroupDetails = async (groupId: string) => {
  try {
    const response = await axios.get(`${API_URL}/groupdetail/${groupId}`);
    return response.data; // Return the group data, including posts
  } catch (error) {
    throw new Error('Failed to fetch group data.');
  }
};

export const fetchAllGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}/group`);
    return response.data; // Return list of groups
  } catch (error) {
    throw new Error('Failed to fetch groups.');
  }
};
