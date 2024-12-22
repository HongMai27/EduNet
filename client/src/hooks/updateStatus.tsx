import axios from "axios";

export const updateUserStatus = async (isOnline: boolean) => {
    console.log("Calling updateUserStatus with isOnline =", isOnline); 
    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/update-status',
        { isOnline },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log('Status updated:', response.data.message);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  